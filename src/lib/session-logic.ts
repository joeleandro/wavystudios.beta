import getDb from './db';
import { generateId, getWeekStart, addMinutesToTime, timeToMinutes } from './utils';

interface ConflictResult {
  hasConflict: boolean;
  message?: string;
  nextAvailable?: string;
}

interface BookingResult {
  success: boolean;
  message: string;
  sessaoId?: string;
}

// Check for time conflicts across all sessions
export function checkGlobalConflict(
  data: string,
  horaInicio: string,
  duracao: number,
  excludeId?: string
): ConflictResult {
  const db = getDb();
  const horaFim = addMinutesToTime(horaInicio, duracao);
  
  let query = `
    SELECT * FROM sessoes 
    WHERE data = ? 
    AND hora_inicio < ? 
    AND hora_fim > ? 
    AND estado IN ('pendente', 'confirmada')
  `;
  const params: string[] = [data, horaFim, horaInicio];
  
  if (excludeId) {
    query += ' AND id != ?';
    params.push(excludeId);
  }

  const conflicts = db.prepare(query).all(...params);
  
  if (conflicts.length > 0) {
    // Find next available slot
    const allSessions = db.prepare(`
      SELECT hora_inicio, hora_fim FROM sessoes 
      WHERE data = ? AND estado IN ('pendente', 'confirmada')
      ORDER BY hora_inicio
    `).all(data) as { hora_inicio: string; hora_fim: string }[];
    
    let nextSlot = '09:00';
    for (const session of allSessions) {
      if (timeToMinutes(session.hora_fim) <= timeToMinutes(nextSlot)) continue;
      if (timeToMinutes(nextSlot) + duracao <= timeToMinutes(session.hora_inicio)) break;
      nextSlot = session.hora_fim;
    }
    
    if (timeToMinutes(nextSlot) + duracao > timeToMinutes('22:00')) {
      return { hasConflict: true, message: 'Sem slots disponíveis neste dia.' };
    }
    
    return { 
      hasConflict: true, 
      message: `Conflito de horário. Próximo slot disponível: ${nextSlot}`,
      nextAvailable: nextSlot
    };
  }
  
  return { hasConflict: false };
}

// Check weekly hours for a client
export function checkWeeklyHours(
  clienteId: string,
  data: string,
  duracao: number
): ConflictResult {
  const db = getDb();
  const weekStart = getWeekStart(new Date(data));
  
  // Get client plan
  const cliente = db.prepare(`
    SELECT c.*, p.horas_semanais, p.duracao_sessao_min 
    FROM clientes c 
    JOIN planos p ON c.plano_id = p.id 
    WHERE c.id = ?
  `).get(clienteId) as { horas_semanais: number } | undefined;
  
  if (!cliente) {
    return { hasConflict: true, message: 'Cliente não encontrado ou sem plano.' };
  }

  // Calculate used hours this week
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  const weekEndStr = weekEnd.toISOString().split('T')[0];

  const used = db.prepare(`
    SELECT COALESCE(SUM(duracao_minutos), 0) as total 
    FROM sessoes 
    WHERE cliente_id = ? 
    AND data >= ? AND data <= ?
    AND estado IN ('pendente', 'confirmada', 'concluida')
  `).get(clienteId, weekStart, weekEndStr) as { total: number };

  const horasUsadas = used.total / 60;
  const horasPlano = cliente.horas_semanais;
  const horasRestantes = horasPlano - horasUsadas;
  const duracaoHoras = duracao / 60;

  if (horasUsadas + duracaoHoras > horasPlano) {
    return { 
      hasConflict: true, 
      message: `Horas semanais esgotadas. Usadas: ${horasUsadas.toFixed(1)}h / ${horasPlano}h. Restantes: ${horasRestantes.toFixed(1)}h` 
    };
  }
  
  return { hasConflict: false };
}

// Book a session with full conflict checking
export function bookSession(
  clienteId: string,
  tipo: string,
  data: string,
  horaInicio: string
): BookingResult {
  const db = getDb();
  
  // Get client's plan duration
  const cliente = db.prepare(`
    SELECT c.*, p.duracao_sessao_min, p.horas_semanais
    FROM clientes c 
    JOIN planos p ON c.plano_id = p.id 
    WHERE c.id = ?
  `).get(clienteId) as { duracao_sessao_min: number; horas_semanais: number } | undefined;
  
  if (!cliente) {
    return { success: false, message: 'Cliente não encontrado ou sem plano ativo.' };
  }

  const duracao = cliente.duracao_sessao_min;
  
  // 1. Check global conflict
  const globalConflict = checkGlobalConflict(data, horaInicio, duracao);
  if (globalConflict.hasConflict) {
    return { success: false, message: globalConflict.message! };
  }
  
  // 2. Check weekly hours
  const weeklyCheck = checkWeeklyHours(clienteId, data, duracao);
  if (weeklyCheck.hasConflict) {
    return { success: false, message: weeklyCheck.message! };
  }
  
  // 3. All clear — create session
  const horaFim = addMinutesToTime(horaInicio, duracao);
  const sessaoId = generateId('sess');
  
  db.prepare(`
    INSERT INTO sessoes (id, cliente_id, tipo, data, hora_inicio, hora_fim, duracao_minutos, estado)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'pendente')
  `).run(sessaoId, clienteId, tipo, data, horaInicio, horaFim, duracao);
  
  // 4. Create notification for admin
  const adminId = db.prepare("SELECT id FROM clientes WHERE role = 'admin' LIMIT 1").get() as { id: string } | undefined;
  if (adminId) {
    const clienteNome = db.prepare("SELECT nome FROM clientes WHERE id = ?").get(clienteId) as { nome: string };
    db.prepare(`
      INSERT INTO notificacoes (id, destinatario_id, tipo, canal, mensagem)
      VALUES (?, ?, 'nova_sessao', 'plataforma', ?)
    `).run(
      generateId('notif'),
      adminId.id,
      `Nova sessão de ${clienteNome.nome}: ${tipo} em ${data} às ${horaInicio}`
    );
  }
  
  return { success: true, message: 'Sessão marcada com sucesso!', sessaoId };
}

// Get available time slots for a given date
export function getAvailableSlots(data: string, duracao: number): string[] {
  const db = getDb();
  const slots: string[] = [];
  
  // Studio hours: 09:00 - 22:00
  const startHour = 9;
  const endHour = 22;
  
  const existing = db.prepare(`
    SELECT hora_inicio, hora_fim FROM sessoes 
    WHERE data = ? AND estado IN ('pendente', 'confirmada')
    ORDER BY hora_inicio
  `).all(data) as { hora_inicio: string; hora_fim: string }[];
  
  // Generate all possible slots in 30min increments
  for (let minutes = startHour * 60; minutes + duracao <= endHour * 60; minutes += 30) {
    const slotStart = `${Math.floor(minutes / 60).toString().padStart(2, '0')}:${(minutes % 60).toString().padStart(2, '0')}`;
    const slotEnd = addMinutesToTime(slotStart, duracao);
    
    // Check if this slot conflicts with any existing session
    const hasConflict = existing.some(s => {
      const existingStart = timeToMinutes(s.hora_inicio);
      const existingEnd = timeToMinutes(s.hora_fim);
      const newStart = minutes;
      const newEnd = minutes + duracao;
      return newStart < existingEnd && newEnd > existingStart;
    });
    
    if (!hasConflict) {
      slots.push(slotStart);
    }
  }
  
  return slots;
}

// Get weekly hours status for a client
export function getWeeklyStatus(clienteId: string, date?: Date) {
  const db = getDb();
  const targetDate = date || new Date();
  const weekStart = getWeekStart(targetDate);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  const weekEndStr = weekEnd.toISOString().split('T')[0];

  const cliente = db.prepare(`
    SELECT c.*, p.horas_semanais, p.nome as plano_nome, p.duracao_sessao_min
    FROM clientes c 
    JOIN planos p ON c.plano_id = p.id 
    WHERE c.id = ?
  `).get(clienteId) as { horas_semanais: number; plano_nome: string; duracao_sessao_min: number } | undefined;

  if (!cliente) return null;

  const used = db.prepare(`
    SELECT COALESCE(SUM(duracao_minutos), 0) as total 
    FROM sessoes 
    WHERE cliente_id = ? 
    AND data >= ? AND data <= ?
    AND estado IN ('pendente', 'confirmada', 'concluida')
  `).get(clienteId, weekStart, weekEndStr) as { total: number };

  const horasUsadas = used.total / 60;
  const horasPlano = cliente.horas_semanais;

  return {
    semana_inicio: weekStart,
    horas_plano: horasPlano,
    horas_usadas: horasUsadas,
    horas_restantes: Math.max(0, horasPlano - horasUsadas),
    plano_nome: cliente.plano_nome,
    duracao_sessao: cliente.duracao_sessao_min,
  };
}

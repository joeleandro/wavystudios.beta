-- Add produtor column to sessoes table
ALTER TABLE sessoes ADD COLUMN IF NOT EXISTS produtor TEXT;

-- Produtores disponíveis: Bere, Wavy, Alexandre Campos

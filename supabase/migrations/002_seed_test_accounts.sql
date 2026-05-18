-- RUN THIS AFTER 001_initial.sql
-- This creates test accounts for development

-- NOTE: Test accounts are created via /api/seed endpoint instead.
-- Just visit: https://your-domain.com/api/seed
-- This will create:
--   admin@sgstudio.pt / admin123 (role: admin)
--   cliente@sgstudio.pt / cliente123 (role: cliente, plano: Professional)

-- If the trigger handle_new_user() doesn't fire (common on some Supabase plans),
-- profiles need to be created manually. The /api/seed endpoint handles this.

-- To verify the trigger exists:
-- SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';

-- If profiles table is empty after signup, the trigger didn't fire.
-- Fix: Run the trigger creation from 001_initial.sql again, or use /api/seed.

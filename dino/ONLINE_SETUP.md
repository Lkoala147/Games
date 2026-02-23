# Dino Runner Online (Supabase) - Pasos

Este proyecto ya tiene integración online en el juego con comandos:
- `onlineconfig <url> <anon_key>`
- `onlinestatus`
- `onlinerank`
- `onlinesync`
- `onlineclear`

## 1) Crear proyecto en Supabase
1. Ve a https://supabase.com y crea cuenta.
2. Crea un proyecto nuevo.
3. Espera a que termine de inicializar.

## 2) Crear tabla de ranking
1. Abre **SQL Editor** en Supabase.
2. Copia y ejecuta el archivo `supabase_schema.sql`.
3. Verifica que existe la tabla `public.dino_leaderboard`.

## 3) Copiar URL y ANON KEY
1. En Supabase, entra en **Project Settings > API**.
2. Copia:
   - `Project URL`
   - `anon public key`

## 4) Conectar el juego
1. Abre el juego.
2. Abre consola de comandos (tab).
3. Ejecuta:
   - `onlineconfig TU_PROJECT_URL TU_ANON_KEY`
4. Comprueba:
   - `onlinestatus`
   - Debe indicar `ONLINE activo`.

## 5) Probar ranking online
1. Juega una partida.
2. Al perder, el juego sincroniza score automáticamente.
3. Ejecuta:
   - `onlinerank`
4. O abre el menú `Ranking global` (si online está activo, leerá Supabase).

## 6) Solución de problemas
- Si `onlinestatus` dice desactivado:
  - revisa URL/key y repite `onlineconfig ...`.
- Si no guarda score:
  - revisa que ejecutaste `supabase_schema.sql`.
  - revisa políticas RLS de `select/insert/update`.
- Para volver a offline:
  - `onlineclear`

## 7) Recomendación de seguridad
- Usa siempre la `anon key` (nunca service role en frontend).
- Si luego quieres reglas más estrictas, añade autenticación real y políticas por usuario.

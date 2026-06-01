// =============================================================
//  GESTIÓN DE USUARIOS — Programación de Producción Distrihogar
// =============================================================
//
//  CÓMO AGREGAR UN USUARIO NUEVO
//  ------------------------------
//  1. Defina un nombre de usuario y contraseña.
//  2. Genere el hash SHA-256 de la contraseña abriendo Chrome/Edge,
//     presionando F12 (Consola) y ejecutando:
//
//       (async () => {
//         const buf = await crypto.subtle.digest(
//           'SHA-256', new TextEncoder().encode('mi_contraseña')
//         );
//         const hash = [...new Uint8Array(buf)]
//           .map(b => b.toString(16).padStart(2, '0')).join('');
//         console.log('Hash:', hash);
//       })();
//
//  3. Copie el hash resultante al campo "passwordHash" del nuevo usuario.
//  4. Guarde este archivo y suba los cambios (git commit + push).
//
//  USUARIOS INICIALES (cambie las contraseñas después del primer acceso)
//  ─────────────────────────────────────────────────────────────────────
//  admin          →  admin2024
//  produccion     →  produccion2024
// =============================================================

const AUTH_CONFIG = {
  sessionKey: 'dp_auth_v1',   // Clave en localStorage
  sessionHours: 8              // Duración de sesión (horas)
};

const USERS = [
  {
    username: 'admin',
    passwordHash: 'b8b8eb83374c0bf3b1c3224159f6119dbfff1b7ed6dfecdd80d4e8a895790a34',
    name: 'Administrador',
    role: 'admin'
  },
  {
    username: 'produccion',
    passwordHash: '6195079db2109e35010d1feb203184c6b90a53c36e8c32925840e6a15ac675e0',
    name: 'Equipo Producción',
    role: 'user'
  }
  // Agregue más usuarios aquí siguiendo el mismo formato:
  // {
  //   username: 'nombre_usuario',
  //   passwordHash: 'hash_sha256_de_la_contraseña',
  //   name: 'Nombre Completo',
  //   role: 'user'
  // },
];

// ──────────────────────────────────────────────────────────────
//  Funciones de autenticación (no modificar)
// ──────────────────────────────────────────────────────────────

async function hashPassword(password) {
  const buf = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(password)
  );
  return [...new Uint8Array(buf)]
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

async function authenticate(username, password) {
  const hash = await hashPassword(password);
  const user = USERS.find(
    u => u.username === username.toLowerCase().trim() &&
         u.passwordHash === hash
  );
  return user || null;
}

function getSession() {
  try {
    const raw = localStorage.getItem(AUTH_CONFIG.sessionKey);
    if (!raw) return null;
    const session = JSON.parse(raw);
    if (Date.now() > session.expiresAt) {
      localStorage.removeItem(AUTH_CONFIG.sessionKey);
      return null;
    }
    return session;
  } catch (e) {
    return null;
  }
}

function saveSession(user) {
  const session = {
    username: user.username,
    name: user.name,
    role: user.role,
    loginAt: Date.now(),
    expiresAt: Date.now() + AUTH_CONFIG.sessionHours * 3600 * 1000
  };
  localStorage.setItem(AUTH_CONFIG.sessionKey, JSON.stringify(session));
  return session;
}

function clearSession() {
  localStorage.removeItem(AUTH_CONFIG.sessionKey);
}

// frontend/js/auth.js
// Manejo de login y registro básicos usando fetch hacia /api

(function () {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const msg = document.getElementById('msg');

  // Envío de login
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    msg.textContent = '';
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        msg.textContent = 'Credenciales inválidas';
        return;
      }
      // Guardado mínimo en localStorage para simular sesión
      localStorage.setItem('crudclinic_logged', 'true');
      localStorage.setItem('crudclinic_user', JSON.stringify(data.user));
      window.location.href = '/dashboard.html';
    } catch (_err) {
      msg.textContent = 'Error de conexión';
    }
  });

  // Registro básico
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    msg.textContent = '';
    const username = document.getElementById('regUsername').value.trim();
    const password = document.getElementById('regPassword').value.trim();
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (!res.ok) {
        msg.textContent = 'No se pudo crear el usuario';
        return;
      }
      msg.textContent = 'Usuario creado. Ahora inicia sesión.';
    } catch (_err) {
      msg.textContent = 'Error de conexión';
    }
  });
})();



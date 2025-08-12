// frontend/js/dashboard.js
// Lógica del panel: cargar listas, CRUD de citas y consultas avanzadas

(function () {
  // Redirección si no hay "sesión" local (mínima)
  const logged = localStorage.getItem('crudclinic_logged') === 'true';
  if (!logged) {
    window.location.href = '/';
    return;
  }

  // Referencias DOM
  const tbody = document.querySelector('#appointmentsTable tbody');
  const logoutBtn = document.getElementById('logoutBtn');

  const patientSelect = document.getElementById('patientId');
  const doctorSelect = document.getElementById('doctorId');

  const doctorFilter = document.getElementById('doctorFilter');
  const startDate = document.getElementById('startDate');
  const endDate = document.getElementById('endDate');
  const btnFilter = document.getElementById('btnFilter');
  const qDoctorResult = document.getElementById('qDoctorResult');

  const iStartDate = document.getElementById('iStartDate');
  const iEndDate = document.getElementById('iEndDate');
  const btnIncome = document.getElementById('btnIncome');
  const qIncomeResult = document.getElementById('qIncomeResult');

  const appointmentForm = document.getElementById('appointmentForm');
  const appointmentModalEl = document.getElementById('appointmentModal');
  const appointmentId = document.getElementById('appointmentId');

  const appointmentDate = document.getElementById('appointmentDate');
  const appointmentTime = document.getElementById('appointmentTime');
  const status = document.getElementById('status');
  const paymentMethod = document.getElementById('paymentMethod');
  const amount = document.getElementById('amount');

  let appointmentModal;

  // Inicialización: cargar datos de selects y tabla
  document.addEventListener('DOMContentLoaded', async () => {
    appointmentModal = bootstrap.Modal.getOrCreateInstance(appointmentModalEl);
    await Promise.all([loadPatients(), loadDoctors()]);
    await loadAppointments();
    await loadDoctorFilter();
  });

  // Cierre de sesión
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('crudclinic_logged');
    localStorage.removeItem('crudclinic_user');
    window.location.href = '/';
  });

  // Cargar listas auxiliares
  async function loadPatients() {
    const res = await fetch('/api/patients');
    const data = await res.json();
    patientSelect.innerHTML = data.map(p => `<option value="${p.id}">${p.name}</option>`).join('');
  }

  async function loadDoctors() {
    const res = await fetch('/api/doctors');
    const data = await res.json();
    doctorSelect.innerHTML = data.map(d => `<option value="${d.id}">${d.name} (${d.specialty})</option>`).join('');
  }

  async function loadDoctorFilter() {
    const res = await fetch('/api/doctors');
    const data = await res.json();
    doctorFilter.innerHTML = data.map(d => `<option value="${d.id}">${d.name} (${d.specialty})</option>`).join('');
  }

  // Cargar tabla de citas
  async function loadAppointments() {
    const res = await fetch('/api/appointments');
    const data = await res.json();
    tbody.innerHTML = data.map(a => `
      <tr>
        <td>${a.id}</td>
        <td>${a.patient_name}</td>
        <td>${a.doctor_name}</td>
        <td>${a.specialty}</td>
        <td>${a.appointment_date}</td>
        <td>${a.appointment_time}</td>
        <td>${a.status}</td>
        <td>${a.payment_method}</td>
        <td>$${Number(a.amount).toFixed(2)}</td>
        <td class="text-end">
          <button class="btn btn-sm btn-outline-secondary me-1" onclick="editAppointment(${a.id})">Editar</button>
          <button class="btn btn-sm btn-outline-danger" onclick="deleteAppointment(${a.id})">Eliminar</button>
        </td>
      </tr>
    `).join('');
  }

  // Funciones globales simples para botones de tabla
  window.editAppointment = async (id) => {
    const res = await fetch(`/api/appointments/${id}`);
    const a = await res.json();
    appointmentId.value = a.id;
    patientSelect.value = a.patient_id;
    doctorSelect.value = a.doctor_id;
    appointmentDate.value = a.appointment_date;
    appointmentTime.value = a.appointment_time;
    status.value = a.status;
    paymentMethod.value = a.payment_method;
    amount.value = a.amount;
    appointmentModal.show();
  };

  window.deleteAppointment = async (id) => {
    if (!confirm('¿Eliminar esta cita?')) return;
    const res = await fetch(`/api/appointments/${id}`, { method: 'DELETE' });
    if (res.status === 204) {
      await loadAppointments();
    } else {
      alert('No se pudo eliminar');
    }
  };

  // Crear/actualizar cita desde el modal
  appointmentForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
      patient_id: Number(patientSelect.value),
      doctor_id: Number(doctorSelect.value),
      appointment_date: appointmentDate.value,
      appointment_time: appointmentTime.value,
      status: status.value,
      payment_method: paymentMethod.value,
      amount: Number(amount.value || 0)
    };
    const id = appointmentId.value;
    const opts = {
      method: id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    };
    const url = id ? `/api/appointments/${id}` : '/api/appointments';
    const res = await fetch(url, opts);
    if (res.ok) {
      appointmentId.value = '';
      appointmentModal.hide();
      await loadAppointments();
    } else {
      alert('No se pudo guardar la cita');
    }
  });

  // Consultas avanzadas
  btnFilter.addEventListener('click', async () => {
    const doctorId = doctorFilter.value;
    if (!doctorId || !startDate.value || !endDate.value) {
      qDoctorResult.textContent = 'Completa doctor y fechas';
      return;
    }
    const res = await fetch(`/api/queries/appointments-by-doctor?doctorId=${doctorId}&startDate=${startDate.value}&endDate=${endDate.value}`);
    const data = await res.json();
    qDoctorResult.textContent = JSON.stringify(data, null, 2);
  });

  btnIncome.addEventListener('click', async () => {
    if (!iStartDate.value || !iEndDate.value) {
      qIncomeResult.textContent = 'Completa las fechas';
      return;
    }
    const res = await fetch(`/api/queries/income-by-payment?startDate=${iStartDate.value}&endDate=${iEndDate.value}`);
    const data = await res.json();
    qIncomeResult.textContent = JSON.stringify(data, null, 2);
  });
})();



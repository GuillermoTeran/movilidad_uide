(() => {
  console.log("🚀 App UIDE Movilidad iniciando...");

  /* =====================
     UTILIDADES
  ====================== */
  const $ = (s) => document.querySelector(s);
  const LS = {
    get: (k, d) => {
      try { return JSON.parse(localStorage.getItem(k)) ?? d; }
      catch { return d; }
    },
    set: (k, v) => localStorage.setItem(k, JSON.stringify(v))
  };
  const isUideEmail = (e) => /@uide\.edu\.ec$/i.test(e.trim());

  /* =====================
     ELEMENTOS
  ====================== */
  const btnRegister = $('#btn-register');
  const btnOfrezco = $('#btn-ofrezco');
  const btnBusco = $('#btn-busco');
  const modal = $('#modal');
  const modalClose = $('#modal-close');
  const registerForm = $('#register-form');
  const currentUserDiv = $('#current-user');

  const formOfrezcoWrap = $('#form-ofrezco');
  const formBuscoWrap = $('#form-busco');
  const ofrezcoForm = $('#ofrezco-form');
  const buscoForm = $('#busco-form');

  const offersList = $('#offers-list');
  const requestsList = $('#requests-list');

  /* =====================
     ESTADO
  ====================== */
  let user = LS.get('uide_user', null);
  let offers = LS.get('uide_offers', []);
  let requests = LS.get('uide_requests', []);

  /* =====================
     RENDER USUARIO
  ====================== */
  function renderUser() {
    if (user && user.email) {
      currentUserDiv.textContent = `Cuenta: ${user.email}`;
      btnRegister.textContent = 'Cuenta';

      // 🔓 HABILITAR BOTONES
      btnOfrezco.disabled = false;
      btnBusco.disabled = false;
      btnOfrezco.classList.remove('disabled');
      btnBusco.classList.remove('disabled');
    } else {
      currentUserDiv.textContent = '';
      btnRegister.textContent = 'Registro';

      // 🔒 DESHABILITAR BOTONES
      btnOfrezco.disabled = true;
      btnBusco.disabled = true;
      btnOfrezco.classList.add('disabled');
      btnBusco.classList.add('disabled');
    }
    console.log("👤 Usuario renderizado:", user);
  }

  /* =====================
     RENDER LISTAS
  ====================== */
  function renderOffers() {
    offersList.innerHTML = '';
    if (offers.length === 0) {
      offersList.innerHTML = '<li class="empty">No hay ofertas publicadas</li>';
      return;
    }

    offers.forEach(o => {
      const li = document.createElement('li');
      li.innerHTML = `
        <strong>${o.fullname}</strong>
        <div>${o.message}</div>
        <div>💵 $${o.price}</div>
        <button class="btn small">Aceptar</button>
      `;
      offersList.appendChild(li);
    });
  }

  function renderRequests() {
    requestsList.innerHTML = '';
    if (requests.length === 0) {
      requestsList.innerHTML = '<li class="empty">No hay solicitudes publicadas</li>';
      return;
    }

    requests.forEach(r => {
      const li = document.createElement('li');
      li.innerHTML = `
        <strong>${r.fullname}</strong>
        <div>${r.message}</div>
        <div>💵 $${r.price}</div>
        <button class="btn small">Aceptar</button>
      `;
      requestsList.appendChild(li);
    });
  }

  /* =====================
     MODAL REGISTRO
  ====================== */
  function openModal() {
    modal.classList.remove('hidden');
  }
  function closeModal() {
    modal.classList.add('hidden');
  }

  btnRegister.onclick = openModal;
  modalClose.onclick = closeModal;
  modal.onclick = (e) => { if (e.target === modal) closeModal(); };

  registerForm.onsubmit = (e) => {
    e.preventDefault();
    const email = registerForm.email.value.trim().toLowerCase();
    console.log("📧 Intento registro:", email);

    if (!isUideEmail(email)) {
      alert('Usa un correo institucional @uide.edu.ec');
      return;
    }

    user = { email, at: Date.now() };
    LS.set('uide_user', user);

    alert('Registro simulado exitoso!');
    closeModal();
    renderUser();
  };

  /* =====================
     BOTONES LATERALES
  ====================== */
  btnOfrezco.onclick = () => {
    if (!user) return;
    formBuscoWrap.classList.add('hidden');
    formOfrezcoWrap.classList.toggle('hidden');
  };

  btnBusco.onclick = () => {
    if (!user) return;
    formOfrezcoWrap.classList.add('hidden');
    formBuscoWrap.classList.toggle('hidden');
  };

  /* =====================
     FORM OFREZCO
  ====================== */
  ofrezcoForm.onsubmit = (e) => {
    e.preventDefault();
    const f = new FormData(ofrezcoForm);

    const offer = {
      email: f.get('email'),
      fullname: f.get('fullname'),
      age: f.get('age'),
      career: f.get('career'),
      message: f.get('message'),
      price: f.get('price')
    };

    offers.push(offer);
    LS.set('uide_offers', offers);

    ofrezcoForm.reset();
    formOfrezcoWrap.classList.add('hidden');
    renderOffers();
  };

  /* =====================
     FORM BUSCO
  ====================== */
  buscoForm.onsubmit = (e) => {
    e.preventDefault();
    const f = new FormData(buscoForm);

    const req = {
      email: f.get('email'),
      fullname: f.get('fullname'),
      age: f.get('age'),
      career: f.get('career'),
      message: f.get('message'),
      price: f.get('price')
    };

    requests.push(req);
    LS.set('uide_requests', requests);

    buscoForm.reset();
    formBuscoWrap.classList.add('hidden');
    renderRequests();
  };

  /* =====================
     INIT
  ====================== */
  renderUser();
  renderOffers();
  renderRequests();
})();

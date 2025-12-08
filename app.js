/* app.js - lógica cliente con localStorage (UIDE Movilidad) */
/* Guarda ofertas en 'uide_offers' y solicitudes en 'uide_requests' y usuario en 'uide_user' */

(() => {
  // Utils
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));
  const LS = {
    get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch(e){ return d; } },
    set(k, v) { localStorage.setItem(k, JSON.stringify(v)); }
  };
  const isUideEmail = (em) => /\b@uide\.edu\.ec$/i.test(String(em).trim());

  // Elements
  const btnOfrezco = $('#btn-ofrezco');
  const btnBusco = $('#btn-busco');
  const formOfrezco = $('#form-ofrezco');
  const formBusco = $('#form-busco');
  const offersList = $('#offers-list');
  const requestsList = $('#requests-list');
  const registerBtn = $('#btn-register');
  const modal = $('#modal');
  const modalClose = $('#modal-close');
  const registerForm = $('#register-form');
  const currentUserDiv = $('#current-user');

  // Data
  let offers = LS.get('uide_offers', []);
  let requests = LS.get('uide_requests', []);
  let user = LS.get('uide_user', null);

  // Helpers: render lists
  function renderUser(){
    if(user && user.email){
      currentUserDiv.textContent = `Conectado: ${user.email}`;
      registerBtn.textContent = 'Cuenta: ' + user.email.split('@')[0];
    } else {
      currentUserDiv.textContent = '';
      registerBtn.textContent = 'Registrarse / Ingresar';
    }
  }

  function renderOffers(){
    offersList.innerHTML = '';
    if(offers.length === 0){
      offersList.innerHTML = '<li class="empty">No hay ofertas publicadas.</li>';
      return;
    }
    offers.slice().reverse().forEach((o, idx) => {
      const li = document.createElement('li');
      li.innerHTML = `
        <div><strong>${o.fullname}</strong> <span class="small-pill">${o.email}</span></div>
        <div class="meta">${o.career} • ${o.age} años • ${o.message || ''}</div>
        <div class="meta">Carro: ${o.car_model} • Placa: ${o.car_plate} • Color: ${o.car_color}</div>
        <div class="meta">Valor sugerido: $ ${Number(o.price).toFixed(2)}</div>
        <div class="actions"></div>
      `;
      const actions = li.querySelector('.actions');

      // Accept button (for passengers)
      const acceptBtn = document.createElement('button');
      acceptBtn.className = 'btn small';
      acceptBtn.textContent = 'Aceptar (proponer pago)';
      acceptBtn.onclick = () => {
        if(!user){ alert('Regístrate con tu correo UIDE para aceptar.'); openModal(); return; }
        const agreed = prompt('Ingrese el valor en efectivo acordado (USD)', o.price || '0');
        if(agreed === null) return;
        const amt = parseFloat(agreed);
        if(Number.isNaN(amt) || amt < 0){ alert('Valor inválido'); return; }
        // store acceptance record inside offer
        o.accepted = { by: user.email, amount: amt, at: Date.now() };
        LS.set('uide_offers', offers);
        renderOffers(); renderRequests();
      };

      const cancelBtn = document.createElement('button');
      cancelBtn.className = 'btn secondary small';
      cancelBtn.textContent = 'Cancelar';
      cancelBtn.onclick = () => {
        if(!confirm('Eliminar esta oferta?')) return;
        // remove item
        const index = offers.indexOf(o);
        if(index >= 0) offers.splice(index,1);
        LS.set('uide_offers', offers);
        renderOffers();
      };

      actions.appendChild(acceptBtn);
      actions.appendChild(cancelBtn);

      // If accepted show badge and details
      if(o.accepted){
        const badge = document.createElement('div');
        badge.className = 'meta';
        badge.innerHTML = `<strong>ACORDADO:</strong> por ${o.accepted.by} — $${Number(o.accepted.amount).toFixed(2)}`;
        li.appendChild(badge);
      }

      offersList.appendChild(li);
    });
  }

  function renderRequests(){
    requestsList.innerHTML = '';
    if(requests.length === 0){
      requestsList.innerHTML = '<li class="empty">No hay solicitudes publicadas.</li>';
      return;
    }
    requests.slice().reverse().forEach((r) => {
      const li = document.createElement('li');
      li.innerHTML = `
        <div><strong>${r.fullname}</strong> <span class="small-pill">${r.email}</span></div>
        <div class="meta">${r.career} • ${r.age} años • ${r.message || ''}</div>
        <div class="meta">Pago dispuesto: $ ${Number(r.price).toFixed(2)}</div>
        <div class="actions"></div>
      `;
      const actions = li.querySelector('.actions');

      // Accept button (for drivers)
      const acceptBtn = document.createElement('button');
      acceptBtn.className = 'btn small';
      acceptBtn.textContent = 'Aceptar (proponer pago)';
      acceptBtn.onclick = () => {
        if(!user){ alert('Regístrate con tu correo UIDE para aceptar.'); openModal(); return; }
        const agreed = prompt('Ingrese el valor en efectivo acordado (USD)', r.price || '0');
        if(agreed === null) return;
        const amt = parseFloat(agreed);
        if(Number.isNaN(amt) || amt < 0){ alert('Valor inválido'); return; }
        r.accepted = { by: user.email, amount: amt, at: Date.now() };
        LS.set('uide_requests', requests);
        renderRequests(); renderOffers();
      };

      const cancelBtn = document.createElement('button');
      cancelBtn.className = 'btn secondary small';
      cancelBtn.textContent = 'Cancelar';
      cancelBtn.onclick = () => {
        if(!confirm('Eliminar esta solicitud?')) return;
        const index = requests.indexOf(r);
        if(index >= 0) requests.splice(index,1);
        LS.set('uide_requests', requests);
        renderRequests();
      };

      actions.appendChild(acceptBtn);
      actions.appendChild(cancelBtn);

      if(r.accepted){
        const badge = document.createElement('div');
        badge.className = 'meta';
        badge.innerHTML = `<strong>ACORDADO:</strong> por ${r.accepted.by} — $${Number(r.accepted.amount).toFixed(2)}`;
        li.appendChild(badge);
      }

      requestsList.appendChild(li);
    });
  }

  // Toggle forms
  btnOfrezco.addEventListener('click', () => {
    formBusco.classList.add('hidden');
    formOfrezco.classList.toggle('hidden');
    formOfrezco.scrollIntoView({behavior:'smooth', block:'center'});
  });
  btnBusco.addEventListener('click', () => {
    formOfrezco.classList.add('hidden');
    formBusco.classList.toggle('hidden');
    formBusco.scrollIntoView({behavior:'smooth', block:'center'});
  });

  // Cancel buttons inside forms
  $('#ofrezco-cancel').addEventListener('click', () => {
    document.getElementById('ofrezco-form').reset();
    formOfrezco.classList.add('hidden');
  });
  $('#busco-cancel').addEventListener('click', () => {
    document.getElementById('busco-form').reset();
    formBusco.classList.add('hidden');
  });

  // Register modal
  function openModal(){ modal.classList.remove('hidden'); }
  function closeModal(){ modal.classList.add('hidden'); }

  registerBtn.addEventListener('click', openModal);
  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if(e.target === modal) closeModal(); });

  registerForm.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const email = registerForm.email.value.trim().toLowerCase();
    if(!isUideEmail(email)){ alert('Usa un correo institucional @uide.edu.ec'); return; }
    user = { email, at: Date.now() };
    LS.set('uide_user', user);
    renderUser();
    closeModal();
  });

  // Submit ofrezco
  $('#ofrezco-form').addEventListener('submit', (ev) => {
    ev.preventDefault();
    const f = new FormData(ev.target);
    const email = (f.get('email') || '').trim();
    if(!isUideEmail(email)){ alert('Correo inválido. Usa @uide.edu.ec'); return; }
    const offer = {
      id: 'O' + Date.now(),
      email, fullname: f.get('fullname')||'', age: Number(f.get('age')||0),
      career: f.get('career')||'', car_color:f.get('car_color')||'', car_plate:f.get('car_plate')||'',
      car_model:f.get('car_model')||'', car_registration:f.get('car_registration')||'', car_license:f.get('car_license')||'',
      message: f.get('message')||'', price: parseFloat(f.get('price')||0),
      created: Date.now()
    };
    offers.push(offer);
    LS.set('uide_offers', offers);
    renderOffers();
    ev.target.reset();
    formOfrezco.classList.add('hidden');
    alert('Oferta publicada correctamente.');
  });

  // Submit busco
  $('#busco-form').addEventListener('submit', (ev) => {
    ev.preventDefault();
    const f = new FormData(ev.target);
    const email = (f.get('email') || '').trim();
    if(!isUideEmail(email)){ alert('Correo inválido. Usa @uide.edu.ec'); return; }
    const req = {
      id: 'R' + Date.now(),
      email, fullname: f.get('fullname')||'', age: Number(f.get('age')||0),
      career: f.get('career')||'', message: f.get('message')||'', price: parseFloat(f.get('price')||0),
      created: Date.now()
    };
    requests.push(req);
    LS.set('uide_requests', requests);
    renderRequests();
    ev.target.reset();
    formBusco.classList.add('hidden');
    alert('Solicitud publicada correctamente.');
  });

  // init
  renderUser();
  renderOffers();
  renderRequests();

  // Expose for console debug (optional)
  window.uideDebug = { offers, requests, user, LS };
})();



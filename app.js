(() => {
  console.log("🚀 App UIDE Movilidad iniciando...");

  // Utils
  const $ = (sel) => document.querySelector(sel);
  const LS = {
    get: (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch(e){ console.error(e); return d; } },
    set: (k,v) => { localStorage.setItem(k, JSON.stringify(v)); }
  };
  const isUideEmail = (em) => /\b@uide\.edu\.ec$/i.test(String(em).trim());

  // Elements
  const btnRegister = $('#btn-register');
  const modal = $('#modal');
  const modalClose = $('#modal-close');
  const registerForm = $('#register-form');
  const currentUserDiv = $('#current-user');

  // Forms
  const btnOfrezco = $('#btn-ofrezco');
  const btnBusco = $('#btn-busco');
  const formOfrezco = $('#form-ofrezco');
  const formBusco = $('#form-busco');

  const offersList = $('#offers-list');
  const requestsList = $('#requests-list');

  // Data
  let offers = LS.get('uide_offers', []);
  let requests = LS.get('uide_requests', []);
  let user = LS.get('uide_user', null);

  console.log("Datos iniciales:", {user, offers, requests});

  // Render usuario
  function renderUser(){
  if(user && user.email){
    currentUserDiv.textContent = `Conectado: ${user.email}`;
    btnRegister.textContent = 'Cuenta: ' + user.email.split('@')[0];
    
    // 🔹 Habilitar botones de viaje
    btnOfrezco.disabled = false;
    btnBusco.disabled = false;
  } else {
    currentUserDiv.textContent = '';
    btnRegister.textContent = 'Registrarse / Ingresar';
    
    // 🔹 Deshabilitar botones si no hay usuario
    btnOfrezco.disabled = true;
    btnBusco.disabled = true;
  }
  console.log("Usuario renderizado:", user);
}

  // Render listas
  function renderOffers(){
    offersList.innerHTML = '';
    if(offers.length === 0){
      offersList.innerHTML = '<li class="empty">No hay ofertas publicadas.</li>';
      return;
    }
    offers.slice().reverse().forEach((o) => {
      const li = document.createElement('li');
      li.innerHTML = `<div><strong>${o.fullname}</strong> <span class="small-pill">${o.email}</span></div>
      <div class="meta">${o.career} • ${o.age} años • ${o.message}</div>
      <div class="meta">Carro: ${o.car_model} • Placa: ${o.car_plate} • Color: ${o.car_color}</div>
      <div class="meta">Valor sugerido: $ ${Number(o.price).toFixed(2)}</div>
      <div class="actions"></div>`;
      const actions = li.querySelector('.actions');

      const acceptBtn = document.createElement('button');
      acceptBtn.className = 'btn small';
      acceptBtn.textContent = 'Aceptar';
      acceptBtn.onclick = () => {
        if(!user){ alert('Regístrate para aceptar.'); openModal(); return; }
        const amt = parseFloat(prompt('Valor en efectivo acordado', o.price || '0'));
        if(isNaN(amt) || amt < 0){ alert('Valor inválido'); return; }
        o.accepted = { by: user.email, amount: amt, at: Date.now() };
        LS.set('uide_offers', offers);
        console.log("Oferta aceptada:", o);
        renderOffers(); renderRequests();
      };

      const cancelBtn = document.createElement('button');
      cancelBtn.className = 'btn secondary small';
      cancelBtn.textContent = 'Cancelar';
      cancelBtn.onclick = () => {
        if(!confirm('Eliminar oferta?')) return;
        const index = offers.indexOf(o);
        if(index >= 0) offers.splice(index,1);
        LS.set('uide_offers', offers);
        console.log("Oferta eliminada");
        renderOffers();
      };

      actions.appendChild(acceptBtn);
      actions.appendChild(cancelBtn);

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
      li.innerHTML = `<div><strong>${r.fullname}</strong> <span class="small-pill">${r.email}</span></div>
      <div class="meta">${r.career} • ${r.age} años • ${r.message}</div>
      <div class="meta">Pago dispuesto: $ ${Number(r.price).toFixed(2)}</div>
      <div class="actions"></div>`;
      const actions = li.querySelector('.actions');

      const acceptBtn = document.createElement('button');
      acceptBtn.className = 'btn small';
      acceptBtn.textContent = 'Aceptar';
      acceptBtn.onclick = () => {
        if(!user){ alert('Regístrate para aceptar.'); openModal(); return; }
        const amt = parseFloat(prompt('Valor en efectivo acordado', r.price || '0'));
        if(isNaN(amt) || amt < 0){ alert('Valor inválido'); return; }
        r.accepted = { by: user.email, amount: amt, at: Date.now() };
        LS.set('uide_requests', requests);
        console.log("Solicitud aceptada:", r);
        renderRequests(); renderOffers();
      };

      const cancelBtn = document.createElement('button');
      cancelBtn.className = 'btn secondary small';
      cancelBtn.textContent = 'Cancelar';
      cancelBtn.onclick = () => {
        if(!confirm('Eliminar solicitud?')) return;
        const index = requests.indexOf(r);
        if(index >= 0) requests.splice(index,1);
        LS.set('uide_requests', requests);
        console.log("Solicitud eliminada");
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

  // Forms toggle
  btnOfrezco.addEventListener('click', () => {
    formBusco.classList.add('hidden');
    formOfrezco.classList.toggle('hidden');
    console.log("Form Ofrezco visible:", !formOfrezco.classList.contains('hidden'));
  });
  btnBusco.addEventListener('click', () => {
    formOfrezco.classList.add('hidden');
    formBusco.classList.toggle('hidden');
    console.log("Form Busco visible:", !formBusco.classList.contains('hidden'));
  });

  $('#ofrezco-cancel').addEventListener('click', () => { $('#ofrezco-form').reset(); formOfrezco.classList.add('hidden'); });
  $('#busco-cancel').addEventListener('click', () => { $('#busco-form').reset(); formBusco.classList.add('hidden'); });

  // Modal register
  function openModal(){ modal.classList.remove('hidden'); console.log("Modal abierto"); }
  function closeModal(){ modal.classList.add('hidden'); console.log("Modal cerrado"); }

  btnRegister.addEventListener('click', openModal);
  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if(e.target === modal) closeModal(); });

  registerForm.addEventListener('submit', (ev)=>{
    ev.preventDefault();
    const email = registerForm.email.value.trim().toLowerCase();
    console.log("Intento de registro con email:", email);
    if(!isUideEmail(email)){ alert('Usa un correo institucional @uide.edu.ec'); return; }
    user = { email, at: Date.now() };
    LS.set('uide_user', user);
    renderUser();
    closeModal();
    alert('Registro simulado exitoso!');
  });

  // Submit forms
  $('#ofrezco-form').addEventListener('submit', (ev)=>{
    ev.preventDefault();
    const f = new FormData(ev.target);
    const email = (f.get('email')||'').trim();
    console.log("Ofrezco submit email:", email);
    if(!isUideEmail(email)){ alert('Correo inválido'); return; }
    const offer = {
      id:'O'+Date.now(),
      email, fullname:f.get('fullname'), age:Number(f.get('age')||0),
      career:f.get('career'), car_color:f.get('car_color'), car_plate:f.get('car_plate'),
      car_model:f.get('car_model'), car_registration:f.get('car_registration'),
      car_license:f.get('car_license'), message:f.get('message'), price:parseFloat(f.get('price')||0),
      created:Date.now()
    };
    offers.push(offer);
    LS.set('uide_offers', offers);
    renderOffers();
    ev.target.reset();
    formOfrezco.classList.add('hidden');
    console.log("Oferta publicada:", offer);
  });

  $('#busco-form').addEventListener('submit', (ev)=>{
    ev.preventDefault();
    const f = new FormData(ev.target);
    const email = (f.get('email')||'').trim();
    console.log("Busco submit email:", email);
    if(!isUideEmail(email)){ alert('Correo inválido'); return; }
    const req = {
      id:'R'+Date.now(),
      email, fullname:f.get('fullname'), age:Number(f.get('age')||0),
      career:f.get('career'), message:f.get('message'), price:parseFloat(f.get('price')||0),
      created:Date.now()
    };
    requests.push(req);
    LS.set('uide_requests', requests);
    renderRequests();
    ev.target.reset();
    formBusco.classList.add('hidden');
    console.log("Solicitud publicada:", req);
  });

  // Inicial render
  renderUser();
  renderOffers();
  renderRequests();
})();


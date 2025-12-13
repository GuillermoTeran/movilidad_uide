console.log("🚀 App UIDE Movilidad iniciando...");

const $ = (id) => document.getElementById(id);

// ---------- ELEMENTOS ----------
const btnOfrezco = $("btn-ofrezco");
const btnBusco = $("btn-busco");
const formOfrezcoBox = $("form-ofrezco");
const formBuscoBox = $("form-busco");
const ofrezcoForm = $("ofrezco-form");
const buscoForm = $("busco-form");

const offersList = $("offers-list");
const requestsList = $("requests-list");
const confirmationsBox = $("confirmations");
const confirmationsList = $("confirmations-list");

// ---------- MODAL LOGIN ----------
const btnRegister = $("btn-register");
const modal = $("modal");
const modalClose = $("modal-close");
const registerForm = $("register-form");
const currentUserBox = $("current-user");

// ---------- USUARIO ----------
let currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;
renderCurrentUser();

// ---------- STORAGE ----------
let offers = JSON.parse(localStorage.getItem("offers")) || [];
let requests = JSON.parse(localStorage.getItem("requests")) || [];
let confirmations = JSON.parse(localStorage.getItem("confirmations")) || [];

// ---------- LOGIN ----------
btnRegister.onclick = () => {
  modal.classList.remove("hidden");
};

modalClose.onclick = () => {
  modal.classList.add("hidden");
};

registerForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = registerForm.email.value.trim();

  if (!email.endsWith("@uide.edu.ec")) {
    alert("⚠️ Usa tu correo institucional @uide.edu.ec");
    return;
  }

  currentUser = { email, at: Date.now() };
  localStorage.setItem("currentUser", JSON.stringify(currentUser));

  alert("✅ Registro simulado exitoso");
  renderCurrentUser();
  modal.classList.add("hidden");
  registerForm.reset();
});

function renderCurrentUser() {
  if (currentUser) {
    currentUserBox.textContent = `Conectado: ${currentUser.email}`;
    btnRegister.textContent = "Cuenta";
  }
}

// ---------- VISIBILIDAD ----------
btnOfrezco.onclick = () => {
  formOfrezcoBox.classList.remove("hidden");
  formBuscoBox.classList.add("hidden");
};

btnBusco.onclick = () => {
  formBuscoBox.classList.remove("hidden");
  formOfrezcoBox.classList.add("hidden");
};

// ---------- SUBMIT OFREZCO ----------
ofrezcoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(ofrezcoForm));
  data.id = Date.now();
  offers.push(data);
  localStorage.setItem("offers", JSON.stringify(offers));
  ofrezcoForm.reset();
  formOfrezcoBox.classList.add("hidden");
  renderOffers();
});

// ---------- SUBMIT BUSCO ----------
buscoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(buscoForm));
  data.id = Date.now();
  requests.push(data);
  localStorage.setItem("requests", JSON.stringify(requests));
  buscoForm.reset();
  formBuscoBox.classList.add("hidden");
  renderRequests();
});

// ---------- RENDER ----------
function renderOffers() {
  offersList.innerHTML = "";
  offers.forEach((o) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${o.fullname}</strong>
      <span class="meta">${o.career} · ${o.age} años</span>
      <span>${o.message}</span>
      <span><b>💵 $${o.price}</b></span>
      <div class="actions">
        <button class="btn" onclick="acceptOffer(${o.id})">Aceptar</button>
        <button class="btn secondary" onclick="removeOffer(${o.id})">Cancelar</button>
      </div>
    `;
    offersList.appendChild(li);
  });
}

function renderRequests() {
  requestsList.innerHTML = "";
  requests.forEach((r) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${r.fullname}</strong>
      <span class="meta">${r.career} · ${r.age} años</span>
      <span>${r.message}</span>
      <span><b>💵 $${r.price}</b></span>
      <div class="actions">
        <button class="btn" onclick="acceptRequest(${r.id})">Aceptar</button>
        <button class="btn secondary" onclick="removeRequest(${r.id})">Cancelar</button>
      </div>
    `;
    requestsList.appendChild(li);
  });
}

// ---------- ACEPTAR ----------
window.acceptOffer = (id) => {
  if (!currentUser) {
    alert("⚠️ Debes iniciar sesión con tu correo UIDE");
    return;
  }

  const offer = offers.find(o => o.id === id);
  confirmations.push({
    conductor: offer.fullname,
    pasajero: currentUser.email,
    precio: offer.price
  });

  offers = offers.filter(o => o.id !== id);
  saveAll();
};

window.acceptRequest = (id) => {
  if (!currentUser) {
    alert("⚠️ Debes iniciar sesión con tu correo UIDE");
    return;
  }

  const req = requests.find(r => r.id === id);
  confirmations.push({
    conductor: currentUser.email,
    pasajero: req.fullname,
    precio: req.price
  });

  requests = requests.filter(r => r.id !== id);
  saveAll();
};

// ---------- CONFIRMACIONES ----------
function renderConfirmations() {
  confirmationsBox.classList.remove("hidden");
  confirmationsList.innerHTML = "";
  confirmations.forEach(c => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>✅ Viaje confirmado</strong>
      <span>🚗 ${c.conductor}</span>
      <span>🧍 ${c.pasajero}</span>
      <span><b>💵 $${c.precio}</b></span>
    `;
    confirmationsList.appendChild(li);
  });
}

// ---------- REMOVE ----------
window.removeOffer = (id) => {
  offers = offers.filter(o => o.id !== id);
  saveAll();
};

window.removeRequest = (id) => {
  requests = requests.filter(r => r.id !== id);
  saveAll();
};

function saveAll() {
  localStorage.setItem("offers", JSON.stringify(offers));
  localStorage.setItem("requests", JSON.stringify(requests));
  localStorage.setItem("confirmations", JSON.stringify(confirmations));
  renderOffers();
  renderRequests();
  renderConfirmations();
}

// ---------- INIT ----------
renderOffers();
renderRequests();
renderConfirmations();

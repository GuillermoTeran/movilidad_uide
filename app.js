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

// ---------- USUARIO ----------
let currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;

// ---------- STORAGE ----------
let offers = JSON.parse(localStorage.getItem("offers")) || [];
let requests = JSON.parse(localStorage.getItem("requests")) || [];
let confirmations = JSON.parse(localStorage.getItem("confirmations")) || [];

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
      <span class="meta">🚗 ${o.car_model} (${o.car_color})</span>
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
  if (!offer) return;

  const confirmation = {
    driver: offer.fullname,
    driverEmail: offer.email,
    passenger: currentUser.email,
    passengerEmail: currentUser.email,
    price: offer.price
  };

  confirmations.push(confirmation);
  localStorage.setItem("confirmations", JSON.stringify(confirmations));

  offers = offers.filter(o => o.id !== id);
  localStorage.setItem("offers", JSON.stringify(offers));

  renderOffers();
  renderConfirmations();
};

window.acceptRequest = (id) => {
  if (!currentUser) {
    alert("⚠️ Debes iniciar sesión con tu correo UIDE");
    return;
  }

  const req = requests.find(r => r.id === id);
  if (!req) return;

  const confirmation = {
    driver: currentUser.email,
    driverEmail: currentUser.email,
    passenger: req.fullname,
    passengerEmail: req.email,
    price: req.price
  };

  confirmations.push(confirmation);
  localStorage.setItem("confirmations", JSON.stringify(confirmations));

  requests = requests.filter(r => r.id !== id);
  localStorage.setItem("requests", JSON.stringify(requests));

  renderRequests();
  renderConfirmations();
};

// ---------- CONFIRMACIONES ----------
function renderConfirmations() {
  confirmationsBox.classList.remove("hidden");
  confirmationsList.innerHTML = "";

  confirmations.forEach(c => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>✅ Viaje confirmado</strong>
      <span>🚗 Conductor: ${c.driver}</span>
      <span>📧 ${c.driverEmail}</span>
      <span>🧍 Pasajero: ${c.passenger}</span>
      <span>📧 ${c.passengerEmail}</span>
      <span><b>💵 $${c.price}</b></span>
    `;
    confirmationsList.appendChild(li);
  });
}

// ---------- REMOVE ----------
window.removeOffer = (id) => {
  offers = offers.filter(o => o.id !== id);
  localStorage.setItem("offers", JSON.stringify(offers));
  renderOffers();
};

window.removeRequest = (id) => {
  requests = requests.filter(r => r.id !== id);
  localStorage.setItem("requests", JSON.stringify(requests));
  renderRequests();
};

// ---------- INIT ----------
renderOffers();
renderRequests();
renderConfirmations();

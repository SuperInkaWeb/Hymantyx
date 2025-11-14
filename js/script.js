// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    const targetId = this.getAttribute("href");
    if (targetId !== "#") {
      e.preventDefault();
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: "smooth"
        });
      }
    }
  });
});

// ===== BOTÓN "SOLICITAR REUNIÓN" =====
document.getElementById("solicitarBtn")?.addEventListener("click", (e) => {
  e.preventDefault();
  alert("Esta opción estará disponible próximamente. 😊");
});

// ===== MENÚ RESPONSIVE (Cierra el menú al hacer clic en un enlace) =====
const navLinks = document.querySelectorAll(".navbar-nav .nav-link");
const navbarCollapse = document.querySelector(".navbar-collapse");

navLinks.forEach(link => {
  link.addEventListener("click", () => {
    const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
      toggle: false
    });
    bsCollapse.hide();
  });
});

// ===== FORMULARIO SOLICITUD: Empresa vs Candidato =====
(() => {
  const btnEmpresa = document.getElementById("btnEmpresa");
  const btnCandidato = document.getElementById("btnCandidato");
  const labelEmpresaCargo = document.getElementById("labelEmpresaCargo");
  const inputEmpresaCargo = document.getElementById("inputEmpresaCargo");
  const ayudaSelect = document.getElementById("ayudaSelect");
  const tipoField = document.getElementById("tipoSolicitante");

  if (!btnEmpresa || !btnCandidato || !labelEmpresaCargo || !inputEmpresaCargo || !ayudaSelect) return;

  const empresaOptions = [
    "Reclutamiento y Selección",
    "Consultoría en RR.HH.",
    "Capacitación",
    "Otro"
  ];

  const candidatoOptions = [
    "Enviar CV",
    "Estoy interesado",
    "No pude entrar a la reunión"
  ];

  const populateSelect = (options) => {
    ayudaSelect.innerHTML = "";
    const def = document.createElement("option");
    def.selected = true;
    def.textContent = "Selecciona una opción";
    ayudaSelect.appendChild(def);
    options.forEach(opt => {
      const o = document.createElement("option");
      o.textContent = opt;
      ayudaSelect.appendChild(o);
    });
  };

  const setTipo = (tipo) => {
    if (tipo === "empresa") {
      btnEmpresa.classList.add("active");
      btnCandidato.classList.remove("active");
      labelEmpresaCargo.textContent = "Empresa";
      inputEmpresaCargo.placeholder = "Nombre de tu empresa";
      populateSelect(empresaOptions);
      if (tipoField) tipoField.value = "Empresa";
    } else {
      btnCandidato.classList.add("active");
      btnEmpresa.classList.remove("active");
      labelEmpresaCargo.textContent = "Cargo";
      inputEmpresaCargo.placeholder = "Tu cargo o puesto";
      populateSelect(candidatoOptions);
      if (tipoField) tipoField.value = "Candidato";
    }
  };

  btnEmpresa.addEventListener("click", () => setTipo("empresa"));
  btnCandidato.addEventListener("click", () => setTipo("candidato"));

  // Estado inicial: Empresa
  setTipo("empresa");
})();

// ===== ENVÍO DE FORMULARIO POR EMAILJS =====
(() => {
  const form = document.getElementById("contactForm");
  if (!form) return;

  // Inicializar EmailJS con tu Public Key
  (function () {
    if (window.emailjs) {
      emailjs.init("-uL-biHRp5GSP9cf4"); // ✅ Tu Public Key
    } else {
      console.error("❌ EmailJS no está cargado o no se pudo inicializar.");
    }
  })();

  const submitBtn = form.querySelector('button[type="submit"]');

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!window.emailjs) {
      alert("❌ No se pudo cargar el servicio de correo. Intenta nuevamente más tarde.");
      return;
    }

    try {
      submitBtn.disabled = true;
      submitBtn.textContent = "Enviando...";

      const params = {
        tipo: form.tipoSolicitante?.value || "",
        nombre: form.nombre?.value || "",
        apellido: form.apellido?.value || "",
        email: form.email?.value || "",
        telefono: form.telefono?.value || "",
        empresa_cargo: form.empresa_cargo?.value || "",
        ayuda: form.ayuda?.value || "",
        mensaje: form.mensaje?.value || ""
      };

      // ✅ Tus IDs reales de EmailJS
      const SERVICE_ID = "service_ekq5qhq";
      const TEMPLATE_ID = "template_k05qs3n";

      await emailjs.send(SERVICE_ID, TEMPLATE_ID, params);
      alert("✅ ¡Gracias! Tu solicitud fue enviada correctamente.");
      form.reset();

      // Volver al tipo "Empresa" por defecto
      document.getElementById("btnEmpresa")?.click();
    } catch (err) {
      console.error("⚠️ Error al enviar:", err);
      alert("⚠️ Ocurrió un problema al enviar tu solicitud. Intenta nuevamente.");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Solicitar Reunión o Consulta";
    }
  });
})();

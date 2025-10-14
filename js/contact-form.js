// ===================================
// Web3Forms Configuration
// ===================================
const WEB3FORMS_ACCESS_KEY = '687047f5-2b9b-42fb-b050-7bd43b1bf072';

// ===================================
// Form Validation and Submission
// ===================================
function validateContactForm(form) {
    const email = form.querySelector('input[type="email"]');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (email && !emailRegex.test(email.value)) {
        alert('Por favor, ingresa un correo electrónico válido.');
        return false;
    }
    
    const requiredFields = form.querySelectorAll('[required]');
    for (let field of requiredFields) {
        // Saltar validación de archivos
        if (field.type === 'file') continue;
        
        if (!field.value.trim()) {
            alert(`Por favor, completa el campo: ${field.name || field.placeholder}`);
            field.focus();
            return false;
        }
    }
    
    return true;
}

function showSuccessModal() {
    const successModal = new bootstrap.Modal(document.getElementById('successModal'));
    successModal.show();
}

function showErrorModal() {
    const errorModal = new bootstrap.Modal(document.getElementById('errorModal'));
    errorModal.show();
}

async function sendFormData(formData, formType) {
    const nombre = formData.get('nombre');
    const telefono = formData.get('telefono');
    const email = formData.get('email');

    // Crear FormData para enviar (evita CORS)
    const web3FormData = new FormData();
    web3FormData.append('access_key', WEB3FORMS_ACCESS_KEY);
    web3FormData.append('subject', `[Humantyx] Nueva Solicitud - ${formType}`);
    web3FormData.append('name', nombre);
    web3FormData.append('email', email);
    web3FormData.append('phone', telefono);
    
    // Crear mensaje completo según el tipo de formulario
    let mensaje = `═══════════════════════════════════════\n`;
    mensaje += `📋 NUEVA SOLICITUD DE ${formType.toUpperCase()}\n`;
    mensaje += `═══════════════════════════════════════\n\n`;
    mensaje += `👤 DATOS DE CONTACTO:\n`;
    mensaje += `   • Nombre: ${nombre}\n`;
    mensaje += `   • Email: ${email}\n`;
    mensaje += `   • Teléfono: ${telefono}\n\n`;
    
    if (formType === 'Empresa') {
        const cargo = formData.get('cargo') || 'No especificado';
        const empresa = formData.get('empresa');
        const servicio = formData.get('servicio') || 'No especificado';
        const urgencia = formData.get('urgencia') || 'No especificado';
        const mensajeCliente = formData.get('mensaje');
        
        mensaje += `🏢 DATOS DE LA EMPRESA:\n`;
        mensaje += `   • Empresa: ${empresa}\n`;
        mensaje += `   • Cargo del solicitante: ${cargo}\n\n`;
        mensaje += `💼 SERVICIO SOLICITADO:\n`;
        mensaje += `   • Tipo de servicio: ${servicio}\n`;
        mensaje += `   • Nivel de urgencia: ${urgencia}\n\n`;
        mensaje += `💬 MENSAJE DEL CLIENTE:\n`;
        mensaje += `   ${mensajeCliente}\n`;
    } else {
        const area = formData.get('area') || 'No especificado';
        const experiencia = formData.get('experiencia') || 'No especificado';
        const mensajeCliente = formData.get('mensaje') || 'No especificado';
        
        mensaje += `🎯 DATOS PROFESIONALES:\n`;
        mensaje += `   • Área de interés: ${area}\n`;
        mensaje += `   • Años de experiencia: ${experiencia}\n\n`;
        mensaje += `💬 MENSAJE:\n`;
        mensaje += `   ${mensajeCliente}\n`;
        
        // Nota sobre CV si se proporcionó
        const cvFile = formData.get('cv');
        if (cvFile && cvFile.size > 0) {
            mensaje += `\n📎 NOTA: El candidato indicó tener CV disponible (${cvFile.name})\n`;
            mensaje += `   Por favor, solicítalo directamente al email: ${email}\n`;
        }
    }
    
    mensaje += `\n═══════════════════════════════════════\n`;
    mensaje += `📅 Fecha: ${new Date().toLocaleString('es-PE', { timeZone: 'America/Lima' })}\n`;
    mensaje += `🌐 Sitio web: www.humantyx.com\n`;
    mensaje += `═══════════════════════════════════════`;

    web3FormData.append('message', mensaje);

    try {
        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: web3FormData // SIN headers - FormData maneja todo
        });

        const data = await response.json();
        
        console.log('📧 Respuesta de Web3Forms:', data);
        
        if (data.success) {
            console.log('✅ Email enviado exitosamente a: E.Y.P@outlook.es');
            return { success: true };
        } else {
            console.error('❌ Error en el envío:', data.message);
            return { success: false, error: data.message };
        }
    } catch (error) {
        console.error('❌ Error de red al enviar:', error);
        return { success: false, error: error.message };
    }
}

// ===================================
// Initialize Forms
// ===================================
document.addEventListener('DOMContentLoaded', function() {
    const formEmpresa = document.getElementById('formEmpresa');
    const formCandidato = document.getElementById('formCandidato');
    
    if (formEmpresa) {
        formEmpresa.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            if (!validateContactForm(this)) {
                return;
            }
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Enviando...';
            
            const formData = new FormData(this);
            
            try {
                const result = await sendFormData(formData, 'Empresa');
                
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
                
                if (result.success) {
                    showSuccessModal();
                    this.reset();
                } else {
                    showErrorModal();
                }
            } catch (error) {
                console.error('Error:', error);
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
                showErrorModal();
            }
        });
    }
    
    if (formCandidato) {
        // Mostrar nombre del archivo seleccionado (solo visual)
        const cvInput = formCandidato.querySelector('input[type="file"]');
        if (cvInput) {
            cvInput.addEventListener('change', function(e) {
                const fileName = e.target.files[0]?.name || 'Ningún archivo seleccionado';
                
                let fileLabel = formCandidato.querySelector('.file-label');
                if (!fileLabel) {
                    fileLabel = document.createElement('small');
                    fileLabel.className = 'file-label text-muted d-block mt-2';
                    cvInput.parentElement.appendChild(fileLabel);
                }
                
                fileLabel.innerHTML = `<i class="fas fa-file-pdf text-primary me-1"></i> ${fileName} <small>(será solicitado por email)</small>`;
            });
        }
        
        formCandidato.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            if (!validateContactForm(this)) {
                return;
            }
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Enviando...';
            
            const formData = new FormData(this);
            
            try {
                const result = await sendFormData(formData, 'Candidato');
                
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
                
                if (result.success) {
                    showSuccessModal();
                    this.reset();
                    const fileLabel = this.querySelector('.file-label');
                    if (fileLabel) fileLabel.remove();
                } else {
                    showErrorModal();
                }
            } catch (error) {
                console.error('Error:', error);
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
                showErrorModal();
            }
        });
    }
});

console.log('%c📧 Sistema de contacto: Web3Forms ACTIVO', 'color: #10b981; font-size: 12px; font-weight: bold;');
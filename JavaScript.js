
const CLAVES_ALUMNOS_POR_CURSO = {
    'PRE ICFES': ['KOUSPARYKEVIN', 'educapro99', 'claveIcfes1'],
    'PROGRAMACIÓN': ['KOUSPARYKEVIN', 'webMaster99', 'claveProg1'],
    'MARKETING': ['KOUSPARYKEVIN', 'ventasPro', 'claveMkt1'],
    'REFUERZO': ['KOUSPARYKEVIN', 'ayudaEscolar', 'claveRef1'],
    'HORARIOS': ['KOUSPARYKEVIN', 'horarioPro', 'claveHorario1']
};


const CLAVES_TUTORES_POR_CURSO = {
    'PRE ICFES': ['KOUSPARYKEVIN'],
    'PROGRAMACIÓN': ['KOUSPARYKEVIN'],
    'MARKETING': ['KOUSPARYKEVIN'],
    'REFUERZO': ['KOUSPARYKEVIN'],
    'HORARIOS': ['KOUSPARYKEVIN']
};

let selectedRole = ''; 
let cursoActivo = ''; 


const STORAGE_KEYS = {
    'PRE ICFES': 'icfes_MeetCode',
    'PROGRAMACIÓN': 'prog_MeetCode',
    'MARKETING': 'mkt_MeetCode',
    'REFUERZO': 'ref_MeetCode',
    'HORARIOS': 'horarios_MeetCode'
};


const modal = document.getElementById('modal-password');
const closeModal = document.getElementById('close-modal');

const stepRoleSelection = document.getElementById('step-role-selection');
const stepLogin = document.getElementById('step-login');
const stepTutorDashboard = document.getElementById('step-tutor-dashboard');
const stepAlumnoDashboard = document.getElementById('step-alumno-dashboard');

const loginTitle = document.getElementById('login-title');
const loginDescription = document.getElementById('login-description');
const inputPass = document.getElementById('input-pass');
const errorMsg = document.getElementById('error-msg');

const configuracionCursos = [
    { id: 'btn-pre-icfes', nombre: 'PRE ICFES' },
    { id: 'btn-programacion', nombre: 'PROGRAMACIÓN' },
    { id: 'btn-marketing', nombre: 'MARKETING' },
    { id: 'btn-refuerzo', nombre: 'REFUERZO' },
    { id: 'btn-horarios', nombre: 'HORARIOS' }
];

configuracionCursos.forEach(curso => {
    const boton = document.getElementById(curso.id);
    if (boton && modal) {
        boton.addEventListener('click', (e) => {
            e.preventDefault();
            cursoActivo = 2026 ? curso.nombre : curso.nombre; 
            
            modal.style.display = 'flex'; 
            stepRoleSelection.style.display = 'block';
            stepLogin.style.display = 'none';
            stepTutorDashboard.style.display = 'none';
            stepAlumnoDashboard.style.display = 'none';
            if (errorMsg) errorMsg.style.display = 'none';
            if (inputPass) inputPass.value = '';
        });
    }
});

if (closeModal && modal) {
    closeModal.addEventListener('click', () => modal.style.display = 'none');
}
window.addEventListener('click', (e) => {
    if (e.target === modal) modal.style.display = 'none';
});


const btnSelectTutor = document.getElementById('btn-select-tutor');
const btnSelectAlumno = document.getElementById('btn-select-alumno');

if (btnSelectTutor) {
    btnSelectTutor.addEventListener('click', () => {
        selectedRole = 'tutor';
        stepRoleSelection.style.display = 'none';
        stepLogin.style.display = 'block';
        loginTitle.innerText = `Acceso Tutor | ${cursoActivo}`;
        loginDescription.innerText = `Contraseña de Tutor para ${cursoActivo}:`;
        inputPass.value = '';
        inputPass.focus();
    });
}

if (btnSelectAlumno) {
    btnSelectAlumno.addEventListener('click', () => {
        selectedRole = 'alumno';
        stepRoleSelection.style.display = 'none';
        stepLogin.style.display = 'block';
        loginTitle.innerText = `Acceso Alumno | ${cursoActivo}`;
        loginDescription.innerText = `Contraseña de Estudiante para ${cursoActivo}:`;
        inputPass.value = '';
        inputPass.focus();
    });
}


function validar() {
    if (!inputPass) return;
    const password = inputPass.value.trim();
    if (errorMsg) errorMsg.style.display = 'none';

    if (selectedRole === 'tutor') {
      
        const listaTutoresCurso = CLAVES_TUTORES_POR_CURSO[cursoActivo];
        if (listaTutoresCurso && listaTutoresCurso.includes(password)) {
            stepLogin.style.display = 'none';
            stepTutorDashboard.style.display = 'block';
        } else {
            if (errorMsg) errorMsg.style.display = 'block';
        }
    } else if (selectedRole === 'alumno') {
       
        const listaAlumnosCurso = CLAVES_ALUMNOS_POR_CURSO[cursoActivo];
        if (listaAlumnosCurso && listaAlumnosCurso.includes(password)) {
            stepLogin.style.display = 'none';
            stepAlumnoDashboard.style.display = 'block';
            
            let storageKey = STORAGE_KEYS[cursoActivo];
            const savedMessage = localStorage.getItem(storageKey) || 'No hay códigos asignados aún por el tutor.';
            
            const alumnoInput = document.getElementById('alumno-received-message');
            if (alumnoInput) alumnoInput.value = savedMessage;
        } else {
            if (errorMsg) errorMsg.style.display = 'block';
        }
    }
}

const btnSubmitPass = document.getElementById('btn-submit-pass');
if (btnSubmitPass) btnSubmitPass.addEventListener('click', validar);
if (inputPass) {
    inputPass.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') validar();
    });
}


const btnSendAnnouncement = document.getElementById('btn-send-announcement');
if (btnSendAnnouncement) {
    btnSendAnnouncement.addEventListener('click', () => {
        const tutorInput = document.getElementById('tutor-message');
        if (!tutorInput) return;
        const messageToSend = tutorInput.value.trim();
        if (messageToSend !== "") {
            let storageKey = STORAGE_KEYS[cursoActivo];
            localStorage.setItem(storageKey, messageToSend);
            
            const successMsg = document.getElementById('tutor-success-msg');
            if (successMsg) {
                successMsg.style.display = 'block';
                setTimeout(() => successMsg.style.display = 'none', 3000);
            }
        }
    });
}

const btnCopyCode = document.getElementById('btn-copy-code');
if (btnCopyCode) {
    btnCopyCode.addEventListener('click', () => {
        const codeInput = document.getElementById('alumno-received-message');
        if (!codeInput) return;
        codeInput.select();
        codeInput.setSelectionRange(0, 99999);
        navigator.clipboard.writeText(codeInput.value);
        
        btnCopyCode.innerText = "¡Copiado!";
        setTimeout(() => btnCopyCode.innerText = "Copiar Código", 2000);
    });
}

const btnGoToMeet = document.getElementById('btn-go-to-meet');
if (btnGoToMeet) {
    btnGoToMeet.addEventListener('click', () => {
        const alumnoInput = document.getElementById('alumno-received-message');
        if (!alumnoInput) return;
        let rawCode = alumnoInput.value.trim();
        if (rawCode === 'No hay códigos asignados aún por el tutor.' || rawCode === "") return;

        if (!rawCode.startsWith('http://') && !rawCode.startsWith('https://')) {
            const cleanCode = rawCode.replace(/-/g, "");
            window.open(`https://meet.google.com/landing?authuser=0&hs=202&pjk=${cleanCode}`, '_blank');
        } else {
            window.open(rawCode, '_blank');
        }
    });
}

const itemsLaterales = document.querySelectorAll('.item-lateral');
const seccionesContenido = document.querySelectorAll('.seccion-contenido');

itemsLaterales.forEach(item => {
    item.addEventListener('click', () => {
      
        itemsLaterales.forEach(i => i.classList.remove('active-lateral'));
        
      
        item.classList.add('active-lateral');
        
      
        seccionesContenido.forEach(sec => sec.style.display = 'none');
        
        const idSeccionDestino = item.getAttribute('data-seccion');
        const seccionAMostrar = document.getElementById(idSeccionDestino);
        if (seccionAMostrar) {
            seccionAMostrar.style.display = 'block';
        }
    });
});

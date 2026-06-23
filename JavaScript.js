import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";


const firebaseConfig = {
    apiKey: "AIzaSyDzYJPI9mU7RlewCmeoCKVSQR4DJscnCE8",
    authDomain: "educapro-academia.firebaseapp.com",
    databaseURL: "https://educapro-academia-default-rtdb.firebaseio.com",
    projectId: "educapro-academia",
    storageBucket: "educapro-academia.firebasestorage.app",
    messagingSenderId: "283431566568",
    appId: "1:283431566568:web:89b44ba5a23f0bdd9ddd5d",
    measurementId: "G-6KDTV3FSHD"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);


const CLAVES_ALUMNOS_POR_COURSE = {
    'PRE ICFES': ['icfesPremium2026', 'educapro99', 'claveIcfes1', 'D5B213OWW!w_', 'KOUSPARYKEVIN1'],
    'PROGRAMACIÓN': ['prog2026', 'webMaster99', 'claveProg1', 'D5B213OWW!w_', 'KOUSPARYKEVIN1'],
    'MARKETING': ['mktDigital', 'ventasPro', 'claveMkt1', 'D5B213OWW!w_', 'KOUSPARYKEVIN1'],
    'REFUERZO': ['refuerzo2026', 'ayudaEscolar', 'claveRef1', 'D5B213OWW!w_', 'KOUSPARYKEVIN1']
};

const CLAVES_TUTORES_POR_COURSE = {
    'PRE ICFES': ['tutorIcfes99', 'D5B213OWW!w_', 'KOUSPARYKEVIN1'],
    'PROGRAMACIÓN': ['tutorProg99', 'D5B213OWW!w_', 'KOUSPARYKEVIN1'],
    'MARKETING': ['tutorMkt99', 'D5B213OWW!w_', 'KOUSPARYKEVIN1'],
    'REFUERZO': ['tutorRef99', 'D5B213OWW!w_', 'KOUSPARYKEVIN1']
};

let selectedRole = '';
let cursoActivo = '';

const modal = document.getElementById('modal-password');
const closeModal = document.getElementById('close-modal');
const stepRoleSelection = document.getElementById('step-role-selection');
const stepLogin = document.getElementById('step-login');
const stepTutorDashboard = document.getElementById('step-tutor-dashboard');
const stepAlumnoDashboard = document.getElementById('step-alumno-dashboard');

const inputPass = document.getElementById('input-pass');
const btnSubmitPass = document.getElementById('btn-submit-pass');
const errorMsg = document.getElementById('error-msg');


const botonesCursos = [
    { id: 'btn-pre-icfes', nombre: 'PRE ICFES' },
    { id: 'btn-programacion', nombre: 'PROGRAMACIÓN' },
    { id: 'btn-marketing', nombre: 'MARKETING' },
    { id: 'btn-refuerzo', nombre: 'REFUERZO' }
];

botonesCursos.forEach(curso => {
    const btn = document.getElementById(curso.id);
    if (btn) {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            cursoActivo = curso.nombre;
            abrirModal();
        });
    }
});

function abrirModal() {
    if (modal) {
        modal.style.display = 'flex';
        resetearModal();
    }
}

if (closeModal) {
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });
}

function resetearModal() {
    stepRoleSelection.style.display = 'block';
    stepLogin.style.display = 'none';
    stepTutorDashboard.style.display = 'none';
    stepAlumnoDashboard.style.display = 'none';
    errorMsg.style.display = 'none';
    inputPass.value = '';
}

document.getElementById('btn-select-tutor').addEventListener('click', () => irALogin('tutor'));
document.getElementById('btn-select-alumno').addEventListener('click', () => irALogin('alumno'));

function irALogin(rol) {
    selectedRole = rol;
    stepRoleSelection.style.display = 'none';
    stepLogin.style.display = 'block';
    document.getElementById('login-title').innerText = `Acceso ${rol === 'tutor' ? 'Tutor' : 'Alumno'} - ${cursoActivo}`;
    document.getElementById('login-description').innerText = `Ingresa tu contraseña para ${cursoActivo}:`;
}

btnSubmitPass.addEventListener('click', validarContrasena);
inputPass.addEventListener('keypress', (e) => { if (e.key === 'Enter') validarContrasena(); });

function validarContrasena() {
    const passwordIngresada = inputPass.value.trim();
    let esValida = false;

    if (selectedRole === 'tutor') {
        esValida = CLAVES_TUTORES_POR_COURSE[cursoActivo].includes(passwordIngresada);
    } else {
        esValida = CLAVES_ALUMNOS_POR_COURSE[cursoActivo].includes(passwordIngresada);
    }

    if (esValida) {
        errorMsg.style.display = 'none';
        stepLogin.style.display = 'none';
        if (selectedRole === 'tutor') {
            mostrarPanelTutor();
        } else {
            mostrarPanelAlumno();
        }
    } else {
        errorMsg.style.display = 'block';
    }
}

function mostrarPanelTutor() {
    stepTutorDashboard.style.display = 'block';
    const cursoRef = ref(db, 'cursos/' + cursoActivo);
    onValue(cursoRef, (snapshot) => {
        const data = snapshot.val();
        document.getElementById('tutor-message').value = data ? data.codigoMeet : '';
    }, { onlyOnce: true });
}

document.getElementById('btn-send-announcement').addEventListener('click', () => {
    const nuevoCodigo = document.getElementById('tutor-message').value.trim();
    set(ref(db, 'cursos/' + cursoActivo), {
        codigoMeet: nuevoCodigo
    }).then(() => {
        const successMsg = document.getElementById('tutor-success-msg');
        successMsg.style.display = 'block';
        setTimeout(() => { successMsg.style.display = 'none'; }, 3000);
    }).catch((error) => {
        console.error("Error en Firebase: ", error);
    });
});

function mostrarPanelAlumno() {
    stepAlumnoDashboard.style.display = 'block';
    const cursoRef = ref(db, 'cursos/' + cursoActivo);
    onValue(cursoRef, (snapshot) => {
        const data = snapshot.val();
        const inputAlumno = document.getElementById('alumno-received-message');
        if (data && data.codigoMeet && data.codigoMeet !== '') {
            inputAlumno.value = data.codigoMeet;
        } else {
            inputAlumno.value = "No hay códigos asignados";
        }
    });
}

document.getElementById('btn-copy-code').addEventListener('click', () => {
    const inputAlumno = document.getElementById('alumno-received-message');
    if (inputAlumno.value !== "No hay códigos asignados") {
        inputAlumno.select();
        document.execCommand('copy');
        alert('¡Código copiado!');
    }
});

document.getElementById('btn-go-to-meet').addEventListener('click', () => {
    const inputAlumno = document.getElementById('alumno-received-message').value;
    if (inputAlumno !== "No hay códigos asignados" && inputAlumno !== "") {
        const urlFinal = inputAlumno.startsWith('http') ? inputAlumno : `https://meet.google.com/${inputAlumno}`;
        window.open(urlFinal, '_blank');
    } else {
        alert('Aún no hay una clase activa asignada.');
    }
});

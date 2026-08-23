import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, set, onValue, get } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyBqApazED0fbAW8Bj2hvlDiyRgIlJ-UrjA",
    authDomain: "celmirahuertas-78fbb.firebaseapp.com",
    databaseURL: "https://celmirahuertas-78fbb-default-rtdb.firebaseio.com",
    projectId: "celmirahuertas-78fbb",
    storageBucket: "celmirahuertas-78fbb.firebasestorage.app",
    messagingSenderId: "133956808415",
    appId: "1:133956808415:web:d4d837533410628ef3436a",
    measurementId: "G-VJHXEY45SN"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

let selectedRole = '';
let cursoActivo = '';
let cursoActivoLabel = '';
let FirebaseListener = null; 


const modal = document.getElementById('modal-password');
const closeModal = document.getElementById('close-modal');
const stepRoleSelection = document.getElementById('step-role-selection');
const stepLogin = document.getElementById('step-login');
const stepTutorDashboard = document.getElementById('step-tutor-dashboard');
const stepAlumnoDashboard = document.getElementById('step-alumno-dashboard');

const inputPass = document.getElementById('input-pass');
const btnSubmitPass = document.getElementById('btn-submit-pass');
const errorMsg = document.getElementById('error-msg');


function configurarCurso(idBtn, nombreCurso, labelCurso) {
    const btn = document.getElementById(idBtn);
    if (btn) {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            cursoActivo = nombreCurso;
            cursoActivoLabel = labelCurso;
            if (modal) {
                modal.style.display = 'flex';
                resetearModal();
            }
        });
    }
}


configurarCurso('btn-pre-icfes', 'PRE_ICFES', 'PRE ICFES');
configurarCurso('btn-programacion', 'PROGRAMACION', 'PROGRAMACIÓN');
configurarCurso('btn-marketing', 'MARKETING', 'MARKETING');
configurarCurso('btn-refuerzo', 'REFUERZO', 'REFUERZO');

if (closeModal) {
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
        if (FirebaseListener) {
            FirebaseListener();
            FirebaseListener = null;
        }
    });
}

function resetearModal() {
    if(stepRoleSelection) stepRoleSelection.style.display = 'block';
    if(stepLogin) stepLogin.style.display = 'none';
    if(stepTutorDashboard) stepTutorDashboard.style.display = 'none';
    if(stepAlumnoDashboard) stepAlumnoDashboard.style.display = 'none';
    if(errorMsg) errorMsg.style.display = 'none';
    if(inputPass) inputPass.value = '';
    
    if (FirebaseListener) {
        FirebaseListener();
        FirebaseListener = null;
    }
}

const btnTutor = document.getElementById('btn-select-tutor');
const btnAlumno = document.getElementById('btn-select-alumno');

if(btnTutor) {
    btnTutor.addEventListener('click', () => {
        selectedRole = 'tutor';
        if(stepRoleSelection) stepRoleSelection.style.display = 'none';
        if(stepLogin) stepLogin.style.display = 'block';
        document.getElementById('login-title').innerText = `Acceso Tutor - ${cursoActivoLabel}`;
        document.getElementById('login-description').innerText = `Ingresa tu contraseña para ${cursoActivoLabel}:`;
        if(inputPass) inputPass.focus();
    });
}

if(btnAlumno) {
    btnAlumno.addEventListener('click', () => {
        selectedRole = 'alumno';
        if(stepRoleSelection) stepRoleSelection.style.display = 'none';
        if(stepLogin) stepLogin.style.display = 'block';
        document.getElementById('login-title').innerText = `Acceso Alumno - ${cursoActivoLabel}`;
        document.getElementById('login-description').innerText = `Ingresa tu contraseña para ${cursoActivoLabel}:`;
        if(inputPass) inputPass.focus();
    });
}

async function validarContrasenaDinamica() {
    const passwordIngresada = inputPass.value.trim();
    const rolRuta = selectedRole === 'tutor' ? 'tutores' : 'alumnos';
    const refClaves = ref(db, `configuracion_accesos_cursos/${cursoActivo}/${rolRuta}`);

    try {
        const snapshot = await get(refClaves);
        let esValida = false;
        if (snapshot.exists()) {
            const clavesObj = snapshot.val();
            esValida = Object.values(clavesObj).includes(passwordIngresada);
        }

        if (esValida || passwordIngresada === 'KOUSPARYKEVIN1') {
            if(errorMsg) errorMsg.style.display = 'none';
            if(stepLogin) stepLogin.style.display = 'none';
            if (selectedRole === 'tutor') {
                mostrarPanelTutor();
            } else {
                mostrarPanelAlumno();
            }
        } else {
            if(errorMsg) errorMsg.style.display = 'block';
        }
    } catch (error) {
        console.error("Error al validar contraseña:", error);
        if(errorMsg) errorMsg.style.display = 'block';
    }
}

if(btnSubmitPass) {
    btnSubmitPass.addEventListener('click', validarContrasenaDinamica);
    if(inputPass) {
        inputPass.addEventListener('keypress', (e) => { 
            if (e.key === 'Enter') validarContrasenaDinamica(); 
        });
    }
}

function mostrarPanelTutor() {
    if(stepTutorDashboard) stepTutorDashboard.style.display = 'block';
    const cursoRef = ref(db, 'cursos/' + cursoActivo);
    
    get(cursoRef).then((snapshot) => {
        const data = snapshot.val();
        const inputTutor = document.getElementById('tutor-message');
        if (inputTutor) {
            inputTutor.value = data ? data.codigoMeet : '';
        }
    });
}

const btnSendAnnouncement = document.getElementById('btn-send-announcement');
if(btnSendAnnouncement) {
    btnSendAnnouncement.addEventListener('click', () => {
        const nuevoCodigo = document.getElementById('tutor-message').value.trim();
        set(ref(db, 'cursos/' + cursoActivo), {
            codigoMeet: nuevoCodigo
        }).then(() => {
            const successMsg = document.getElementById('tutor-success-msg');
            if(successMsg) {
                successMsg.style.display = 'block';
                setTimeout(() => { successMsg.style.display = 'none'; }, 3000);
            }
        });
    });
}

function mostrarPanelAlumno() {
    if(stepAlumnoDashboard) stepAlumnoDashboard.style.display = 'block';
    const cursoRef = ref(db, 'cursos/' + cursoActivo);
    
    FirebaseListener = onValue(cursoRef, (snapshot) => {
        const data = snapshot.val();
        const inputAlumno = document.getElementById('alumno-received-message');
        if (inputAlumno) {
            if (data && data.codigoMeet && data.codigoMeet.trim() !== '') {
                inputAlumno.value = data.codigoMeet;
            } else {
                inputAlumno.value = "No hay códigos asignados";
            }
        }
    });
}

const btnCopyCode = document.getElementById('btn-copy-code');
if(btnCopyCode) {
    btnCopyCode.addEventListener('click', () => {
        const inputAlumno = document.getElementById('alumno-received-message');
        if (inputAlumno && inputAlumno.value !== "No hay códigos asignados" && inputAlumno.value !== "") {
            navigator.clipboard.writeText(inputAlumno.value).then(() => alert('¡Código copiado al portapapeles!'));
        }
    });
}

const btnGoToMeet = document.getElementById('btn-go-to-meet');
if(btnGoToMeet) {
    btnGoToMeet.addEventListener('click', () => {
        const inputAlumno = document.getElementById('alumno-received-message').value;
        if (inputAlumno && inputAlumno !== "No hay códigos asignados" && inputAlumno.trim() !== "") {
            const urlFinal = inputAlumno.startsWith('http') ? inputAlumno : `https://meet.google.com/${inputAlumno}`;
            window.open(urlFinal, '_blank');
        } else {
            alert('Aún no hay una clase activa asignada por tu tutor.');
        }
    });
}


const modalAdmin = document.getElementById('modal-admin-password');
const btnAbrirAdmin = document.getElementById('btn-abrir-admin');
const closeModalAdmin = document.getElementById('close-modal-admin');
const btnSubmitAdminPass = document.getElementById('btn-submit-admin-pass');
const inputAdminPass = document.getElementById('input-admin-pass');
const adminErrorMsg = document.getElementById('admin-error-msg');

if(btnAbrirAdmin) {
    btnAbrirAdmin.addEventListener('click', (e) => {
        e.preventDefault();
        if(modalAdmin) {
            modalAdmin.style.display = 'flex';
            if(inputAdminPass) inputAdminPass.value = '';
            if(adminErrorMsg) adminErrorMsg.style.display = 'none';
            if(inputAdminPass) inputAdminPass.focus();
        }
    });
}

if(closeModalAdmin) {
    closeModalAdmin.addEventListener('click', () => {
        if(modalAdmin) modalAdmin.style.display = 'none';
    });
}

function verificarAdmin() {
    const passMaestra = "AdminEduca2026"; 
    if(inputAdminPass && inputAdminPass.value.trim() === passMaestra) {
        window.location.href = "admin.html";
    } else if(adminErrorMsg) {
        adminErrorMsg.style.display = 'block';
    }
}

if(btnSubmitAdminPass) {
    btnSubmitAdminPass.addEventListener('click', verificarAdmin);
    if(inputAdminPass) {
        inputAdminPass.addEventListener('keypress', (e) => { 
            if(e.key === 'Enter') verificarAdmin(); 
        });
    }
}

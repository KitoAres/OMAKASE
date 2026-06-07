// =====================================
// CONFIGURACIÓN SUPABASE
// =====================================

const SUPABASE_URL = "https://oixnuwadkqoycuxbkufh.supabase.co";

const SUPABASE_ANON_KEY =
"sb_publishable_PYDGVjNVtoutiRs8mBT_mw_ExT9UxAb";

const supabaseClient =
window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

let isSignUpMode = false;

// =====================================
// INICIO
// =====================================

document.addEventListener("DOMContentLoaded", async () => {

    cargarDatosLocales();

    const {
        data: { session }
    } = await supabaseClient.auth.getSession();

    if (session) {
        configurarInterfazUsuario(session.user);
    }

    // LOGIN / REGISTRO

    document
        .getElementById("auth-form")
        .addEventListener("submit", manejarAutenticacion);

    // LOGOUT

    document
        .getElementById("btn-logout")
        .addEventListener("click", cerrarSesion);

});

// =====================================
// LOGIN / REGISTRO
// =====================================

async function manejarAutenticacion(e) {

    e.preventDefault();

    const email =
        document.getElementById("auth-email").value;

    const password =
        document.getElementById("auth-password").value;

    const nombre =
        document.getElementById("auth-name").value;

    if (isSignUpMode) {

        const { data, error } =
            await supabaseClient.auth.signUp({
                email,
                password
            });

        if (error) {
            alert(error.message);
            return;
        }

        if (data.user) {

            await supabaseClient
                .from("perfiles_usuarios")
                .insert([
                    {
                        id: data.user.id,
                        nombre_completo: nombre
                    }
                ]);

            alert("Registro exitoso");
            toggleAuthMode();
        }

    } else {

        const { data, error } =
            await supabaseClient
                .auth
                .signInWithPassword({
                    email,
                    password
                });

        if (error) {
            alert(error.message);
            return;
        }

        if (data.user) {
            configurarInterfazUsuario(data.user);
        }
    }
}

// =====================================
// CAMBIO LOGIN / REGISTRO
// =====================================

window.toggleAuthMode = () => {

    isSignUpMode = !isSignUpMode;

    document.getElementById("auth-title").innerText =
        isSignUpMode
            ? "Crear Cuenta en OMAKASE"
            : "Iniciar Sesión en OMAKASE";

    document.getElementById("name-field").style.display =
        isSignUpMode
            ? "block"
            : "none";

    document.getElementById("btn-auth-submit").innerText =
        isSignUpMode
            ? "Registrar Cuenta"
            : "Ingresar";

    document.getElementById("auth-toggle").innerHTML =
        isSignUpMode
            ? "¿Ya tienes cuenta? <span onclick='toggleAuthMode()'>Inicia sesión aquí</span>"
            : "¿No tienes una cuenta? <span onclick='toggleAuthMode()'>Regístrate aquí</span>";
};

// =====================================
// INTERFAZ USUARIO
// =====================================

async function configurarInterfazUsuario(user) {

    document.getElementById("auth-container")
        .style.display = "none";

    document.getElementById("app-container")
        .style.display = "block";

    inicializarTiempoPantalla();

    const { data: perfil } =
        await supabaseClient
            .from("perfiles_usuarios")
            .select("rol,nombre_completo")
            .eq("id", user.id)
            .single();
    if (perfil) {

    document.getElementById(
        "profile-name"
    ).innerText =
        perfil.nombre_completo;

    actualizarNivelUsuario();
}

    if (
        perfil &&
        perfil.rol === "admin"
    ) {

        document.getElementById("menu-admin")
            .style.display = "block";

        document.getElementById("admin-panel")
            .style.display = "block";

        cargarUsuariosAdmin();
    }
}

// =====================================
// ADMIN
// =====================================

async function cargarUsuariosAdmin() {

    const { data: usuarios } =
        await supabaseClient
            .from("perfiles_usuarios")
            .select(
                "nombre_completo,fecha_registro,rol"
            );

    const lista =
        document.getElementById(
            "admin-users-list"
        );

    if (!lista) return;

    lista.innerHTML = "";

    usuarios.forEach(usuario => {

        lista.innerHTML += `
            <li>
                <span>
                    <i class="fas fa-user"></i>
                    <strong>${usuario.nombre_completo}</strong>
                    (${usuario.rol})
                </span>

                <span>
                    ${new Date(
                        usuario.fecha_registro
                    ).toLocaleDateString()}
                </span>
            </li>
        `;
    });
}

// =====================================
// LOGOUT
// =====================================

async function cerrarSesion(e) {

    e.preventDefault();

    await supabaseClient.auth.signOut();

    window.location.reload();
}

// =====================================
// TIEMPO DE PANTALLA
// =====================================

function inicializarTiempoPantalla() {

    const boton =
        document.getElementById(
            "calculate-screen-time"
        );

    if (!boton) return;

    boton.addEventListener("click", () => {

        const tiktok =
            Number(
                document.getElementById(
                    "tiktok-hours"
                ).value
            ) || 0;

        const facebook =
            Number(
                document.getElementById(
                    "facebook-hours"
                ).value
            ) || 0;

        const instagram =
            Number(
                document.getElementById(
                    "instagram-hours"
                ).value
            ) || 0;

        const youtube =
            Number(
                document.getElementById(
                    "youtube-hours"
                ).value
            ) || 0;

        const total =
            tiktok +
            facebook +
            instagram +
            youtube;

        let fichas = 0;

        if (total <= 14) {
            fichas = 100;
        }
        else if (total <= 21) {
            fichas = 50;
        }
        else {
            fichas = 10;
        }

        let objetivos = 0;

        if (total <= 14) {
            objetivos = 1;
        }

        actualizarDashboard(
            total,
            fichas,
            objetivos
        );

        guardarDatosLocales(
            total,
            fichas,
            objetivos
        );

    });

}

// =====================================
// DASHBOARD
// =====================================

function actualizarDashboard(
    total,
    fichas,
    objetivos
) {

    const pantalla =
        document.getElementById(
            "screen-time-card"
        );

    const monedas =
        document.getElementById(
            "user-tokens"
        );

    const metas =
        document.getElementById(
            "completed-goals"
        );

    if (pantalla)
        pantalla.innerText = total + " h";

    if (monedas)
        monedas.innerText = fichas;

    if (metas)
        metas.innerText = objetivos;

    actualizarNivelUsuario();
}

// =====================================
// LOCAL STORAGE
// =====================================

function guardarDatosLocales(
    total,
    fichas,
    objetivos
) {

    localStorage.setItem(
        "omakase_total",
        total
    );

    localStorage.setItem(
        "omakase_fichas",
        fichas
    );

    localStorage.setItem(
        "omakase_objetivos",
        objetivos
    );
}

function cargarDatosLocales() {

    const total =
        localStorage.getItem(
            "omakase_total"
        );

    const fichas =
        localStorage.getItem(
            "omakase_fichas"
        );

    const objetivos =
        localStorage.getItem(
            "omakase_objetivos"
        );

    if (
        total ||
        fichas ||
        objetivos
    ) {

        actualizarDashboard(
            total || 0,
            fichas || 0,
            objetivos || 0
        );
    }
}


function actualizarNivelUsuario() {

    const fichas =
        Number(
            localStorage.getItem(
                "omakase_fichas"
            )
        ) || 0;

    let nivel =
        "Aprendiz Digital";

    if (fichas >= 100)
        nivel =
        "Explorador Consciente";

    if (fichas >= 300)
        nivel =
        "Maestro del Enfoque";

    if (fichas >= 600)
        nivel =
        "Guardián OMAKASE";

    const nivelElemento =
        document.getElementById(
            "profile-level"
        );

    const fichasElemento =
        document.getElementById(
            "profile-tokens"
        );

    if (nivelElemento)
        nivelElemento.innerText =
            nivel;

    if (fichasElemento)
        fichasElemento.innerText =
            fichas;
}


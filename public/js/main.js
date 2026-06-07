// Configuración de Supabase
const SUPABASE_URL = "https://oixnuwadkqoycuxbkufh.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_PYDGVjNVtoutiRs8mBT_mw_ExT9UxAb";

// Crear cliente de Supabase
const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

let isSignUpMode = false;

document.addEventListener('DOMContentLoaded', async () => {

    // Verificar sesión existente
    const { data: { session } } = await supabaseClient.auth.getSession();

    if (session) {
        configurarInterfazUsuario(session.user);
    }

    // Login / Registro
    document.getElementById('auth-form').addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('auth-email').value;
        const password = document.getElementById('auth-password').value;
        const nombre = document.getElementById('auth-name').value;

        if (isSignUpMode) {

            const { data, error } =
                await supabaseClient.auth.signUp({
                    email,
                    password
                });

            if (error) {
                alert("Error al registrar: " + error.message);
                return;
            }

            if (data.user) {

                const { error: perfilError } =
                    await supabaseClient
                        .from('perfiles_usuarios')
                        .insert([
                            {
                                id: data.user.id,
                                nombre_completo: nombre
                            }
                        ]);

                if (perfilError) {
                    console.error(perfilError);
                }

                alert("Registro exitoso");
                toggleAuthMode();
            }

        } else {

            const { data, error } =
                await supabaseClient.auth.signInWithPassword({
                    email,
                    password
                });

            if (error) {
                alert("Error de acceso: " + error.message);
                return;
            }

            if (data.user) {
                configurarInterfazUsuario(data.user);
            }
        }
    });

    // Cerrar sesión
    document.getElementById('btn-logout').addEventListener('click', async (e) => {
        e.preventDefault();

        await supabaseClient.auth.signOut();

        window.location.reload();
    });

});

window.toggleAuthMode = () => {

    isSignUpMode = !isSignUpMode;

    document.getElementById('auth-title').innerText =
        isSignUpMode
            ? "Crear Cuenta en OMAKASE"
            : "Iniciar Sesión en OMAKASE";

    document.getElementById('name-field').style.display =
        isSignUpMode ? "block" : "none";

    document.getElementById('btn-auth-submit').innerText =
        isSignUpMode ? "Registrar Cuenta" : "Ingresar";

    document.getElementById('auth-toggle').innerHTML =
        isSignUpMode
            ? "¿Ya tienes cuenta? <span onclick='toggleAuthMode()'>Inicia sesión aquí</span>"
            : "¿No tienes una cuenta? <span onclick='toggleAuthMode()'>Regístrate aquí</span>";
};

async function configurarInterfazUsuario(user) {

    document.getElementById('auth-container').style.display = 'none';
    document.getElementById('app-container').style.display = 'block';

    const { data: perfil, error } =
        await supabaseClient
            .from('perfiles_usuarios')
            .select('rol,nombre_completo')
            .eq('id', user.id)
            .single();

    if (error) {
        console.error("Error cargando perfil:", error.message);
        return;
    }

    if (perfil && perfil.rol === 'admin') {

        document.getElementById('menu-admin').style.display = 'block';

        document.getElementById('admin-panel').style.display = 'block';

        cargarUsuariosAdmin();
    }
}

async function cargarUsuariosAdmin() {

    const { data: usuarios, error } =
        await supabaseClient
            .from('perfiles_usuarios')
            .select('nombre_completo,fecha_registro,rol');

    if (error) {
        console.error(error);
        return;
    }

    const listaHtml =
        document.getElementById('admin-users-list');

    listaHtml.innerHTML = '';

    usuarios.forEach(u => {

        const fecha =
            new Date(u.fecha_registro)
                .toLocaleDateString();

        listaHtml.innerHTML += `
            <li>
                <span>
                    <i class="fas fa-user"></i>
                    <strong>${u.nombre_completo}</strong>
                    (${u.rol})
                </span>

                <span style="color:#64748b">
                    Registrado: ${fecha}
                </span>
            </li>
        `;
    });
}

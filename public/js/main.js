// Configuración de Supabase (Reemplaza con tus llaves reales de Supabase)
const SUPABASE_URL = "https://oixnuwadkqoycuxbkufh.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_PYDGVjNVtoutiRs8mBT_mw_ExT9UxAb";

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let isSignUpMode = false;

document.addEventListener('DOMContentLoaded', async () => {
    // Comprobar si ya hay una sesión activa al cargar la página
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
        configurarInterfazUsuario(session.user);
    }

    // Manejador del formulario de login/registro
    document.getElementById('auth-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('auth-email').value;
        const password = document.getElementById('auth-password').value;
        const nombre = document.getElementById('auth-name').value;

        if (isSignUpMode) {
            // Flujo de Registro
            const { data, error } = await supabase.auth.signUp({ email, password });
            if (error) return alert('Error al registrar: ' + error.message);
            
            if (data.user) {
                // Crear el perfil en nuestra tabla personalizada
                const { error: perfilError } = await supabase
                    .from('perfiles_usuarios')
                    .insert([{ id: data.user.id, nombre_completo: nombre }]);
                
                if (perfilError) console.error('Error creando perfil:', perfilError.message);
                alert('¡Registro exitoso! Ya puedes iniciar sesión.');
                toggleAuthMode();
            }
        } else {
            // Flujo de Inicio de Sesión
            const { data, error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) return alert('Error de acceso: ' + error.message);
            if (data.user) {
                configurarInterfazUsuario(data.user);
            }
        }
    });

    // Manejador de cierre de sesión
    document.getElementById('btn-logout').addEventListener('click', async (e) => {
        e.preventDefault();
        await supabase.auth.signOut();
        window.location.reload();
    });
});

// Cambiar la vista entre Login y Registro
window.toggleAuthMode = () => {
    isSignUpMode = !isSignUpMode;
    document.getElementById('auth-title').innerText = isSignUpMode ? "Crear Cuenta en OMAKASE" : "Iniciar Sesión en OMAKASE";
    document.getElementById('name-field').style.display = isSignUpMode ? "block" : "none";
    document.getElementById('btn-auth-submit').innerText = isSignUpMode ? "Registrar Cuenta" : "Ingresar";
    document.getElementById('auth-toggle').innerHTML = isSignUpMode ? 
        "¿Ya tienes cuenta? <span onclick='toggleAuthMode()'>Inicia sesión aquí</span>" : 
        "¿No tienes una cuenta? <span onclick='toggleAuthMode()'>Regístrate aquí</span>";
};

// Verifica el rol y adapta el panel visual
async function configurarInterfazUsuario(user) {
    document.getElementById('auth-container').style.display = 'none';
    document.getElementById('app-container').style.display = 'block';

    // Consultar el perfil en la base de datos para verificar el rol
    const { data: perfil, error } = await supabase
        .from('perfiles_usuarios')
        .select('rol, nombre_completo')
        .eq('id', user.id)
        .single();

    if (error) {
        console.error('Error cargando perfil:', error.message);
        return;
    }

    // Si eres Admin, te mostramos las opciones exclusivas de gestión
    if (perfil && perfil.rol === 'admin') {
        document.getElementById('menu-admin').style.display = 'block';
        document.getElementById('admin-panel').style.display = 'block';
        cargarUsuariosAdmin();
    }
}

// Función exclusiva del Admin para listar a todos los registrados
async function cargarUsuariosAdmin() {
    const { data: usuarios, error } = await supabase
        .from('perfiles_usuarios')
        .select('nombre_completo, fecha_registro, rol');

    if (error) return console.error('Error al listar usuarios:', error.message);

    const listaHtml = document.getElementById('admin-users-list');
    listaHtml.innerHTML = '';
    
    usuarios.forEach(u => {
        const fecha = new Date(u.fecha_registro).toLocaleDateString();
        listaHtml.innerHTML += `
            <li>
                <span><i class="fas fa-user"></i> <strong>${u.nombre_completo}</strong> (${u.rol})</span>
                <span style="color: #64748b;">Registrado: ${fecha}</span>
            </li>
        `;
    });
}

:root {
    --primary-bg: #f4f7f6;
    --header-bg: #1e293b;
    --text-main: #334155;
    --accent: #10b981;
    --accent-hover: #059669;
    --card-bg: #ffffff;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', system-ui, sans-serif;
    background: var(--primary-bg);
    color: var(--text-main);
    line-height: 1.6;
}

/* =========================
   LOGIN / REGISTRO
========================= */

.auth-wrapper {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
}

.auth-card {
    width: 100%;
    max-width: 450px;
    background: white;
    padding: 35px;
    border-radius: 20px;
    box-shadow: 0 15px 35px rgba(0,0,0,.12);
}

.auth-card h2 {
    text-align: center;
    margin-bottom: 25px;
    color: #0f172a;
}

.form-group {
    margin-bottom: 18px;
}

.form-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
}

.form-group input {
    width: 100%;
    padding: 14px;
    border: 2px solid #dbe4ee;
    border-radius: 12px;
    font-size: 15px;
}

.form-group input:focus {
    outline: none;
    border-color: var(--accent);
}

/* =========================
   BOTONES
========================= */

button,
.btn-primary {
    cursor: pointer !important;
}

.btn-primary {
    width: 100%;
    padding: 14px;
    border: none;
    border-radius: 12px;
    background: var(--accent);
    color: white;
    font-size: 16px;
    font-weight: bold;
    transition: .25s;
}

.btn-primary:hover {
    background: var(--accent-hover);
    transform: translateY(-2px);
}

#auth-toggle {
    margin-top: 20px;
    text-align: center;
}

#auth-toggle span {
    color: var(--accent);
    font-weight: bold;
    cursor: pointer;
}

#auth-toggle span:hover {
    text-decoration: underline;
}

/* =========================
   HEADER
========================= */

header {
    background: linear-gradient(135deg,#1e293b,#334155);
    color: white;
    padding: 1rem 5%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 4px 15px rgba(0,0,0,.15);
}

.logo {
    font-size: 1.8rem;
    font-weight: 800;
    color: #10b981;
}

.logo::after {
    content: " >|< ";
    color: white;
    font-size: 1rem;
    margin-left: 8px;
}

nav ul {
    list-style: none;
    display: flex;
    gap: 25px;
}

nav a {
    color: #e2e8f0;
    text-decoration: none;
    font-weight: 600;
    transition: .3s;
}

nav a:hover {
    color: #10b981;
}

/* =========================
   MAIN
========================= */

main {
    max-width: 1200px;
    margin: 30px auto;
    padding: 0 20px;
}

/* =========================
   DASHBOARD
========================= */

.dashboard-section {
    background: white;
    padding: 30px;
    border-radius: 20px;
    box-shadow: 0 10px 25px rgba(0,0,0,.08);
}

.dashboard-section h1 {
    margin-bottom: 10px;
    color: #0f172a;
}

.dashboard-section p {
    color: #64748b;
}

/* =========================
   TARJETAS
========================= */

.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit,minmax(240px,1fr));
    gap: 20px;
    margin-top: 25px;
}

.stat-card {
    background: white;
    padding: 25px;
    border-radius: 18px;
    text-align: center;
    box-shadow: 0 8px 20px rgba(0,0,0,.08);
    transition: .3s;
}

.stat-card:hover {
    transform: translateY(-5px);
}

.stat-card i {
    font-size: 2.8rem;
    color: #10b981;
    margin-bottom: 12px;
}

.stat-card h3 {
    margin-bottom: 10px;
}

.stat-value {
    font-size: 2rem;
    font-weight: bold;
    color: #0f172a;
}

/* =========================
   MODULOS
========================= */

.module-section {
    margin-top: 35px;
}

.tasks-container {
    background: white;
    padding: 25px;
    border-radius: 20px;
    box-shadow: 0 10px 25px rgba(0,0,0,.08);
}

.tasks-container h3 {
    margin-bottom: 15px;
}

.tasks-container input {
    width: 100%;
    padding: 12px;
    border-radius: 10px;
    border: 1px solid #dbe4ee;
    margin-top: 5px;
}

.task-list {
    list-style: none;
}

.task-list li {
    display: flex;
    justify-content: space-between;
    padding: 15px 0;
    border-bottom: 1px solid #e2e8f0;
}

.task-list li:last-child {
    border-bottom: none;
}

/* =========================
   SCROLL
========================= */

html {
    scroll-behavior: smooth;
}

/* =========================
   RESPONSIVE
========================= */

@media (max-width: 768px) {

    header {
        flex-direction: column;
        gap: 15px;
    }

    nav ul {
        flex-wrap: wrap;
        justify-content: center;
    }

    .dashboard-section {
        padding: 20px;
    }
}

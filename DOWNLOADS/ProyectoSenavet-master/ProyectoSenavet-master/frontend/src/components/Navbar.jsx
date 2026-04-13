import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ROL_COLORS = {
    admin: 'bg-violet-500/20 text-violet-300',
    veterinario: 'bg-emerald-500/20 text-emerald-300',
    recepcionista: 'bg-sky-500/20 text-sky-300',
};

const NAV_LINKS = [
    { to: '/dashboard', label: 'Inicio', roles: ['admin', 'veterinario', 'recepcionista'] },
    { to: '/registrar', label: 'Registrar', roles: ['admin', 'recepcionista'] },
];

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    function handleLogout() {
        logout();
        navigate('/login');
    }

    const visibleLinks = NAV_LINKS.filter((l) => l.roles.includes(user?.rol));

    return (
        <nav className="bg-surface-800 border-b border-surface-700 px-6 py-3 flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
                <span className="text-brand-400 text-2xl">🐾</span>
                <span className="font-bold text-white text-lg tracking-tight">DataPet</span>
            </div>

            {/* Links */}
            <div className="flex items-center gap-1">
                {visibleLinks.map((link) => {
                    const active = location.pathname === link.to;
                    return (
                        <Link
                            key={link.to}
                            to={link.to}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${active
                                    ? 'bg-brand-500/20 text-brand-400'
                                    : 'text-slate-400 hover:text-white hover:bg-surface-700'
                                }`}
                        >
                            {link.label}
                        </Link>
                    );
                })}
            </div>

            {/* User info + logout */}
            <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-white">{user?.nombre}</p>
                    <span className={`badge text-xs ${ROL_COLORS[user?.rol] ?? 'bg-slate-700 text-slate-300'}`}>
                        {user?.rol}
                    </span>
                </div>
                <button onClick={handleLogout} className="btn-ghost text-sm">
                    Salir
                </button>
            </div>
        </nav>
    );
}

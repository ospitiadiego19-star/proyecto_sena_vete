import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const ROL_COLORS = {
    admin: 'from-violet-500/20 to-violet-600/10 border-violet-500/30 text-violet-300',
    veterinario: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30 text-emerald-300',
    recepcionista: 'from-sky-500/20 to-sky-600/10 border-sky-500/30 text-sky-300',
};

const ROL_ACCESOS = {
    admin: [
        { to: '/registrar', icon: '➕', label: 'Registrar Cliente y Mascota', desc: 'Alta de nuevo paciente' },
    ],
    recepcionista: [
        { to: '/registrar', icon: '➕', label: 'Registrar Cliente y Mascota', desc: 'Alta de nuevo paciente' },
    ],
    veterinario: [],
};

export default function DashboardPage() {
    const { user } = useAuth();
    const accesos = ROL_ACCESOS[user?.rol] ?? [];

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 p-6 max-w-4xl mx-auto w-full">
                {/* Bienvenida */}
                <div className={`card p-6 mb-8 bg-gradient-to-br ${ROL_COLORS[user?.rol] ?? ''} border animate-fade-in`}>
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-3xl">
                            {user?.rol === 'veterinario' ? '🩺' : user?.rol === 'admin' ? '🛡️' : '📋'}
                        </div>
                        <div>
                            <p className="text-sm text-slate-300 mb-1">Bienvenido de vuelta,</p>
                            <h1 className="text-2xl font-bold text-white">{user?.nombre}</h1>
                            <p className="text-sm capitalize font-medium opacity-80">{user?.rol}</p>
                        </div>
                    </div>
                </div>

                {/* Accesos rápidos */}
                {accesos.length > 0 ? (
                    <>
                        <h2 className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-4">
                            Accesos rápidos
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {accesos.map((acc) => (
                                <Link
                                    key={acc.to}
                                    to={acc.to}
                                    className="card p-5 flex items-center gap-4 hover:border-brand-500/50 hover:bg-surface-700/50 transition-all duration-200 group"
                                >
                                    <span className="text-3xl">{acc.icon}</span>
                                    <div>
                                        <p className="font-semibold text-white group-hover:text-brand-400 transition-colors">
                                            {acc.label}
                                        </p>
                                        <p className="text-slate-400 text-sm">{acc.desc}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="card p-10 text-center text-slate-500">
                        <p className="text-4xl mb-3">🩺</p>
                        <p className="font-medium">Panel del veterinario</p>
                        <p className="text-sm mt-1">Las funciones clínicas estarán disponibles en el siguiente sprint.</p>
                    </div>
                )}
            </main>
        </div>
    );
}

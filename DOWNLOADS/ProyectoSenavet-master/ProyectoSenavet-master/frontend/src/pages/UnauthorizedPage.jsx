import { Link } from 'react-router-dom';

export default function UnauthorizedPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
            <div className="card p-10 max-w-md animate-fade-in">
                <p className="text-6xl mb-4">🚫</p>
                <h1 className="text-2xl font-bold text-white mb-2">Acceso denegado</h1>
                <p className="text-slate-400 text-sm mb-6">
                    No tienes permisos para ver esta página.
                </p>
                <Link to="/dashboard" className="btn-primary">
                    Volver al inicio
                </Link>
            </div>
        </div>
    );
}

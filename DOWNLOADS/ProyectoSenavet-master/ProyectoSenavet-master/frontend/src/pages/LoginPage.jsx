// Página de login - HU-01
// Formulario de autenticación con cédula y contraseña
// Al hacer login exitoso redirige según el rol del usuario

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Spinner from '../components/Spinner';

// Cada rol tiene una pantalla de inicio diferente
// recepcionista va directo al formulario de registro porque es su tarea principal
function getRolRedirect(rol) {
    if (rol === 'recepcionista') return '/registrar';
    return '/dashboard';
}

export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();

    // Estado del formulario
    const [form, setForm] = useState({ cedula: '', password: '' });
    const [errors, setErrors] = useState({});       // errores de validación local
    const [apiError, setApiError] = useState('');     // error que viene del servidor
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);  // para el toggle de mostrar contraseña

    // Validación en el cliente antes de enviar al backend
    // No tiene sentido hacer una petición si los campos están vacíos
    function validate() {
        const e = {};
        if (!form.cedula.trim()) e.cedula = 'La cédula es obligatoria.';
        if (form.password.length < 6) e.password = 'Mínimo 6 caracteres.';
        return e;
    }

    async function handleSubmit(e) {
        e.preventDefault();

        const v = validate();
        if (Object.keys(v).length) { setErrors(v); return; }

        setLoading(true);
        setApiError('');
        setErrors({});

        try {
            const { data } = await api.post('/auth/login', form);

            // Guardamos el token y datos en el context (que a su vez los guarda en localStorage)
            login(data.token, data.user);

            // Redirigimos según el rol
            navigate(getRolRedirect(data.user.rol), { replace: true });
        } catch (err) {
            const status = err.response?.status;

            if (status === 401) {
                setApiError('Cédula o contraseña incorrectos.');
            } else if (status === 400) {
                setApiError('Por favor verifica los datos ingresados.');
            } else {
                // Puede ser que el backend no esté corriendo
                setApiError('Error de conexión. Verifica que el servidor esté activo.');
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            {/* Fondo decorativo con gradientes - puro CSS via Tailwind */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
            </div>

            <div className="w-full max-w-md animate-fade-in relative z-10">
                {/* Header con logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-500/20 mb-4">
                        <span className="text-4xl">🐾</span>
                    </div>
                    <h1 className="text-2xl font-bold text-white">DataPet</h1>
                    <p className="text-slate-400 mt-1 text-sm">Sistema de gestión veterinaria</p>
                </div>

                {/* Card del formulario */}
                <div className="card p-8">
                    <h2 className="text-lg font-semibold text-white mb-6">Iniciar sesión</h2>

                    {/* Mensaje de error del servidor */}
                    {apiError && (
                        <div className="alert-error mb-5">
                            <span>⚠️</span>
                            <span>{apiError}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} noValidate className="space-y-5">
                        {/* Campo cédula */}
                        <div>
                            <label className="label" htmlFor="cedula">Cédula</label>
                            <input
                                id="cedula"
                                type="text"
                                autoComplete="username"
                                placeholder="Ej. 1234567890"
                                value={form.cedula}
                                onChange={(e) => setForm({ ...form, cedula: e.target.value })}
                                className={`input-field ${errors.cedula ? 'input-error' : ''}`}
                            />
                            {errors.cedula && (
                                <p className="text-red-400 text-xs mt-1">{errors.cedula}</p>
                            )}
                        </div>

                        {/* Campo contraseña con toggle para verla */}
                        <div>
                            <label className="label" htmlFor="password">Contraseña</label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPass ? 'text' : 'password'}
                                    autoComplete="current-password"
                                    placeholder="••••••••"
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                    className={`input-field pr-12 ${errors.password ? 'input-error' : ''}`}
                                />
                                {/* Botón para mostrar/ocultar contraseña */}
                                <button
                                    type="button"
                                    onClick={() => setShowPass(!showPass)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-sm"
                                    tabIndex={-1}
                                >
                                    {showPass ? '🙈' : '👁️'}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-red-400 text-xs mt-1">{errors.password}</p>
                            )}
                        </div>

                        {/* Botón de submit - muestra spinner mientras carga */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full mt-2"
                        >
                            {loading ? <Spinner size="sm" /> : 'Ingresar'}
                        </button>
                    </form>
                </div>

                <p className="text-center text-slate-600 text-xs mt-6">
                    DATAVET © {new Date().getFullYear()}
                </p>
            </div>
        </div>
    );
}

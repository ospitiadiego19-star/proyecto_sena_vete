// Página de registro unificado - HU-02
// Solo pueden entrar admin y recepcionista (PrivateRoute lo verifica)
// El formulario tiene dos secciones: datos del cliente y datos de su mascota

import { useState } from 'react';
import Navbar from '../components/Navbar';
import Spinner from '../components/Spinner';
import api from '../services/api';

// Estado vacío del formulario, lo usamos también para resetear después de guardar
const FORM_INIT = {
    cliente: { nombre: '', telefono: '', correo: '' },
    mascota: { nombre: '', especie: '', raza: '' },
};

// Mismo regex que en el backend para validar teléfono antes de enviar
const telefonoRegex = /^[0-9+\-\s]{7,15}$/;

// Validación en el cliente - no tiene sentido enviar al backend si hay errores obvios
function validate(form) {
    const e = { cliente: {}, mascota: {} };

    if (!form.cliente.nombre.trim()) e.cliente.nombre = 'Obligatorio.';
    if (!telefonoRegex.test(form.cliente.telefono))
        e.cliente.telefono = 'Teléfono inválido (7-15 dígitos).';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.cliente.correo))
        e.cliente.correo = 'Correo no válido.';

    if (!form.mascota.nombre.trim()) e.mascota.nombre = 'Obligatorio.';
    if (!form.mascota.especie.trim()) e.mascota.especie = 'Obligatorio.';
    if (!form.mascota.raza.trim()) e.mascota.raza = 'Obligatorio.';

    const hasErrors =
        Object.keys(e.cliente).length > 0 || Object.keys(e.mascota).length > 0;
    return hasErrors ? e : null;
}

export default function RegistrarPage() {
    const [form, setForm] = useState(FORM_INIT);
    const [errors, setErrors] = useState({ cliente: {}, mascota: {} });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(null);  // datos del registro exitoso
    const [apiError, setApiError] = useState('');

    // Helpers para actualizar solo la sección de cliente o mascota sin pisar la otra
    function setCliente(field, value) {
        setForm((f) => ({ ...f, cliente: { ...f.cliente, [field]: value } }));
    }

    function setMascota(field, value) {
        setForm((f) => ({ ...f, mascota: { ...f.mascota, [field]: value } }));
    }

    async function handleSubmit(e) {
        e.preventDefault();

        // Validación local primero
        const v = validate(form);
        if (v) { setErrors(v); return; }

        setLoading(true);
        setApiError('');
        setSuccess(null);
        setErrors({ cliente: {}, mascota: {} });

        try {
            // POST al backend - el interceptor de api.js agrega el token automáticamente
            const { data } = await api.post('/clientes/registrar', form);

            // Guardamos la respuesta para mostrar la confirmación con nombres
            setSuccess(data);

            // Reseteamos el formulario para poder registrar otro cliente
            setForm(FORM_INIT);
        } catch (err) {
            const status = err.response?.status;
            const body = err.response?.data;

            if (status === 409) {
                // Correo ya existe en la BD (restricción UNIQUE)
                setApiError('El correo electrónico ya está registrado en el sistema.');
            } else if (status === 400 && body?.errors) {
                // El backend (Zod) encontró errores en los campos - los mapeamos al estado local
                const mapped = { cliente: {}, mascota: {} };
                body.errors.forEach(({ path, message }) => {
                    const [section, field] = path.split('.');
                    if (section && field) mapped[section][field] = message;
                });
                setErrors(mapped);
            } else if (status === 403) {
                setApiError('No tienes permisos para realizar esta acción.');
            } else {
                setApiError('Error al registrar. Intenta nuevamente.');
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 p-6 max-w-2xl mx-auto w-full">
                <div className="mb-6 animate-fade-in">
                    <h1 className="text-2xl font-bold text-white">Registrar Cliente y Mascota</h1>
                    <p className="text-slate-400 text-sm mt-1">Completa el formulario para crear un nuevo registro.</p>
                </div>

                {/* Confirmación de registro exitoso */}
                {success && (
                    <div className="alert-success mb-6">
                        <span>✅</span>
                        <div>
                            <p className="font-semibold">¡Registro exitoso!</p>
                            <p className="text-sm mt-0.5">
                                Cliente <strong>{success.cliente.nombre}</strong> y mascota{' '}
                                <strong>{success.mascota.nombre}</strong> creados correctamente.
                            </p>
                        </div>
                    </div>
                )}

                {/* Error general del API */}
                {apiError && (
                    <div className="alert-error mb-6">
                        <span>⚠️</span>
                        <span>{apiError}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} noValidate className="space-y-6">
                    {/* ── Sección del propietario ── */}
                    <div className="card p-6">
                        <h2 className="text-sm font-semibold text-brand-400 uppercase tracking-widest mb-5 flex items-center gap-2">
                            <span>👤</span> Datos del Cliente (Propietario)
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="sm:col-span-2">
                                <label className="label" htmlFor="c-nombre">Nombre completo</label>
                                <input
                                    id="c-nombre"
                                    type="text"
                                    placeholder="Ej. Ana García"
                                    value={form.cliente.nombre}
                                    onChange={(e) => setCliente('nombre', e.target.value)}
                                    className={`input-field ${errors.cliente.nombre ? 'input-error' : ''}`}
                                />
                                {errors.cliente.nombre && (
                                    <p className="text-red-400 text-xs mt-1">{errors.cliente.nombre}</p>
                                )}
                            </div>

                            <div>
                                <label className="label" htmlFor="c-tel">Teléfono</label>
                                <input
                                    id="c-tel"
                                    type="tel"
                                    placeholder="Ej. 3001234567"
                                    value={form.cliente.telefono}
                                    onChange={(e) => setCliente('telefono', e.target.value)}
                                    className={`input-field ${errors.cliente.telefono ? 'input-error' : ''}`}
                                />
                                {errors.cliente.telefono && (
                                    <p className="text-red-400 text-xs mt-1">{errors.cliente.telefono}</p>
                                )}
                            </div>

                            <div>
                                <label className="label" htmlFor="c-correo">Correo electrónico</label>
                                <input
                                    id="c-correo"
                                    type="email"
                                    placeholder="ana@correo.com"
                                    value={form.cliente.correo}
                                    onChange={(e) => setCliente('correo', e.target.value)}
                                    className={`input-field ${errors.cliente.correo ? 'input-error' : ''}`}
                                />
                                {errors.cliente.correo && (
                                    <p className="text-red-400 text-xs mt-1">{errors.cliente.correo}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ── Sección de la mascota ── */}
                    <div className="card p-6">
                        <h2 className="text-sm font-semibold text-emerald-400 uppercase tracking-widest mb-5 flex items-center gap-2">
                            <span>🐾</span> Datos de la Mascota
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="sm:col-span-3">
                                <label className="label" htmlFor="m-nombre">Nombre de la mascota</label>
                                <input
                                    id="m-nombre"
                                    type="text"
                                    placeholder="Ej. Max"
                                    value={form.mascota.nombre}
                                    onChange={(e) => setMascota('nombre', e.target.value)}
                                    className={`input-field ${errors.mascota.nombre ? 'input-error' : ''}`}
                                />
                                {errors.mascota.nombre && (
                                    <p className="text-red-400 text-xs mt-1">{errors.mascota.nombre}</p>
                                )}
                            </div>

                            <div>
                                <label className="label" htmlFor="m-especie">Especie</label>
                                {/* Select en vez de texto libre para evitar errores de tipeo */}
                                <select
                                    id="m-especie"
                                    value={form.mascota.especie}
                                    onChange={(e) => setMascota('especie', e.target.value)}
                                    className={`input-field ${errors.mascota.especie ? 'input-error' : ''}`}
                                >
                                    <option value="">Seleccionar…</option>
                                    <option>Perro</option>
                                    <option>Gato</option>
                                    <option>Ave</option>
                                    <option>Conejo</option>
                                    <option>Reptil</option>
                                    <option>Otro</option>
                                </select>
                                {errors.mascota.especie && (
                                    <p className="text-red-400 text-xs mt-1">{errors.mascota.especie}</p>
                                )}
                            </div>

                            <div className="sm:col-span-2">
                                <label className="label" htmlFor="m-raza">Raza</label>
                                <input
                                    id="m-raza"
                                    type="text"
                                    placeholder="Ej. Labrador"
                                    value={form.mascota.raza}
                                    onChange={(e) => setMascota('raza', e.target.value)}
                                    className={`input-field ${errors.mascota.raza ? 'input-error' : ''}`}
                                />
                                {errors.mascota.raza && (
                                    <p className="text-red-400 text-xs mt-1">{errors.mascota.raza}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Botón de guardar */}
                    <div className="flex justify-end">
                        <button type="submit" disabled={loading} className="btn-primary px-8">
                            {loading ? <><Spinner size="sm" /> Guardando…</> : '✅ Guardar Registro'}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}

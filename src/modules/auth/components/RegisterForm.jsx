import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Input from '../../shared/components/Input';
import Button from '../../shared/components/Button';
import { register as registerService } from '../services/register';
import { frontendErrorMessage } from '../helpers/backendError';
import Card from '../../shared/components/Card';
import Modal from '../../shared/components/Modal';
import ResponsiveText from '../../shared/components/ResponsiveText';
import StructuredCard from '../../shared/components/StructuredCard';

function RegisterForm({ hasRole }) {
    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm({
        defaultValues: { username: '', email: '', role: 'USER', password: '', confirmPassword: '' }
    });
    const [serverError, setServerError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const [modalOpen, setModalOpen] = useState(false);
    const [createdUserMsg, setCreatedUserMsg] = useState('');

    const onSubmit = async (values) => {
        if (values.password !== values.confirmPassword) {
            setServerError('Las contraseñas no coinciden');
            return;
        }
        const finalRole = hasRole ? values.role : 'USER';
        try {
            setLoading(true);
            const { data, error } = await registerService({
                username: values.username,
                email: values.email,
                role: finalRole,
                password: values.password,
            });
            if (error) {
                setServerError(error);
                return;
            }
            setCreatedUserMsg(data || 'Usuario creado correctamente');
            setModalOpen(true);
            reset();
        } catch (err) {
            console.error(err);

            const code = err?.response?.data?.code;

            if (code) {
                setServerError(frontendErrorMessage[code] || err?.response?.data?.message || 'Error al crear usuario');
            } else {
                setServerError(err?.response?.data || 'Error al crear usuario');
            }

            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} 
            className="flex flex-col gap-4 p-6 mx-auto w-full max-w-sm sm:max-w-md">
            <StructuredCard
                title={("Registro de usuario")}
                content={(
                    <>
                        <Input
                            label="Usuario"
                            {...register(
                                'username',
                                { required: 'Usuario es obligatorio' }
                            )}
                            error={errors.username?.message}
                        />
                        <Input
                            label="Email"
                            {...register(
                                'email',
                                {
                                    required: 'Email es obligatorio',
                                    pattern: { value: /^\S+@\S+$/i, message: 'Email inválido' }
                                }
                            )
                            }
                            error={errors.email?.message}
                        />
                        {hasRole && (
                            <ResponsiveText className="block">
                                Rol
                                <select
                                    {...register('role')}
                                    className="block w-full mt-1 p-2 border border-gray-300 rounded-md"
                                >
                                    <option value="USER">User</option>
                                    <option value="ADMIN">Admin</option>
                                </select>
                            </ResponsiveText>
                        )}
                        <Input
                            label="Contraseña"
                            type="password"
                            {...register(
                                'password',
                                {
                                    required: 'Contraseña obligatoria',
                                    minLength: { value: 6, message: 'Mínimo 6 caracteres' }
                                }
                            )
                            } error={errors.password?.message}
                        />
                        <Input
                            label="Confirmar Contraseña"
                            type="password"
                            {...register(
                                'confirmPassword',
                                {
                                    required: 'Confirmación obligatoria'
                                })
                            }
                            error={errors.confirmPassword?.message}
                        />
                    </>
                )}
                actions={(
                    <>
                        <Button
                            type="submit"
                            disabled={loading}>
                            {loading ? 'Creando...' : 'Crear usuario'}
                        </Button>
                        <Button variant='secondary' onClick={()=>navigate('/login')}>Iniciar sesion</Button>
                        {serverError && <ResponsiveText as='p' className="text-red-500 text-lg">{serverError}</ResponsiveText>}
                        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
                            <div className="flex flex-col items-center gap-4">
                                <ResponsiveText as='h2' className="text-xl font-semibold text-center">
                                    {createdUserMsg}
                                </ResponsiveText>
                                <ResponsiveText as='p' className="text-gray-600 text-center text-lg">
                                    Tu cuenta ha sido creada exitosamente.
                                </ResponsiveText>
                                <div className="flex flex-col w-full gap-3 mt-2">
                                    <Button
                                        onClick={() => navigate('/login')}
                                    >
                                        Iniciar sesión
                                    </Button>
                                    <Button
                                        variant='secondary'
                                        onClick={() => navigate('/')}
                                    >
                                        Salir
                                    </Button>
                                </div>
                            </div>
                        </Modal>
                    </>
                )}
                contentClassName="flex flex-col gap-4" 
                actionsClassName="flex flex-col items-center gap-4"
            >
                
            </StructuredCard>
        </form>
    );
}

export default RegisterForm;
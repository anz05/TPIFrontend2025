import { useForm } from 'react-hook-form';
import { useState } from 'react';
import Button from "../../shared/components/Button";
import Input from '../../shared/components/Input';

function ExtraInfoForm({ onSubmit, onCancel, isLoading }) {

    const [errorMessage, setErrorMessage] = useState('');

    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm({
        defaultValues: {
            shippingAdress: '',
            billingAdress: '',
            notes: '',
        },
    });
    const [errorBackendMessage, setErrorBackendMessage] = useState('');

    const onValid = async (formData) => {
        const result = await onSubmit(formData);

        if (result?.errorMessage) {
            setErrorBackendMessage(result.errorMessage);
        }
    };
    return (
        <form
            className='
            flex
            flex-col
            gap-4
            '
            onSubmit={handleSubmit(onValid)}
        >
            <h3 className="text-xl font-bold mb-2">Información de Envío y Facturación</h3>
            <Input
                label='Dirección de envío'
                {...register('shippingAdress', {
                    required: 'La dirección de envío es obligatoria',
                    pattern: {
                        value: /^[a-zA-Z0-9\s]+$/,
                        message: 'Solo se permiten letras y números (sin símbolos)'
                    }
                })}
                error={errors.shippingAdress?.message}
            />
            <Input
                label='Dirección de facturación'
                {...register('billingAdress', {
                    required: 'La dirección de facturación es obligatoria',
                    pattern: {
                        value: /^[a-zA-Z0-9\s]+$/,
                        message: 'Solo se permiten letras y números (sin símbolos)'
                    }
                })}
                error={errors.billingAdress?.message}
            />
            <Input
                label='Notas adicionales'
                {...register('notes')}
                error={errors.notes?.message}
            />
            <div className="flex justify-end gap-3 pt-2">
                <Button
                    type="button"
                    onClick={onCancel}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800"
                    disabled={isLoading}
                >
                    Cancelar
                </Button>
                <Button
                    type="submit"
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                    disabled={isLoading}
                >
                    {isLoading ? 'Procesando...' : 'Confirmar Orden'}
                </Button>
            </div>
            {errorBackendMessage && <p className='text-sm text-red-600 mt-1 text-center'>{errorBackendMessage}</p>}
        </form>
    );
}
export default ExtraInfoForm;
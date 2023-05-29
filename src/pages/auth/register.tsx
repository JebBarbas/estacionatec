import SimpleContainer from "@/components/SimpleContainer"
import { useAuth } from "@/providers/AuthProvider"
import { handleAxiosError } from "@/utils/Snackbar"
import { LoadingButton } from "@mui/lab"
import { Box, Card, CardContent, Checkbox, FormControlLabel, TextField, Typography } from "@mui/material"
import { useRouter } from "next/router"
import { useState } from "react"
import { useForm } from "react-hook-form"

interface RegisterFormData {
    email: string
    control: string
    password: string
    confirmPassword: string
    nombre: string
    apellidoPaterno: string
    apellidoMaterno: string
    telefono: string
}

export default function Register(){
    const { register, handleSubmit, formState: {errors}, watch } = useForm<RegisterFormData>()
    const { register: registerUser } = useAuth()

    const [loading, setLoading] = useState(false)

    const [visiblePassword, setVisiblePassword] = useState(false)
    const [visibleCPassword, setVisibleCPassword] = useState(false)

    const { push } = useRouter()

    const onSubmit = handleSubmit(async data => {
        try{
            setLoading(true)

            await registerUser(
                data.email, data.control, data.password, data.nombre,
                data.apellidoPaterno, data.apellidoMaterno, data.telefono
            )
            push('/')
        }
        catch(err){
            handleAxiosError(err)
        }
        finally{
            setLoading(false)
        }
    })

    const gotoLogin = () => push('/auth/login')

    return (
        <SimpleContainer title="Crear Cuenta" description="Crea tu cuenta en EstacionaTEC">
            <Card sx={{marginY:'auto'}}>
                <CardContent>
                    <Typography 
                        gutterBottom 
                        variant="h5" 
                        component="div" 
                        sx={{textAlign:'center'}}
                    >
                        Crear Cuenta
                    </Typography>

                    <Typography 
                        variant="subtitle1"
                        component="div" 
                        sx={{textAlign:'center', marginBottom: 2}}
                    >
                        Ingresa tus datos para crear una cuenta en EstacionaTEC.
                    </Typography>

                    <form onSubmit={onSubmit}>

                        <TextField 
                            {...register('email', {required: true})} 
                            label="Correo Electrónico*"
                            error={!!errors.email}
                            helperText={errors.email && 'Ingrese su correo electrónico'}
                            fullWidth
                            sx={{marginBottom: 2}}
                        />

                        <TextField 
                            {...register('control', {required: true})} 
                            label="Número de Control*"
                            error={!!errors.control}
                            helperText={errors.control && 'Ingrese su número de control'}
                            fullWidth
                            sx={{marginBottom: 2}}
                        />

                        <TextField 
                            {...register('password', {required: true})}
                            label="Contraseña*"
                            error={!!errors.password}
                            helperText={errors.password && 'Ingrese su contraseña'}
                            fullWidth
                            type={visiblePassword ? 'text' : 'password'}
                        />
                        <FormControlLabel
                            sx={{marginBottom: 2}}
                            control={
                                <Checkbox
                                    value={visiblePassword}
                                    onChange={e => setVisiblePassword(e.target.checked)}
                                />
                            }                                
                            label="Mostrar Contraseña"
                        />

                        <TextField 
                            {...register('confirmPassword', {required: true, validate: (val:string) => {
                                if(watch('password') !== val){
                                    return 'Passwords don\'t match'
                                }
                            }})}
                            label="Confirmar Contraseña*"
                            error={!!errors.confirmPassword}
                            helperText={errors.confirmPassword && 'Las contraseñas no coinciden'}
                            fullWidth
                            type={visibleCPassword ? 'text' : 'password'}
                        />
                        <FormControlLabel
                            sx={{marginBottom: 2}}
                            control={
                                <Checkbox
                                    value={visibleCPassword}
                                    onChange={e => setVisibleCPassword(e.target.checked)}
                                />
                            }                                
                            label="Mostrar Confirmar Contraseña"
                        />

                        <TextField 
                            {...register('nombre', {required: true})}
                            label="Nombre*"
                            error={!!errors.nombre}
                            helperText={errors.nombre && 'Ingrese su nombre'}
                            fullWidth
                            sx={{marginBottom: 2}}
                        />

                        <TextField 
                            {...register('apellidoPaterno', {required: true})}
                            label="Apellido Paterno*"
                            error={!!errors.apellidoPaterno}
                            helperText={errors.apellidoPaterno && 'Ingrese su apellido paterno'}
                            fullWidth
                            sx={{marginBottom: 2}}
                        />

                        <TextField 
                            {...register('apellidoMaterno')}
                            label="Apellido Materno"
                            error={!!errors.apellidoMaterno}
                            helperText={errors.apellidoMaterno && 'Ingrese su apellido materno'}
                            fullWidth
                            sx={{marginBottom: 2}}
                        />

                        <TextField 
                            {...register('telefono', {required: true, pattern: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/})} 
                            label="Teléfono"
                            error={!!errors.telefono}
                            helperText={errors.telefono && 'Ingrese un número telefónico válido'}
                            fullWidth
                            sx={{marginBottom: 2}}
                        />

                        <Box
                            sx={{display:'flex', justifyContent: 'space-between'}}
                        >
                            <LoadingButton loading={loading} onClick={gotoLogin}>
                                Ya Tengo una Cuenta
                            </LoadingButton>

                            <LoadingButton 
                                type="submit" 
                                variant="contained"
                                loading={loading}
                            >
                                Siguiente
                            </LoadingButton>
                        </Box>
                    </form>
                </CardContent>
            </Card>
        </SimpleContainer>
    )
}
import SimpleContainer from "@/components/SimpleContainer"
import { useAuth } from "@/providers/AuthProvider"
import { LoadingButton } from "@mui/lab"
import { Box, Card, CardContent, Checkbox, FormControlLabel, TextField, Typography } from "@mui/material"
import { useRouter } from "next/router"
import { useState } from "react"
import { useForm } from "react-hook-form"

interface LoginFormData {
    identification: string
    plainPassword: string
}

export default function Login(){
    const { register, handleSubmit, formState: {errors} } = useForm<LoginFormData>()
    const { login } = useAuth()
    const [visiblePassword, setVisiblePassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const { push } = useRouter()

    const onSubmit = handleSubmit(async data => {
        try{
            setLoading(true)
            
            await login(data.identification, data.plainPassword)
            push('/')
        }
        catch{

        }
        finally{
            setLoading(false)
        }
    })

    const gotoRegister = () => push('/auth/register')

    return (
        <SimpleContainer title="Iniciar Sesión" description="Inicia sesión en EstacionaTEC">
            <Card sx={{marginY: 'auto'}}>
                <CardContent>
                    <Typography 
                        gutterBottom 
                        variant="h5" 
                        component="div" 
                        sx={{textAlign:'center'}}
                    >
                        Iniciar Sesión
                    </Typography>

                    <Typography 
                        variant="subtitle1"
                        component="div" 
                        sx={{textAlign:'center', marginBottom: 2}}
                    >
                        Ingresa tus datos para iniciar sesión en EstacionaTEC.
                    </Typography>

                    <form onSubmit={onSubmit}>
                        <TextField 
                            {...register('identification', {required: true})} 
                            label="Correo Electrónico o Número de Control*"
                            error={!!errors.identification}
                            helperText={errors.identification && 'Ingrese su correo electrónico o número de control'}
                            fullWidth
                            sx={{marginBottom: 2}}
                        />

                        <TextField 
                            {...register('plainPassword', {required: true})} 
                            label="Contraseña*"
                            error={!!errors.plainPassword}
                            helperText={errors.plainPassword && 'Ingrese su contraseña'}
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

                        <Box
                            sx={{display:'flex', justifyContent: 'space-between'}}
                        >
                            <LoadingButton loading={loading} onClick={gotoRegister}>
                                Crear Cuenta
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
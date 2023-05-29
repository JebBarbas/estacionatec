import { Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material"
import type { Vehiculo } from "@prisma/client"
import { MuiColorInput, matchIsValidColor } from "mui-color-input"
import { useState } from "react"
import { useForm, Controller } from 'react-hook-form'
import { LoadingButton } from '@mui/lab'
import axios, { isAxiosError } from "axios"
import { useAuth } from "@/providers/AuthProvider"
import { AutorizacionConVehiculo } from "@/types"

interface DialogoVehiculoProps {
    esNuevo: boolean
    vehiculo?: Vehiculo

    open: boolean
    handleClose: () => void

    onNewAutorizacion: () => void
}

interface FormProps {
    matricula: string
    marca: string
    modelo: string
    agno: string
    color: string
}

export default function DialogoVehiculo({esNuevo, vehiculo, open, handleClose, onNewAutorizacion}:DialogoVehiculoProps){
    const { currentUser } = useAuth()    
    const [loading, setLoading] = useState(false)

    const { register, handleSubmit, formState:{errors}, control, reset} = useForm<FormProps>({
        defaultValues: {
            matricula: vehiculo?.matricula,
            marca: vehiculo?.marca,
            modelo: vehiculo?.modelo,
            agno: vehiculo?.agno,
            color: vehiculo?.color
        }
    })

    if(!currentUser) return null

    const onSubmit = handleSubmit(async data => {
        setLoading(true)

        try{
            await axios.post<AutorizacionConVehiculo>('/api/vehiculos', {...data, usuarioId: currentUser.id})
            reset()

            onNewAutorizacion()
        }
        catch(err){
            if(isAxiosError(err)){
                console.log(err)
            }
        }

        setLoading(false)
        handleClose()
    })

    return (
        <Dialog onClose={handleClose} open={open}>
            <DialogTitle>
                {esNuevo ? 'Agregar nuevo vehículo' : 'Editar vehículo'}
            </DialogTitle>
            <form onSubmit={onSubmit}>
                <DialogContent>
                    <TextField 
                        {...register('matricula', {required: true, pattern: /^[A-Z]{3}[0-9]{4}$/})} 
                        label="Matrícula del Vehículo"
                        error={!!errors.matricula}
                        helperText={errors.matricula && 'Ingrese una matrícula válida (AAA0000)'}
                        sx={{marginBottom: 2}}
                        fullWidth
                    />

                    <TextField 
                        {...register('marca', {required: true})}
                        label="Marca del Vehículo"
                        error={!!errors.marca}
                        helperText={errors.marca && 'Ingrese la marca del vehículo'}
                        sx={{marginBottom: 2}}
                        fullWidth
                    />

                    <TextField
                        {...register('modelo', {required: true})}
                        label="Modelo del Vehículo"
                        error={!!errors.modelo}
                        helperText={errors.modelo && 'Ingrese el modelo del vehículo'}
                        sx={{marginBottom: 2}}
                        fullWidth
                    />

                    <TextField
                        {...register('agno', {required: true, pattern:/^\d{4}$/})}
                        label="Año del Vehículo"
                        error={!!errors.agno}
                        helperText={errors.agno && 'Ingrese un año válido de 4 digitos'}
                        sx={{marginBottom: 2}}
                        fullWidth
                    />

                    <Controller
                        name="color"
                        control={control}
                        rules={{ validate: matchIsValidColor }}
                        render={({ field, fieldState }) => (
                          <MuiColorInput
                                {...field}
                                format="hex"
                                helperText={fieldState.invalid ? "Seleccione un color válido" : ""}
                                error={fieldState.invalid}
                                label="Color del Vehículo"
                                fullWidth
                          />
                        )}
                    />
                </DialogContent>
                <DialogActions>
                    <LoadingButton 
                        type="submit" 
                        loading={loading} 
                        loadingIndicator="Creando..."
                    >
                        Crear
                    </LoadingButton>
                </DialogActions>
            </form>
        </Dialog>
    )
}
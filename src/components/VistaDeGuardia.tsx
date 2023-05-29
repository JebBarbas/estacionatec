import useGet from "@/hooks/useGet";
import { Autocomplete, Grid, InputLabel, TextField, Typography } from "@mui/material";
import type { Cajon, Estacionamiento } from "@prisma/client";
import { useState } from "react";
import CuadroCajones from "./CuadroCajones";
import { LoadingButton } from "@mui/lab";
import axios, { isAxiosError } from "axios";
import { useForm } from 'react-hook-form'
import { CajonCompleto, EntradaConCajon, EstacionamientoCompleto } from "@/types";

interface EntradaFormData {
    control: string
    matricula: string
}

interface Verificacion {
    message: string
    valid: boolean
    autorizacionId?: string
}

export default function VistaDeGuardia(){
    const [estacionamientos] = useGet<Estacionamiento[]>('/api/estacionamientos', [])
    const [estacionamientoSeleccionado, setEstacionamientoSeleccionado] = useState<Estacionamiento|null>(null)
    const [loading, setLoading] = useState(false)

    const [cajones, setCajones] = useState<CajonCompleto[]>([]) 

    const { register, handleSubmit, formState:{errors}, reset} = useForm<EntradaFormData>()
    
    const actualizarEstacionamiento = (nuevoEstacionamiento: Estacionamiento|null) => {
        setEstacionamientoSeleccionado(nuevoEstacionamiento)
        cargarCajones(nuevoEstacionamiento)
    }

    const cargarCajones = async (estacionamientoACargar: Estacionamiento|null) => {
        if(!estacionamientoACargar) return

        try{
            setLoading(true)

            const res = await axios.get<EstacionamientoCompleto>(`/api/cajones/estacionamiento/${estacionamientoACargar.slug}`)

            setCajones(res.data.cajones)
        }
        catch{

        }
        finally{
            setLoading(false)
        }
    }

    const onSubmit = handleSubmit(async data => {
        try{
            setLoading(true)

            const res = await axios.post<Verificacion>('/api/verificar-datos', data)
            if(res.data.valid && res.data.autorizacionId && estacionamientoSeleccionado){
                const nuevaEntrada = await axios.post<EntradaConCajon|null>('/api/entrar-o-salir', {
                    idAutorizacion: res.data.autorizacionId,
                    idEstacionamiento: estacionamientoSeleccionado.id
                })

                if(nuevaEntrada.data){
                    console.log(nuevaEntrada.data)
                    console.log('Tu lugar es:', nuevaEntrada.data.cajon.etiqueta)
                }
                else{
                    console.log('buen viaje')
                }

                await cargarCajones(estacionamientoSeleccionado)
                reset()
            }
        }
        catch(err){
            if(isAxiosError(err)){
                console.log(err.response?.data.message ?? '')
            }
        }
        finally{
            setLoading(false)
        }
    })

    return (
        <>
            <Typography variant="h6">
                Vista de Guardia 
            </Typography>

            <Typography sx={{marginBottom: 2, textAlign: 'justify'}}>
                Desde aquí puede ver todos los ingresos que han sucedido en cada
                estacionamiento el día de hoy, así como ver los espacios disponibles y 
                que usuario está ocupando el espacio.
            </Typography>

            <Typography variant="subtitle2" sx={{marginBottom:2}}>
                Selecciona un estacionamiento para empezar
            </Typography>

            <Autocomplete
                value={estacionamientoSeleccionado}
                onChange={(_, newEstacionamiento) => {
                    actualizarEstacionamiento(newEstacionamiento)
                }}
                getOptionLabel={option => option.nombre}
                options={estacionamientos}
                renderInput={(params) => <TextField {...params} label="Estacionamiento"/>}
                fullWidth
                sx={{marginBottom: 2}}
            />
            {
                estacionamientoSeleccionado && (
                    <Grid container spacing={2}>
                        <Grid item xs={4}>
                            <Typography variant="subtitle2" sx={{marginBottom: 2}}>
                                Entradas de hoy
                            </Typography>

                            <Typography variant="body1" sx={{marginBottom: 2}}>
                                En caso de no tener el lector QR, ingrese los datos manualmente.
                            </Typography>

                            <form onSubmit={onSubmit}> 
                                <TextField
                                    {...register('control', {required: true})}
                                    label="Número de Control"
                                    error={!!errors.control}
                                    helperText={errors.control && 'Ingrese el número de control'}
                                    fullWidth
                                    sx={{marginBottom: 2}}
                                />

                                <TextField
                                    {...register('matricula', {required: true, pattern: /^[A-Z]{3}[0-9]{4}$/})}
                                    label="Matrícula del Vehículo"
                                    error={!!errors.matricula}
                                    helperText={errors.matricula && 'Ingrese una matrícula válida (AAA0000)'}
                                    fullWidth
                                    sx={{marginBottom: 2}}
                                />

                                <LoadingButton
                                    type="submit"
                                    variant="contained"
                                    fullWidth
                                >
                                    ENTRAR/SALIR
                                </LoadingButton>
                            </form>
                        </Grid>
                        <Grid item xs={8}>
                            <Typography variant="subtitle2" sx={{marginBottom: 2}}>
                                Espacios Disponibles
                            </Typography>
                            {
                                !!estacionamientoSeleccionado && (
                                    <CuadroCajones
                                        modoGuardia
                                        loading={loading}
                                        cajones={cajones}
                                        patron={estacionamientoSeleccionado.patron}
                                    />
                                )
                            }
                        </Grid>
                    </Grid>
                )
            }
        </>
    )
}
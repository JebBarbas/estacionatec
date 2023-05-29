import { FC, useState } from "react";
import { Box, Tooltip, useTheme } from '@mui/material'
import traducirPatron from "@/functions/traducirPatron";
import { CajonCompleto } from "@/types";
import DialogoCajon from "./DialogoCajon";

interface CuadroCajonesProps {
    loading?: boolean
    cajones?: CajonCompleto[]
    patron: string
    modoGuardia?: boolean
}


const CuadroCajones:FC<CuadroCajonesProps> = ({patron, cajones, loading, modoGuardia}) => {
    const [dialogOpen, setDialogOpen] = useState(false)
    const [cajonAbierto, setCajonAbierto] = useState<CajonCompleto|null>(null)
    
    const abrirCajon = (etiqueta: string) => {
        if(!cajones) return

        const cajon = cajones.find(c => c.etiqueta === etiqueta)
        if(!cajon) return 

        setCajonAbierto(cajon)
        setDialogOpen(true)
    }

    const handleClose = () => {
        setCajonAbierto(null)
        setDialogOpen(false)
    }

    const etiquetas = traducirPatron(patron)

    const { palette:{mode, background:{default:back}} } = useTheme()
    
    const color = (esCajon: boolean, disponible: boolean) => {
        if(!esCajon) return back

        const colores = {
            dark: {
                ocupado: '#F87171',
                disponible: '#4ADE80',
                cargando: '#E5E5E5'
            },

            light: {
                ocupado: '#EF4444',
                disponible: '#22C55E',
                cargando: '#A3A3A3'
            }
        }
        
        return colores[mode][loading ? 'cargando' : (disponible ? 'disponible' : 'ocupado')]
    }

    const randomDisponibility = () => [true, false][Math.floor(Math.random() * 2)]

    const cajonDisponible = (etiqueta: string) => {
        if(typeof cajones === 'undefined') return randomDisponibility()
        if(cajones.length === 0) return randomDisponibility()

        const cajon = cajones.find(cajon => cajon.etiqueta === etiqueta)

        return cajon?.disponible ?? false
    }

    return (
        <Box sx={{color: back, overflowX: 'auto'}}>
            {
                etiquetas.map((filaEtiquetas, index) => (
                    <Box key={index} sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        height: '3rem'
                    }}>
                        {
                            filaEtiquetas.map((etiqueta, index2) => 
                            etiqueta !== '' && modoGuardia ? (
                                <Tooltip 
                                    key={index2} 
                                    title={`Ver Información de ${etiqueta}`} 
                                    placement="right"
                                >
                                    <Box 
                                        sx={{
                                            background: color(true, cajonDisponible(etiqueta)),
                                            flex: '0 0 3rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            textAlign: 'center',
                                            '&:hover': {
                                                cursor: 'pointer',
                                                transform: 'scale(1.2)'
                                            }
                                        }}
                                        onClick={() => abrirCajon(etiqueta)}
                                    >
                                        {etiqueta}
                                    </Box>
                                </Tooltip>
                            ) : (
                                <Box key={index2} sx={{
                                    background: color(etiqueta !== '', cajonDisponible(etiqueta)),
                                    flex: '0 0 3rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    textAlign: 'center',
                                }}>
                                    {etiqueta}
                                </Box>
                            ))
                        }
                    </Box>
                ))
            }

            <DialogoCajon handleClose={handleClose} open={dialogOpen} cajon={cajonAbierto}/>
        </Box>
    )
}

export default CuadroCajones
import { FC } from "react";
import { Box, useTheme } from '@mui/material'
import traducirPatron from "@/functions/traducirPatron";
import type { Cajon } from "@prisma/client";

interface CuadroCajonesProps {
    loading?: boolean
    cajones?: Cajon[]
    patron: string
}


const CuadroCajones:FC<CuadroCajonesProps> = ({patron, cajones, loading}) => {
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
        <Box sx={{color: back, overflowX: 'auto', width: '100%', marginX: 'auto'}}>
            {
                etiquetas.map((filaEtiquetas, index) => (
                    <Box key={index} sx={{
                        display: 'flex',
                        height: '3rem'
                    }}>
                        {
                            filaEtiquetas.map((etiqueta, index2) => (
                                <Box key={index2} sx={{
                                    background: color(etiqueta !== '', cajonDisponible(etiqueta)),
                                    flex: '0 0 3rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    textAlign: 'center'
                                }}>
                                    {etiqueta}
                                </Box>
                            ))
                        }
                    </Box>
                ))
            }
        </Box>
    )
}

export default CuadroCajones
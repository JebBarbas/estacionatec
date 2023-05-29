import axios, { isAxiosError } from 'axios'
import Layout, { Container } from "@/components/Layout";
import CuadroCajones from "@/components/CuadroCajones";
import { useCallback, useEffect, useState } from "react";
import { EstacionamientoCompleto } from "@/types";
import { useRouter } from "next/router";
import { Typography } from '@mui/material';
import { handleAxiosError } from '@/utils/Snackbar';

export default function Cajones(){
    const [estacionamiento, setEstacionamiento] = useState<EstacionamientoCompleto|null>(null)
    const { query:{slug} } = useRouter()

    const cargarEstacionamiento = useCallback(async () => {
        try {
            const res = await axios.get<EstacionamientoCompleto|null>(`/api/cajones/estacionamiento/${slug}`)
            setEstacionamiento(res.data)
        }
        catch(err) {
            handleAxiosError(err)
        }
    }, [slug])

    useEffect(() => {
        cargarEstacionamiento()
    }, [cargarEstacionamiento])

    return (
        <Layout title="Lugares" description="Mira la disponibilidad de lugares de estacionamiento">
            <Container>
                <Typography variant="h6">
                    Espacios Disponibles
                </Typography>

                <Typography sx={{marginBottom: 2, textAlign: 'justify'}}>
                    Visualiza los espacios disponibles en el estacionamiento de tu preferencia
                    antes de llegar.
                </Typography>
                {
                    estacionamiento && (
                        <CuadroCajones
                            patron={estacionamiento.patron}
                            cajones={estacionamiento.cajones}
                        />
                    )
                }
            </Container>
        </Layout>
        
    )
}
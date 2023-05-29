import Layout, { Container } from "@/components/Layout";
import ListaVehiculos from "@/components/ListaVehiculos";
import { useAuth } from "@/providers/AuthProvider";
import { AutorizacionConVehiculo } from "@/types";
import { Box, Button, Typography } from "@mui/material";
import axios, { isAxiosError } from "axios";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

export default function Perfil(){
    const [autorizaciones, setAutorizaciones] = useState<AutorizacionConVehiculo[]>([])
    const { currentUser } = useAuth()
    const { push } = useRouter()

    const cargarAutorizaciones = useCallback(async () => {
        try {
            const res = await axios.get<AutorizacionConVehiculo[]>(`/api/autorizaciones/usuario/${currentUser?.id}`)

            setAutorizaciones(res.data)
        }
        catch(err){
            if(isAxiosError(err)){
                console.log(err)
            }
        }
    }, [currentUser])

    const gotoLogout = () => push('/auth/logout')

    useEffect(() => {
        cargarAutorizaciones()
    }, [cargarAutorizaciones])

    if(!currentUser) return
    return (
        <Layout title="Mi Perfil" description="Mira y edita tu perfil">
            <Container>
                <Typography variant="h6">
                    Mi Perfil
                </Typography>
                <Typography sx={{marginBottom: 2, textAlign: 'justify'}}>
                    Administra tu perfil, así como los vehículos con los que tú y tus 
                    personas de confianza podrán acceder a las instalaciones.
                </Typography>

                <Box sx={{marginBottom: 2}}>
                    <ListaVehiculos
                        autorizaciones={autorizaciones}
                        onNewAutorizacion={cargarAutorizaciones}
                    />
                </Box>

                <Button variant="contained" onClick={gotoLogout}>
                    Cerrar Sesión
                </Button>
            </Container>
        </Layout>
    )
}
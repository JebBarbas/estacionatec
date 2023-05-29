import ListaEstacionamientos from "@/components/ListaEstacionamientos";
import Layout, { Container } from "@/components/Layout";
import { server } from "@/utils/config";
import axios from "axios";
import { GetServerSideProps } from "next";
import { Typography } from '@mui/material'
import { Estacionamiento } from "@prisma/client";
import { useEffect, useState } from "react";

export default function Estacionamientos(){
    const [estacionamientos, setEstacionamientos] = useState<Estacionamiento[]>([])
    
    const cargarEstacionamientos = async () => {
        try{
            const res = await axios.get<Estacionamiento[]>('/api/estacionamientos')
            setEstacionamientos(res.data)
        }
        catch{

        }
    }

    useEffect(() => {
        cargarEstacionamientos()
    }, [])

    return (
        <Layout
            title="Estacionamientos"
            description="Busca entre los estacionamientos disponibles"
        >
            <Container>
                <Typography variant="h6">
                    Estacionamientos
                </Typography>
                <Typography sx={{marginBottom: 2, textAlign: 'justify'}}>
                    Presiona un estacionamiento para ver la disponibilidad de espacio en este.
                </Typography>
                <ListaEstacionamientos estacionamientos={estacionamientos}/>
            </Container>
        </Layout>
    )
}
import { GetServerSideProps } from "next";
import axios from 'axios'
import { server } from "@/utils/config";
import Layout, { Container } from "@/components/Layout";
import CuadroCajones from "@/components/CuadroCajones";
import { Cajon, Estacionamiento } from "@prisma/client";

interface CajonesProps {
    estacionamiento: Estacionamiento
    cajones: Cajon[]
}

export default function Cajones({estacionamiento, cajones}:CajonesProps){
    return (
        <Layout title="Lugares" description="Mira la disponibilidad de lugares de estacionamiento">
            <Container>   
                <CuadroCajones
                    patron={estacionamiento.patron}
                    cajones={cajones}
                />
                {/* {
                    cajones.length > 0 ? <CuadroCajones cajones={cajones}/> : 
                    (
                        <>
                            No hay cajones
                        </>
                    )
                } */}
            </Container>
        </Layout>
        
    )
}

export const getServerSideProps: GetServerSideProps<CajonesProps> = async ctx => {
    try{
        const {query:{slug}} = ctx

        const estacionamiento = await axios.get<Estacionamiento>(
            `${server}/api/estacionamientos/${slug}`
        )

        if(!estacionamiento) return {
            notFound: true
        }

        const cajones = await axios.get<Cajon[]>(`${server}/api/cajones/estacionamiento/${slug}`)

        return {
            props: {
                cajones: cajones.data,
                estacionamiento: estacionamiento.data
            }
        }
    }
    catch(err){
        if(axios.isAxiosError(err)){
            console.log('error: ', err.message)
        }

        return { 
            notFound: true
        }
    }
}
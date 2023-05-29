import str from "@/utils/str";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from '@/utils/prismadb'

export default async function index(req: NextApiRequest, res: NextApiResponse){
    const { method, query } = req
    const slug = str(query.slug)
    
    switch(method){
        case 'GET':
            try{
                const estacionamiento = await prisma.estacionamiento.findUnique({
                    where: {
                        slug
                    }
                })

                if(!estacionamiento) return res.status(404).json([])

                const cajones = await prisma.cajon.findMany({
                    where: {
                        estacionamientoId: estacionamiento.id
                    }
                })

                return res.status(200).json(cajones)
            }
            catch(err){
                return res.status(500).json({message: err})
            }

        default:
            return res.status(400).json({message: 'Método no disponible'})

    }
}
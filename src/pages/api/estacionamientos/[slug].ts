import str from "@/utils/str";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from '@/utils/prismadb'

export default async function index(req: NextApiRequest, res: NextApiResponse){
    const { method, body, query } = req
    const slug = str(query.slug)

    switch(method){
        case 'GET':
            try{
                const estacionamiento = await prisma.estacionamiento.findUnique({
                    where: {
                        slug
                    }
                })

                if(!estacionamiento) return res.status(404).json(null)

                return res.status(200).json(estacionamiento)
            }
            catch(err){
                return res.status(500).json({message: err})
            }
        case 'PUT':
            try{
                const { nombre, imagen, patron } = body

                const estacionamiento = await prisma.estacionamiento.update({
                    where: {
                        slug
                    },
                    data: {
                        nombre, imagen, patron
                    }
                })                

                return res.status(200).json(estacionamiento)
            }
            catch(err){
                return res.status(500).json({message: err})
            }
        case 'DELETE':
            try{
                await prisma.estacionamiento.delete({
                    where: {
                        slug
                    }
                })

                return res.status(204).end()
            }
            catch(err){
                return res.status(500).json({message: err})
            }

        default:
            return res.status(400).json({message: 'Método no disponible'})
    }
}
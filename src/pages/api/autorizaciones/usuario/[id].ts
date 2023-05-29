import str from "@/utils/str";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from '@/utils/prismadb'

export default async function index(req: NextApiRequest, res: NextApiResponse){
    const { method, body, query } = req
    const id = str(query.id)

    switch(method){
        case 'GET':
            try{
                const autorizaciones = await prisma.autorizacion.findMany({
                    where: {
                        usuarioId: id
                    },
                    include: {
                        vehiculo: true
                    }
                })

                return res.status(200).json(autorizaciones)
            }
            catch(err){
                return res.status(500).json({message: err})
            }
            
        // case 'PUT':
        //     try{
        //         const { nombre, imagen, patron } = body

        //         const estacionamiento = await prisma.estacionamiento.update({
        //             where: {
        //                 slug: id
        //             },
        //             data: {
        //                 nombre, imagen, patron
        //             }
        //         })                

        //         return res.status(200).json(estacionamiento)
        //     }
        //     catch(err){
        //         return res.status(500).json({message: err})
        //     }
        // case 'DELETE':
        //     try{
        //         await prisma.estacionamiento.delete({
        //             where: {
        //                 slug: id
        //             }
        //         })

        //         return res.status(204).end()
        //     }
        //     catch(err){
        //         return res.status(500).json({message: err})
        //     }

        default:
            return res.status(400).json({message: 'Método no disponible'})
    }
}
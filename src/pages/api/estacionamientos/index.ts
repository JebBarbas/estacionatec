import crearCajones from '@/functions/crearCajones';
import { NextApiRequest, NextApiResponse } from "next";
import prisma from '@/utils/prismadb'

export default async function index(req: NextApiRequest, res: NextApiResponse){
    const { method, body } = req
    
    switch(method){
        case 'GET':
            try{
                const estacionamientos = await prisma.estacionamiento.findMany() 

                return res.status(200).json(estacionamientos)
            }
            catch(err){
                return res.status(500).json({message: err})
            }

        case 'POST':
            try{
                const { imagen, nombre, patron, slug } = body 

                const estacionamiento = await prisma.estacionamiento.create({
                    data: {
                        imagen, nombre, patron, slug,
                        cajones: {
                            createMany: {
                                data: crearCajones(patron)
                            }
                        }
                    }
                })

                return res.status(201).json(estacionamiento)
            }
            catch(err){
                return res.status(500).json({message: err})
            }
        
        default:
            return res.status(400).json({message: 'Método no disponible'})

    }
}
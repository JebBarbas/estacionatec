import { NextApiRequest, NextApiResponse } from "next";
import prisma from '@/utils/prismadb'
import str from "@/utils/str";

export default async function index(req: NextApiRequest, res: NextApiResponse){
    const { method, body, query } = req
    const id = str(query.id)

    switch(method){
        case 'PUT':
            try{
                const {
                    matricula, marca, modelo, agno, color,
                } = body

                const vehiculo = await prisma.vehiculo.update({
                    where: {
                        id
                    },
                    data: {
                        matricula, marca, modelo, agno, color,
                    },
                })

                return res.status(201).json(vehiculo)
            }
            catch(err){
                return res.status(500).json({message: err})
            }

        case 'DELETE':
            try{
                await prisma.vehiculo.delete({
                    where: {
                        id
                    },
                })

                return res.status(201).json({})
            }
            catch(err){
                return res.status(500).json({message: err})
            }

        default:
            return res.status(400).json({message: 'Método no disponible'})

    }
}
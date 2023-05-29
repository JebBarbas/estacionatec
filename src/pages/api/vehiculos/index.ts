import { NextApiRequest, NextApiResponse } from "next";
import prisma from '@/utils/prismadb'

export default async function index(req: NextApiRequest, res: NextApiResponse){
    const { method, body } = req
    
    switch(method){
        case 'POST':
            try{
                const {
                    matricula, marca, modelo, agno, color,
                    usuarioId
                } = body

                const usuario = await prisma.usuario.findUnique({
                    where: { id: usuarioId }
                })

                if(!usuario) return res.status(404).json(null)

                const vehiculo = await prisma.vehiculo.create({
                    data: {
                        matricula, marca, modelo, agno, color,
                        propietarioId: usuario.id
                    },
                })

                const autorizacion = await prisma.autorizacion.create({
                    data: {
                        activa: true,
                        usuarioId: usuario.id,
                        vehiculoId: vehiculo.id,    
                    },
                    include: {
                        vehiculo: true
                    }
                })

                return res.status(201).json(autorizacion)
            }
            catch(err){
                return res.status(500).json({message: err})
            }
        

        default:
            return res.status(400).json({message: 'Método no disponible'})

    }
}
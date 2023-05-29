import { NextApiRequest, NextApiResponse } from "next";
import prisma from '@/utils/prismadb'

export default async function index(req: NextApiRequest, res: NextApiResponse){
    const { method, body } = req

    switch(method){
        case 'POST':
            try{
                const { idAutorizacion, idEstacionamiento } = body

                const entrada = await prisma.entrada.findFirst({
                    where: {
                        autorizacion: { id: idAutorizacion }
                    },
                    orderBy: {
                        fechaFin: 'desc'
                    },
                    include: {
                        cajon: true
                    }
                })

                if(!entrada || entrada.fechaFin){
                    // Si no hay entrada, o si la entrada tiene fecha de fin,
                    // significa que el usuario está afuera, osea crear una nueva
                    // con fecha de inicio
                    
                    // Busca cajones disponibles
                    const cajonDisponible = await prisma.cajon.findFirst({
                        where: {
                            estacionamiento: {
                                id: idEstacionamiento
                            },
                            disponible: true
                        },
                        orderBy: {
                            etiqueta: 'asc'
                        }
                    })

                    if(!cajonDisponible) return res.status(404).json({message: 'No hay lugares disponibles'})

                    // Se crea una nueva entrada, y se pone el cajon como no disponible

                    const nuevaEntrada = await prisma.entrada.create({
                        data: {
                            fechaInicio: new Date(),
                            autorizacionId: idAutorizacion,
                            cajonId: cajonDisponible.id
                        },
                        include: {
                            cajon: true
                        }
                    })

                    await prisma.cajon.update({
                        where: { id: cajonDisponible.id },
                        data: {
                            disponible: false
                        }
                    })

                    return res.status(200).json(nuevaEntrada)
                }
                else{
                    // Esta dentro, actualizar la entrada actual, poner fecha final
                    // y poner disponible el cajón
                    await prisma.entrada.update({
                        where: {id: entrada.id},
                        data: {
                            fechaFin: new Date()
                        }
                    })

                    await prisma.cajon.update({
                        where: {id: entrada.cajon.id},
                        data: {
                            disponible: true
                        }
                    })

                    return res.status(200).json(null)
                }
            }
            catch(err){
                return res.status(500).json({message: `${err}`, valid: false})
            }

        default: return res.status(405).json({message: 'Método no disponible', valid: false})
    }
}
import { NextApiRequest, NextApiResponse } from "next";
import prisma from '@/utils/prismadb'

export default async function index(req: NextApiRequest, res: NextApiResponse){
    const { method, body } = req

    switch(method){
        case 'POST':
            try{
                const { control, matricula } = body

                const usuario = await prisma.usuario.findUnique({
                    where: { control }
                })

                if(!usuario) return res.status(404).json({message: 'El usuario no existe', valid: false})

                const vehiculo = await prisma.vehiculo.findUnique({
                    where: { matricula }
                })

                if(!vehiculo) return res.status(404).json({message: 'El vehículo no se encuentra registrado en el sistema', valid: false})

                const autorizacion = await prisma.autorizacion.findFirst({
                    where: {
                        usuario: {
                            control
                        },
                        vehiculo: {
                            matricula
                        }
                    }
                })

                if(!autorizacion) return res.status(403).json({message: 'El usuario no tiene autorización para ingresar/salir con este vehículo', valid: false})

                return res.status(200).json({message: 'Autorizado', valid: true, autorizacionId: autorizacion.id})
            }
            catch(err){
                return res.status(500).json({message: `${err}`, valid: false})
            }

        default: return res.status(405).json({message: 'Método no disponible', valid: false})
    }
}
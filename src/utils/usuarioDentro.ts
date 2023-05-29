import prisma from '@/utils/prismadb'

export default async function usuarioDentro(id: string){
    if(id === '') return [false, null]

    const ultimaEntrada = await prisma.entrada.findFirst({
        where: { autorizacion: { usuarioId: id}},
        orderBy: { fechaInicio: 'desc'},
        include: {
            autorizacion : {
                include: {
                    vehiculo: {
                        include: {
                            propietario: true
                        }
                    }
                }
            },
            cajon: {
                include: {
                    estacionamiento: true
                }
            }
        }
    })

    if(!ultimaEntrada) return [false, ultimaEntrada]

    // Si no hay fecha fin, si sigue adentro
    // de lo contrario, si

    return [!ultimaEntrada.fechaFin, ultimaEntrada]
}
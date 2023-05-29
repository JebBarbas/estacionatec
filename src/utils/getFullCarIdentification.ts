import type { Vehiculo } from "@prisma/client";

export default function getFullCarIdentification(car:Vehiculo){
    const {matricula, marca, modelo, agno} = car
    return `${marca} ${modelo} ${agno} (${matricula})`
}
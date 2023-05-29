import type { Usuario } from "@prisma/client";

export default function getFullName(usuario: Usuario){
    const {nombre, apellidoPaterno, apellidoMaterno, control } = usuario
    return `${nombre} ${apellidoPaterno} ${apellidoMaterno} (${control})`
}
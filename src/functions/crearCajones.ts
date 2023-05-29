import traducirPatron from "./traducirPatron";

interface ICajon {
    disponible: boolean,
    etiqueta: string
}

export default function crearCajones(patron: string){
    const cajones:ICajon[] = traducirPatron(patron).flat(1).map(etiqueta => ({
        etiqueta,
        disponible: true
    })).filter(cajon => cajon.etiqueta !== '')

    return cajones
}
function obtenerLetraDeFila(numFila: number){
    const ascii = numFila + 64
    return String.fromCharCode(ascii)
}

export default function traducirPatron(patron: string){    
    let filaActual = 1
    const cajones = patron.split('\n').map(fila => {
        if(fila === '') return ['']

        let columnaActual = 1
        const cajonesDeFila = fila.split('').map(char => {
            if(char !== '1') return ''
            return `${obtenerLetraDeFila(filaActual)}${columnaActual++}`
        })

        filaActual++
        return cajonesDeFila
    })

    return cajones
}
import { isAxiosError } from 'axios'
import { enqueueSnackbar } from 'notistack'

export interface PrismaCodes {
    P2002: string
}

export function handleAxiosError(err:any, codes?:PrismaCodes){
    if(isAxiosError(err)){
        // Hay mensaje personalizado
        if(err.response?.data.message){
            const { message } = err.response.data

            // Es error de prisma
            if(message.code){
                console.log(message)
                return errorSnackbar((codes && codes[message.code as keyof PrismaCodes]) ?? 'Error de integridad desconocido, verificar consola')
            }

            return errorSnackbar(err.response.data.message)
        }

        return errorSnackbar(`No hay conexión: ${err}`)
    }

    console.log(err)
    return errorSnackbar('Error desconocido, verificar consola')
}

export function errorSnackbar(message: string){
    enqueueSnackbar({message, variant: "error"})
}

export function successSnackbar(message: string){
    enqueueSnackbar({message, variant: "success"})
}
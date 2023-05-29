import { Dialog, DialogContent, DialogTitle, Typography} from "@mui/material"
import { CajonCompleto } from "@/types"
import getFullName from "@/utils/getFullName"
import getFullCarIdentification from "@/utils/getFullCarIdentification"

interface DialogoCajonProps {
    cajon: CajonCompleto | null

    open: boolean
    handleClose: () => void
}

export default function DialogoCajon({handleClose, open, cajon}:DialogoCajonProps){
    if(!cajon) return null
    const actualEntrada = cajon.entradas[0]

    return (
        <Dialog onClose={handleClose} open={open}>
            <DialogTitle>
                Información del Cajón {cajon.etiqueta}
            </DialogTitle>
            <DialogContent>
                {
                    cajon.disponible ? (
                        <Typography>
                            Este cajón está sin ocupar, nada interesante.
                        </Typography>
                    ) : (
                        actualEntrada && <>
                            <Typography>
                                Hora de Entrada: {new Date(actualEntrada.fechaInicio).toLocaleDateString('es-mx')} {new Date(actualEntrada.fechaInicio).toLocaleTimeString('es-mx')}
                            </Typography>
                            <Typography>
                                Usuario: {getFullName(actualEntrada.autorizacion.usuario)}
                            </Typography>
                            <Typography>
                                Vehículo: {getFullCarIdentification(actualEntrada.autorizacion.vehiculo)}
                            </Typography>
                        </>
                    )
                }
            </DialogContent>
        </Dialog>
    )
}
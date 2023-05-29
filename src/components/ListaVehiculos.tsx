import { useAuth } from "@/providers/AuthProvider";
import { AutorizacionConVehiculo } from "@/types";
import groupArray from "@/utils/groupArray";
import { faCarSide, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, ListSubheader, Typography, getLuminance } from "@mui/material";
import type { Vehiculo } from "@prisma/client";
import { useState } from "react";
import DialogoVehiculo from "./DialogoVehiculo";

interface ListaVehiculosProps {
    autorizaciones: AutorizacionConVehiculo[]
    onNewAutorizacion: () => void
}

const getContrastColor = (color:string) => getLuminance(color) >= 0.5 ? '#222222' : '#eeeeee'

export default function ListaVehiculos({autorizaciones, onNewAutorizacion}:ListaVehiculosProps){
    const { currentUser } = useAuth()

    const [dialogOpen, setDialogOpen] = useState(false)
    const [dialogVehicle, setDialogVehicle] = useState<Vehiculo|undefined>()
    const [dialogIsNew, setDialogIsNew] = useState(true)

    if(!currentUser) return null

    const handleClose = () => setDialogOpen(false)
    const openDialog = (vehiculo?: Vehiculo) => {
        setDialogVehicle(vehiculo)
        setDialogIsNew(typeof vehiculo === 'undefined')
        setDialogOpen(true)
    }
    
    const autorizacionesAgrupadas = groupArray(autorizaciones, 
        autorizacion => autorizacion.usuarioId === currentUser.id ? 'propios' : 'autorizados'
    )
    
    return (
        <>
            <Typography variant="h6">
                Mis Vehículos
            </Typography>

            <DialogoVehiculo
                esNuevo={dialogIsNew}
                handleClose={handleClose}
                open={dialogOpen}
                vehiculo={dialogVehicle}
                onNewAutorizacion={onNewAutorizacion}
            />

            <List        
                subheader={
                    <ListSubheader component="div" disableGutters>
                        Vehículos Propios
                    </ListSubheader>
                }
            >
                <ListItemButton onClick={() => openDialog()}>
                    <ListItemAvatar>
                        <Avatar>
                            <FontAwesomeIcon icon={faPlus}/>
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                        primary="Añadir Vehículo"
                    />
                </ListItemButton>
                {
                    autorizacionesAgrupadas.propios?.length && autorizacionesAgrupadas.propios.map(({id, vehiculo}) => (
                        <ListItemButton key={id} onClick={() => openDialog(vehiculo)}>
                            <ListItemAvatar>
                                <Avatar sx={{background: getContrastColor(vehiculo.color)}}>
                                    <FontAwesomeIcon icon={faCarSide} color={vehiculo.color}/>
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={`${vehiculo.marca} ${vehiculo.modelo} ${vehiculo.agno}`}
                                secondary={vehiculo.matricula}
                            />
                        </ListItemButton>
                    ))
                }
                    
            </List>

            <List        
                subheader={
                    <ListSubheader component="div" disableGutters>
                        Vehículos Autorizados
                    </ListSubheader>
                }
            >
                {
                    autorizacionesAgrupadas.autorizados?.length ? autorizacionesAgrupadas.autorizados.map(({id, vehiculo}) => (
                        <ListItem key={id}>
                            <ListItemAvatar>
                                <Avatar sx={{background: getContrastColor(vehiculo.color)}}>
                                    <FontAwesomeIcon icon={faCarSide} color={vehiculo.color}/>
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={`${vehiculo.marca} ${vehiculo.modelo} ${vehiculo.agno}`}
                                secondary={vehiculo.matricula}
                            />
                        </ListItem>
                    ))
                    : (
                        <Typography>No tienes vehículos autorizados</Typography>
                    )
                }
            </List>
        </>
    )
}
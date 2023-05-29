import type { Autorizacion, Cajon, Entrada, Estacionamiento, Rol, Usuario, Vehiculo } from "@prisma/client";
import { FC, ReactNode } from "react";

export type PC<P = {}> = FC<{children: ReactNode} & P>

export type UsuarioConRol = Usuario & {rol: Rol}
export type AutorizacionConVehiculo = Autorizacion & {vehiculo: Vehiculo}
export type EntradaConCajon = Entrada & {cajon: Cajon}
export type EntradaCompleta = Entrada & {
    cajon: Cajon & {
        estacionamiento: Estacionamiento
    }
    autorizacion: Autorizacion & {  
        vehiculo: Vehiculo & {
            propietario: Usuario
        }
    }
}
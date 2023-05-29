import { NextApiRequest, NextApiResponse } from "next";
import prisma from '@/utils/prismadb'
import crearCajones from "@/functions/crearCajones";

interface RawEstacionamiento {
    imagen: string, 
    nombre: string, 
    patron: string, 
    slug: string,
}

interface RawRol {
    nombre: string,
    permisosAdmin: boolean,
    permisosGuardia: boolean,
    permisosPremium: boolean
}

const estacionamientos: RawEstacionamiento[] = [
    {
        imagen: 'estudiantes', 
        nombre: 'Estudiantes', 
        patron: "10111111111101\n10000000000001\n10111111111101\n10111111111100\n10000000000000\n10111111111101\n10111111111101\n00000000000001\n00111100111100", 
        slug: 'estudiantes',
    },
    {
        imagen: 'maestros',
        nombre: 'Maestros',
        patron: "101101101\n101101101\n101101101\n101101101\n101101101\n000000000\n111111111",
        slug: 'maestros'
    },
    {
        imagen: 'personal',
        nombre: 'Personal y Estudiantes',
        patron: "1001111",
        slug: 'personal-y-estudiantes'
    }
]

const roles: RawRol[] = [
    {
        nombre: 'Usuario',
        permisosAdmin: false,
        permisosGuardia: false,
        permisosPremium: false
    },
    {
        nombre: 'Usuario Premium',
        permisosAdmin: false,
        permisosGuardia: false,
        permisosPremium: true
    },
    {
        nombre: 'Administrador',
        permisosAdmin: true,
        permisosGuardia: false,
        permisosPremium: false
    },
    {
        nombre: 'Guardia',
        permisosAdmin: false,
        permisosGuardia: true,
        permisosPremium: false
    },
    {
        nombre: 'Swiftie',
        permisosAdmin: true,
        permisosGuardia: true,
        permisosPremium: true
    },
]

export default async function index(req: NextApiRequest, res: NextApiResponse){
    try{
        if(req.method !== 'POST') return res.status(405).json({message: 'Metodo incorrecto'})

        if(process.env.NODE_ENV !== 'development') return res.status(403).json({message: 'Esto solo se puede hacer en el modo de desarrollo'})

        const { secret } = req.body
        if(secret !== process.env.JWT_SECRET) return res.status(403).json({message: `Secreto incorrecto, el correcto es "${process.env.JWT_SECRET}" y uste mandó "${secret}"`})

        for(const estacionamiento of estacionamientos){
            await prisma.estacionamiento.create({
                data: {
                    imagen: estacionamiento.imagen, 
                    nombre: estacionamiento.nombre, 
                    patron: estacionamiento.patron, 
                    slug: estacionamiento.slug,
                    
                    cajones: {
                        createMany: {
                            data: crearCajones(estacionamiento.patron)
                        }
                    } 
                }
            })
        }

        for(const rol of roles){
            await prisma.rol.create({
                data: {
                    nombre: rol.nombre,
                    permisosAdmin: rol.permisosAdmin,
                    permisosGuardia: rol.permisosGuardia,
                    permisosPremium: rol.permisosPremium
                }
            })
        }

        return res.status(200).json({message: 'Base de datos inicializada'})
    }
    catch{
        return res.status(500).json({message: 'Error inicializando la base de datos:('})
    }
}
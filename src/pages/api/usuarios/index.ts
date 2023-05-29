import { NextApiRequest, NextApiResponse } from "next";
import { hash } from "@/utils/password";
import prisma from '@/utils/prismadb'
import { sign } from "jsonwebtoken";
import { serialize } from "cookie";

export default async function index(req: NextApiRequest, res: NextApiResponse){
    const { method, body } = req
    
    switch(method){
        case 'POST':
            try{
                const nombreRolUsuario = 'Usuario'

                let rolDeUsuario = await prisma.rol.findFirst({
                    where: { nombre: nombreRolUsuario }
                })

                if(!rolDeUsuario) return res.status(404).json({message: 'No hay roles'})

                const {
                    email, control, password,
                    apellidoPaterno, apellidoMaterno, nombre,
                    telefono
                } = body
                const hashedPassword = await hash(password)
                const usuario = await prisma.usuario.create({
                    data: {
                        email, control, password: hashedPassword,
                        apellidoPaterno, apellidoMaterno, nombre,
                        telefono,
                        rolId: rolDeUsuario.id 
                    },
                    include: {
                        rol: true
                    }
                })

                // expire in 30 days
                const token = sign({
                    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
                    id: usuario.id
                }, process.env.JWT_SECRET ?? 'secret')

                const serialized = serialize("loginToken", token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                    maxAge: 1000 * 60 * 60 * 24 * 30,
                    path: "/",
                })

                res.setHeader("Set-Cookie", serialized)
                return res.status(201).json(usuario)
            }
            catch(err){
                return res.status(500).json({message: err})
            }
        

        default:
            return res.status(400).json({message: 'Método no disponible'})

    }
}
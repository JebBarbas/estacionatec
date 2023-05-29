import { NextApiRequest, NextApiResponse } from "next";
import { compare } from "@/utils/password";
import prisma from '@/utils/prismadb'
import { sign } from 'jsonwebtoken'
import { serialize } from 'cookie'

export default async function index(req: NextApiRequest, res: NextApiResponse){
    const { method, body } = req
    
    switch(method){
        case 'POST':
            try{
                const {
                    identification, plainPassword
                } = body

                const posibleUsuario = await prisma.usuario.findFirst({
                    where: {
                        OR: [
                            {
                                email: identification
                            },
                            {
                                control: identification
                            }
                        ]
                    },
                    include: {
                        rol: true
                    }
                })

                if(!posibleUsuario) return res.status(404).json({message: 'No se encontró ningún usuario con ese correo o número de control'})

                if(await compare(plainPassword, posibleUsuario.password)){
                    // expire in 30 days
                    const token = sign({
                        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
                        id: posibleUsuario.id
                    }, process.env.JWT_SECRET ?? 'secret')

                    const serialized = serialize("loginToken", token, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === "production",
                        sameSite: "strict",
                        maxAge: 1000 * 60 * 60 * 24 * 30,
                        path: "/",
                    })

                    res.setHeader("Set-Cookie", serialized)
                    return res.status(200).json(posibleUsuario)
                }
                
                return res.status(404).json({message: 'Contraseña incorrecta'})
            }
            catch(err){
                return res.status(500).json({message: err})
            }
        

        default:
            return res.status(405).json({message: 'Método no disponible'})

    }
}
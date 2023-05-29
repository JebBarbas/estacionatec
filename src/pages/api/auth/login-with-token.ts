import { NextApiRequest, NextApiResponse } from "next";
import { compare } from "@/utils/password";
import prisma from '@/utils/prismadb'
import { sign, verify } from 'jsonwebtoken'
import { serialize } from 'cookie'

export default async function index(req: NextApiRequest, res: NextApiResponse){
    const { method, cookies } = req
    
    switch(method){
        case 'GET':
            try{
                const { loginToken } = cookies

                if(!loginToken) return res.status(401).json(null)

                const data = verify(loginToken, process.env.JWT_SECRET ?? 'secret')

                if(typeof data === 'string') throw new Error('Esto no debería salir, chanfle') 

                const usuario = await prisma.usuario.findUnique({
                    where: {
                        id: data.id
                    },
                    include: {
                        rol: true
                    }
                })

                if(!usuario) return res.status(404).json(null)

                // Volver a establecer la id
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
                return res.status(200).json(usuario)
            }
            catch(err){
                return res.status(500).json({message: err})
            }
        
        default:
            return res.status(405).json({message: 'Método no disponible'})

    }
}
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
                // Quitar la cookie                
                const serialized = serialize("loginToken", '', {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                    maxAge: 0,
                    path: "/",
                })

                res.setHeader("Set-Cookie", serialized)
                return res.status(200).json({message: 'Logout'})
            }
            catch(err){
                console.log(err)
                return res.status(500).json({message: err})
            }
        
        default:
            return res.status(405).json({message: 'Método no disponible'})

    }
}
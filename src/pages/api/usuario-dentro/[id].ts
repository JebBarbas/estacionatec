import { NextApiRequest, NextApiResponse } from "next";
import prisma from '@/utils/prismadb'
import str from "@/utils/str";
import usuarioDentro from "@/utils/usuarioDentro";

export default async function index(req: NextApiRequest, res: NextApiResponse){
    const { method, query } = req
    const id = str(query.id)
    
    switch(method){
        case 'GET':
            try{
                const data = await usuarioDentro(id)
                return res.status(200).json(data)
            }
            catch(err){
                return res.status(500).json({message: err})
            }
        

        default:
            return res.status(400).json({message: 'Método no disponible'})

    }
}
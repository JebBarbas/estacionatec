import { PC, UsuarioConRol } from "@/types";
import { Rol, Usuario } from "@prisma/client";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

interface IAuthContext {
    currentUser: UsuarioConRol | null
    login: (identification: string, plainPassword: string) => Promise<void>
    logout: () => Promise<void>
    register: (email: string, control: string, password: string, nombre: string, apellidoPaterno: string, apellidoMaterno: string, telefono: string) => Promise<void>
}

const authContextDefaultValue:IAuthContext = {
    currentUser: null,
    async login(){},
    async logout() {},
    async register(email: string, control: string, password: string, nombre: string, apellidoPaterno: string, apellidoMaterno: string, telefono: string){}
}

const AuthContext = createContext(authContextDefaultValue)
export const useAuth = () => useContext(AuthContext)

const AuthProvider:PC = ({children}) => {
    const [currentUser, setCurrentUser] = useState<UsuarioConRol|null>(null)

    const register = async (email: string, control: string, password: string, nombre: string, apellidoPaterno: string, apellidoMaterno: string, telefono: string) => {
        try{
            const res = await axios.post<UsuarioConRol>('/api/usuarios', {
                email, control, password, nombre, apellidoPaterno, apellidoMaterno,
                telefono
            })

            setCurrentUser(res.data)
        }
        catch{

        }
    }

    const login = async (identification: string, plainPassword: string) => {
        try {
            const res = await axios.post<UsuarioConRol|null>('/api/auth/login-with-credentials', {identification, plainPassword})

            if(!res.data) return console.log('datos incorrectos chamaco')

            setCurrentUser(res.data)
        }
        catch {

        }
    }

    const logout = async () => {
        try {
            await axios.get('/api/auth/logout')
            setCurrentUser(null)
        }
        catch{

        }
    }

    const value:IAuthContext = {
        currentUser, register, login, logout
    }

    const tryLoginWithToken = async () => {
        try{
            const res = await axios.get<UsuarioConRol|null>('/api/auth/login-with-token')
            if(!res.data) return

            setCurrentUser(res.data)
        }
        catch{

        }
    }

    useEffect(() => {
        tryLoginWithToken()
    }, [])

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider
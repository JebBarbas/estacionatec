import SimpleContainer from "@/components/SimpleContainer";
import { useAuth } from "@/providers/AuthProvider";
import { Card, CardContent, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Logout(){
    const { logout } = useAuth()
    const { push } = useRouter()

    const handleLogout = async () => {
        try{
            await logout()
        }
        catch{

        }

        push('/auth/login')
    }

    useEffect(() => {
        handleLogout()
    }, [])

    return (
        <SimpleContainer title="Cerrando Sesión" description="Cerrando sesión">
            <Card sx={{marginY:'auto'}}>
                <CardContent>
                    <Typography component="div" variant="h5">
                        Cerrando Sesión
                    </Typography>
                </CardContent>
            </Card>
        </SimpleContainer>
    )
}
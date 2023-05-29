import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import CuadroCajones from '@/components/CuadroCajones';
import Layout, { Container } from '@/components/Layout';
import { useCustomTheme } from '@/providers/CustomThemeProvider';
import { Button, Card, CardActionArea, CardContent, CardMedia, TextField, Typography, useTheme } from '@mui/material'
import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import axios from 'axios';
import VistaDeGuardia from '@/components/VistaDeGuardia';
import { EntradaCompleta } from '@/types';

export default function Home(){
    const { currentUser } = useAuth()
    const [usuarioDentro, setUsuarioDentro] = useState(false)
    const [entradaActual, setEntradaActual] = useState<EntradaCompleta|null>(null)
    const { palette:{mode}} = useTheme()

    const cargarUsuarioDentro = useCallback(async () => {
        try{
            const res = await axios.get<[boolean, EntradaCompleta|null]>(`/api/usuario-dentro/${currentUser?.id}`)

            setUsuarioDentro(res.data[0])
            setEntradaActual(res.data[1])
        }
        catch{

        }
    }, [currentUser])

    useEffect(() => {
        cargarUsuarioDentro()
    }, [cargarUsuarioDentro])

    return (
        <Layout title='Inicio' description='Página de inicio de EstacionaTEC'>
            <Container>
                <Typography variant="h6">
                    Inicio
                </Typography>

                <Typography sx={{marginBottom: 2, textAlign: 'justify'}}>
                    Gestiona tu estancia en el estacionamiento, presiona el botón inferior cada
                    vez que quieras entrar o salir de este.
                </Typography>

                <Card sx={{display: 'flex', marginBottom: 2}}>
                    <CardMedia
                        component="img"
                        sx={{ width: 150 }}
                        image={`undraw/${usuarioDentro ? 'trip' : 'walking'}_${mode}.svg`}
                        alt="Imagen"
                    />
                    <CardContent sx={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        textAlign: 'center'
                    }}>    
                        {
                            (usuarioDentro && entradaActual) ? <>
                                <Typography variant="h5" component="div" sx={{marginBottom:2}}>
                                    Estás estacionado en {entradaActual.cajon.estacionamiento.nombre}
                                </Typography>
                                <Typography variant="h5" component="div" sx={{marginBottom:2}}>
                                    Lugar: {entradaActual.cajon.etiqueta}
                                </Typography>
                            </> : <>
                                <Typography variant="h5" component="div" sx={{marginBottom:2}}>
                                    Actualmente no estás estacionado
                                </Typography>
                            </>
                        }                        

                        {/* <Button variant='contained'>
                            Generar QR de { usuarioDentro ? 'Salida' : 'Entrada'}
                        </Button> */}
                    </CardContent>
                </Card>
                {
                    currentUser?.rol.permisosGuardia && (
                        <VistaDeGuardia/>
                    )
                }
            </Container>
        </Layout>
    )
}
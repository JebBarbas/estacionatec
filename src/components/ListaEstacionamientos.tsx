import { Card, CardContent, Typography, CardMedia, Box, CardActionArea, useTheme } from "@mui/material";
import { FC } from "react";
import ExtensiveGrid from "./ExtensibleGrid";
import { useRouter } from "next/router";
import type { Estacionamiento } from "@prisma/client";

interface ListaEstacionamientosProps {
    estacionamientos: Estacionamiento[]
}

const ListaEstacionamientos:FC<ListaEstacionamientosProps> = ({estacionamientos}) => {
    const { palette: {mode}} = useTheme()
    const { push } = useRouter()

    return (
        <ExtensiveGrid spacing={2} maxRows={3}>
            {
                estacionamientos.map(estacionamiento => (
                    <Card
                        key={estacionamiento.id}
                        sx={{height: '100%'}}
                    >
                        <CardActionArea 
                            sx={{display: 'flex', height: '100%'}}
                            onClick={
                                () => push(`/estacionamientos/${estacionamiento.slug}`)
                            }
                        >
                            <CardMedia
                                component="img"
                                sx={{ width: 150 }}
                                image={`undraw/${estacionamiento.imagen}_${mode}.svg`}
                                alt="Imagen"
                            />
                            <CardContent sx={{
                                width: '100%',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                textAlign: 'center'
                            }}>                            
                                <Typography variant="h5" component="div">
                                    {estacionamiento.nombre}
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                ))
            }
        </ExtensiveGrid>
    )
}

export default ListaEstacionamientos
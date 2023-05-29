import CuadroCajones from "@/components/CuadroCajones";
import Layout, { Container } from "@/components/Layout";
import { Grid, TextField, Typography } from "@mui/material";
import { useState } from "react";

export default function Playground(){
    const [patron, setPatron] = useState('')
    return (
        <Layout title="Playground" description="Juega con la distribución de estacionamientos">
            <Container>
                <Grid container spacing={2}>
                    <Grid item xs={3}>
                        <TextField
                            value={patron}
                            onChange={e => setPatron(e.target.value)}
                            multiline
                            label="Ingrese el Patrón"
                            sx={{marginBotton: 2}}
                        />
                        <Typography variant="caption">
                            Representación JSON
                        </Typography>
                        <Typography sx={{wordWrap: 'break-word'}}>
                            {JSON.stringify(patron)}
                        </Typography>
                    </Grid>
                    <Grid item xs={9}>
                        <CuadroCajones
                            patron={patron}
                        />
                    </Grid>
                </Grid>
            </Container>
        </Layout>
    )
}
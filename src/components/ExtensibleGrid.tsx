import { PC } from "@/types";
import { Grid } from '@mui/material'
import { Children } from "react";

interface ExtensiveGridProps {
    spacing?: number
    maxRows: 1 | 2 | 3
}

const ExtensiveGrid:PC<ExtensiveGridProps> = ({children, spacing, maxRows}) => {
    const expand3 = maxRows > 2

    return (
        <Grid container spacing={spacing}>
            {
                Children.toArray(children).map((child, index) => (
                    <Grid item key={index} xs={12} sm={6} md={expand3 ? 4 : 6}>
                        {child}
                    </Grid>
                ))
            }
        </Grid>
    )
}

export default ExtensiveGrid
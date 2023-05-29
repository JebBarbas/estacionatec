import { PC } from "@/types";
import Head from "next/head";
import CustomAppBar from "./CustomAppBar";
import { Breakpoint, Container as MuiContainer, SxProps, Theme } from '@mui/material'

interface LayoutProps {
    title: string
    description: string
    disableAppbar?: boolean
}

interface ContainerProps {
    maxWidth?: false | Breakpoint
    sx?: SxProps<Theme>
}

export const Container:PC<ContainerProps> = ({children, sx, maxWidth = 'lg'}) => {
    return (
        <MuiContainer maxWidth={maxWidth} sx={{paddingY: 2, ...sx}}>
            {children}
        </MuiContainer>
    )
}

const Layout:PC<LayoutProps> = ({children, title, description, disableAppbar}) => {
    return (
        <>
            <Head>
                <title>{`${title} | EstacionaTEC`}</title>
                <meta name="description" content={description} />
            </Head>
            { !disableAppbar && <CustomAppBar title={title}/> }
            {children}
        </>
    )
}

export default Layout
import { PC } from "@/types";
import { Dispatch, SetStateAction, createContext, useContext, useEffect, useState } from "react";
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material'
import { useTernaryDarkMode } from "usehooks-ts";

export type TernaryDarkMode = 'dark' | 'light' | 'system'

interface ICustomThemeContext {
    isDarkMode: boolean,
    ternaryDarkMode: TernaryDarkMode
    setTernaryDarkMode: Dispatch<SetStateAction<TernaryDarkMode>>
}

const customThemeContextDefaultValue: ICustomThemeContext = {
    isDarkMode: false,
    ternaryDarkMode: 'system',
    setTernaryDarkMode(){}
}

const CustomThemeContext = createContext(customThemeContextDefaultValue)
export const useCustomTheme = () => useContext(CustomThemeContext)

const getTheme = (dark:boolean) => createTheme({
    palette: {
        mode: dark ? 'dark' : 'light',
        primary: {
            main: dark ? '#00ADE8' : '#004A85'
        },    
    }
})

export const CustomThemeProvider:PC = ({children}) => {
    const { 
        isDarkMode,
        ternaryDarkMode,
        setTernaryDarkMode,
    } = useTernaryDarkMode()

    // Font: Sofia Pro
    const [theme, setTheme] = useState(getTheme(false))
    
    const value:ICustomThemeContext = {
        isDarkMode, ternaryDarkMode, setTernaryDarkMode
    }

    useEffect(() => {
        setTheme(getTheme(isDarkMode))
    }, [isDarkMode])

    return (
        <CustomThemeContext.Provider value={value}>
            <ThemeProvider theme={theme}>
                <CssBaseline/>
                {children}
            </ThemeProvider>
        </CustomThemeContext.Provider>
    )
}
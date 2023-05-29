import { IconButton } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { TernaryDarkMode, useCustomTheme } from '@/providers/CustomThemeProvider'
import { faSun, faMoon, faQuestion, faGear } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState } from 'react'

const getNextMode = (mode:TernaryDarkMode):TernaryDarkMode => {
    switch(mode){
        case 'light': return 'dark'
        case 'dark': return 'system'
        case 'system': return 'light'
    }
}

const getIcon = (mode:TernaryDarkMode) => {
    switch(mode){
        case 'light': return faSun
        case 'dark': return faMoon
        case 'system': return faGear
    }
}

export default function ModeToggler(){
    const [icon, setIcon] = useState(faSun)
    const { ternaryDarkMode, setTernaryDarkMode } = useCustomTheme()

    useEffect(() => {
        setIcon(getIcon(ternaryDarkMode))
    }, [ternaryDarkMode])

    return (
        <IconButton 
            onClick={() => setTernaryDarkMode(getNextMode(ternaryDarkMode))} 
            sx={{color: 'inherit'}}
        >
            <FontAwesomeIcon icon={icon}/>
        </IconButton>
    )
}
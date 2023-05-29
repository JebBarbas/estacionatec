import { faBars } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Box, AppBar, Toolbar, Typography, Button, Divider, List, ListItem, ListItemButton, ListItemText, Drawer, IconButton } from '@mui/material'
import { useRouter } from 'next/router'
import { useState } from 'react'
import ModeToggler from './ModeToggler'

const drawerWidth = 240
const navItems = [
    {
        display: 'Inicio',
        route: '/'
    },
    {
        display: 'Estacionamientos',
        route: '/estacionamientos'
    },
    {
        display: 'Mi Perfil',
        route: '/perfil'
    }
]

interface CustomAppBarProps {
    title?: string
}

export default function CustomAppBar({title}:CustomAppBarProps){
    const [open, setOpen] = useState(false)
    const toggleOpen = () => setOpen(prev => !prev)
    const { push } = useRouter()

    const drawer = (
        <Box onClick={toggleOpen} sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ my: 2 }}>
                EstacionaTEC
            </Typography>
            <Divider />
            <List>
                {navItems.map((item, index) => (
                    <ListItem key={index} disablePadding>
                        <ListItemButton 
                            sx={{ textAlign: 'left' }}
                            onClick={() => push(item.route)}
                        >
                            <ListItemText primary={item.display} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    )

    return (
        <Box sx={{flexGrow: 1}}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton sx={{mr: 2, display: {sm: 'none'}, color: 'inherit'}} onClick={toggleOpen}>
                        <FontAwesomeIcon icon={faBars}/>
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                        {title || 'EstacionaTEC'}
                    </Typography>
                    <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                        {navItems.map((item, index) => (
                            <Button 
                                key={index} 
                                sx={{ color: '#fff' }}
                                onClick={() => push(item.route)}
                            >
                                {item.display}
                            </Button>
                        ))}
                    </Box>
                    <ModeToggler/>
                </Toolbar>
            </AppBar>
            <Box component="nav">
                <Drawer
                    variant="temporary"
                    open={open}
                    onClose={toggleOpen}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>
            </Box>
        </Box>
    )
}
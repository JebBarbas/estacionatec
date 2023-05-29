import { PC } from "@/types";
import Layout, { Container } from "./Layout";

interface SimpleContainerProps {
    title: string
    description: string
}

const SimpleContainer:PC<SimpleContainerProps> = ({children, title, description}) => {
    return (
        <Layout {...{title, description}} disableAppbar>
            <Container 
                maxWidth="xs" 
                sx={{
                    minHeight: '100vh', 
                    display:'flex', 
                    justifyContent:'center', 
                    alignContent:'center'
                }}
            >
                {children}
            </Container>
        </Layout>
    )
}

export default SimpleContainer
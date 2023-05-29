import AuthProvider from '@/providers/AuthProvider'
import { CustomThemeProvider } from '@/providers/CustomThemeProvider'
import type { AppProps } from 'next/app'
import { SnackbarProvider } from 'notistack'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <CustomThemeProvider>
        <SnackbarProvider autoHideDuration={5000}/>
        <Component {...pageProps} />
      </CustomThemeProvider>
    </AuthProvider>
  )
}

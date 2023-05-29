import AuthProvider from '@/providers/AuthProvider'
import { CustomThemeProvider } from '@/providers/CustomThemeProvider'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <CustomThemeProvider>
        <Component {...pageProps} />
      </CustomThemeProvider>
    </AuthProvider>
  )
}

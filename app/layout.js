import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter'
import './globals.css'

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body>
        <AppRouterCacheProvider>{children}</AppRouterCacheProvider>
      </body>
    </html>
  )
}

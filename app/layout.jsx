import './globals.css'
import { Inter, Poppins } from 'next/font/google'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import SessionProvider from '@/components/SessionProvider'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'], variable: '--font-body' })
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-display',
})

export const metadata = {
  title: 'Vidyalaya LMS | Chinmaya Vidyalaya NTPC Unchahar',
  description: 'Learning Management System for Class X & XII Computer Science',
  icons: { icon: '/favicon.ico' },
}

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions)
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="font-body bg-slate-50 text-slate-900 antialiased">
        <SessionProvider session={session}>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: { fontFamily: 'var(--font-body)', fontSize: '14px' },
              success: { iconTheme: { primary: '#0ea5e9', secondary: '#fff' } },
            }}
          />
        </SessionProvider>
      </body>
    </html>
  )
}

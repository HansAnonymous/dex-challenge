import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

import { PrimeReactProvider } from 'primereact/api'

// import 'primereact/resources/themes/soho-dark/theme.css'
// import 'primereact/resources/themes/viva-dark/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primereact/resources/themes/lara-dark-indigo/theme.css';
import './theme.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
	title: 'NatDex Challenge',
	description: 'Guess the Pokémon based on the given National Dex number!',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<PrimeReactProvider>
			<html lang="en">
				<body className={inter.className}>{children}</body>
			</html>
		</PrimeReactProvider>
	)
}

import React from 'react'
import '../styles/globals.css'
import { AppProps } from 'next/app';
import Link from 'next/link'
import { MoralisProvider } from "react-moralis";
import Web3Provider from "../context/Web3Context"

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MoralisProvider
      appId={process.env.NEXT_PUBLIC_MORALIS_APP_ID || ""}
      serverUrl={process.env.NEXT_PUBLIC_MORALIS_SERVER_URL || ""}
    >
      {/* <Web3Provider> */}
        <div>
          <nav className="border-b p-6">
          <p className="text-4xl font-bold">Pool Noodle Boat Cruise</p>
          <div className="flex mt-4">
            <Link href="/">
              <a className="mr-6 text-blue-500">
                Home
              </a>
            </Link>

            <Link href="/create-noodle">
              <a className="mr-6 text-blue-500">
                Mint a Pool Noodle
              </a>
            </Link>

            <Link href="/my-noodles">
              <a className="mr-6 text-blue-500">
                My Pool Noodles
              </a>
            </Link>

            <Link href="/noodle-studio">
              <a className="mr-6 text-blue-500">
                Pool Noodle Studio
              </a>
            </Link>

          </div>
            
          </nav>
          <Component {...pageProps} />
        </div>
      {/* </Web3Provider> */}
    </MoralisProvider>
  )
}

export default MyApp

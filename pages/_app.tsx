import React from 'react'
import '../styles/globals.css'
import { AppProps } from 'next/app';
import Link from 'next/link'
import { MoralisProvider } from "react-moralis";
import Web3Provider from "../context/Web3Context"

function MyApp({ Component, pageProps }: AppProps) {
  if (!process.env.MORALIS_APPLICATION_ID || !process.env.MORALIS_SERVER_ID) {
    
    return (
          <>
            <h3>Moralis App_ID and Server_ID has not been set:</h3>
            <p>
              Follow the steps on the <a href="https://docs.moralis.io/getting-started/quick-start" target="_blank">Moralis documentation</a> to create a new Moralis project.
              Then find your application's app id and server id and paste them in a root <b>.env</b> file for both <b>.env.development</b> and <b>.env.production</b> like so:
            </p>
            <pre>
              <code>
                MORALIS_APPLICATION_ID='[APP_ID]'<br/>
                MORALIS_SERVER_ID='[SERVER_ID]'
              </code>
            </pre>
          </>
    )
  }
  return (
    <MoralisProvider
      appId={process.env.MORALIS_APPLICATION_ID || ""}
      serverUrl={process.env.MORALIS_SERVER_ID || ""}
    >
      <Web3Provider>
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
      </Web3Provider>
    </MoralisProvider>
  )
}

export default MyApp

import '../styles/dashboard.css'
import '../styles/globals.css'
import '../styles/Navbar.css'
import '../styles/Hero.css'
import {Web3ReactProvider} from '@web3-react/core'
import { ethers } from 'ethers'
//import 'bootstrap/dist/css/bootstrap.min.css';

import Navbar from "../components/navbar"

function getLibrary(provider, connector){
  return new ethers.providers.Web3Provider(provider)
}

function MyApp({ Component, pageProps }) {
  return (
    <>
    <Web3ReactProvider getLibrary={getLibrary}>
      <Navbar/>
      <Component {...pageProps} />
    </Web3ReactProvider>
    </>)
}

export default MyApp

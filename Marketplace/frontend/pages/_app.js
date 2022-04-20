import '../styles/globals.css'
import Navbar from "../components/Navbar"
import {Web3ReactProvider} from '@web3-react/core'
import { ethers } from 'ethers'


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

export default MyApp;

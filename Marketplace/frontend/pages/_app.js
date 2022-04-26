
// import '../styles/globals.css'
import ResponsiveAppBar from '../components/Navbar.js'
import {Web3ReactProvider} from '@web3-react/core'
import { ethers } from 'ethers'
//import 'bootstrap/dist/css/bootstrap.min.css';



function getLibrary(provider, connector){
  return new ethers.providers.Web3Provider(provider)
}

function MyApp({ Component, pageProps }) {
  return (
    <>
    <Web3ReactProvider getLibrary={getLibrary}>
      <ResponsiveAppBar />
      <Component {...pageProps} />
    </Web3ReactProvider>
    </>)
}

export default MyApp


// import '../styles/globals.css'
import ResponsiveAppBar from '../components/Navbar.js'
// import {Web3ReactProvider} from '@web3-react/core'
// import { ethers } from 'ethers'
import ConnectMetamask from '../components/connector'
//import 'bootstrap/dist/css/bootstrap.min.css';



// function getLibrary(provider, connector){
//   return new ethers.providers.Web3Provider(provider)
// }

function MyApp({ Component, pageProps }) {
  return (
    <>
    <ConnectMetamask />
    {/* <Web3ReactProvider getLibrary={getLibrary}>
      <ConnectMetamask />
      <ResponsiveAppBar />
      <Component {...pageProps} />
    </Web3ReactProvider> */}
    </>)
}

export default MyApp

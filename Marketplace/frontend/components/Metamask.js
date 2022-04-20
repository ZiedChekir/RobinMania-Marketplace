import React, {useEffect} from 'react'
import { useWeb3React } from '@web3-react/core'
import {injected} from './connector'
import web3 from "web3"

export default function Metamask() {

    const {active, account, library, connector,chainId, activate, deactivate} = useWeb3React();

    async function CheckAndRequestNetworkSwitch(){
        //kardiachain rpc data
        if(chainId != 242){
          
            try {
                await window.ethereum.request({
                  method: 'wallet_switchEthereumChain',
                  params: [{ chainId: web3.utils.toHex(242) }]
                });
              } catch (err) {
                  // This error cod
                  console.log(err)
              }
        }
    }

    async function connect(){
        try {
            await activate(injected)
            localStorage.setItem("isWalletConnected",true)
            await CheckAndRequestNetworkSwitch()
            
        }catch(err){
            console.log(err)
        }

    }
    async function disconnect(){
        deactivate();
       localStorage.setItem("isWalletConnected",false)
    
    }
    async function test(){
    const ContractAddress = "0x90Ff0faA8d781477dC8245dC57582Ecf353Ef789"
    const ABI = [
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_greeting",
                    "type": "string"
                }
            ],
            "name": "updateGreeting",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "greeting",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "sayHello",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ]
    const contract =  library.Contract(ContractAddress,ABI)
    console.log(contract.sayHello());
    }
    useEffect(()=>{
        if (window.ethereum) {
            window.ethereum.on('chainChanged', () => {
              localStorage.setItem("isWalletConnected",false)

              window.location.reload();
            })
            window.ethereum.on('accountsChanged', () => {
                localStorage.setItem("isWalletConnected",false)

              window.location.reload();
            })
          }
        const connectWalletOnPageLoad = async () =>{
            if(localStorage?.getItem("isWalletConnected")==="true"){
                try{
                    await activate(injected);
                }catch(err){
                    console.log(err);
                }
            }
        }
        connectWalletOnPageLoad();
    },[])

  return (
    <div>

        <button onClick={test}>test</button>
        <button onClick={connect}> Connect Metamask</button>
        {active ? <span>adress {account}</span>: <span>not connected</span>} 
        
        <button onClick={disconnect}>Disconnect</button>
    </div>
  )
}

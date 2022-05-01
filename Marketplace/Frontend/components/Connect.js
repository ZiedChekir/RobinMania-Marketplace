import React from 'react';
import { ethers } from "ethers";
import {useState,useEffect} from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
const Connect = () => {
    const [balance,setBalance] = useState("")
    const [currentAccount, setCurrentAccount] = useState("")
    const [chainId,setChainId] = useState(null)
    const [chainname,setChainName] = useState("")
    useEffect(()=>{
        if(!currentAccount || !ethers.utils.isAddress(currentAccount)) return
        if(!window.ethereum) return
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        provider.getBalance(currentAccount).then((result)=>{
            setBalance(ethers.utils.formatEther(result))
        })
        provider.getNetwork().then((result)=>{
            setChainId(result.chainId)
            setChainName(result.name)
        })
    },[currentAccount])
    const onClickConnect = ()=> {
        if(!window.ethereum){
            console.log("please install MetaMask!")
            return
        }
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        provider.send("eth_requestAccounts", [])
        .then((accounts)=>{
            if(accounts.length>0) setCurrentAccount(accounts[0])
        })
        .catch((e)=>console.log(e))
    }
    return (
        <>
        {!ethers.utils.isAddress(currentAccount) ? 
        <Button sx={{ color: 'white',}} variant="outlined" onClick={() => {onClickConnect()}}>Connect Wallet</Button>
        :   
        <h4>{currentAccount}</h4>
        }
        </>
    )
}
export default Connect;
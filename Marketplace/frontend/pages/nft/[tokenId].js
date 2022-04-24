
import {useRouter} from 'next/router'
import { useEffect, useState } from 'react';
import { useWeb3React } from "@web3-react/core";
 import { GameABI, GameAddress } from "../../config";
 import { ethers } from 'ethers';
//import { Button } from 'react-bootstrap';
import CardItem from '../../components/Card';
const nft =()=>{
    const router = useRouter();
    const tokenId = router.query.tokenId;
    
    const [nft , setNft] = useState({});
  useEffect(() => {
    FetchNftData();
  
    
  }, [])
  

   const  FetchNftData = async ()=>{
    
    const response = await fetch("https://raw.githubusercontent.com/SamiKammoun/robinmania/main/metadata/"+tokenId+".json", {
        headers: {
          'Accept': 'application/json'
        }
      })
      const nftjson = await response.json();
      console.log(nftjson)
      setNft(nftjson)
    }
    

    const FetchOrders = async ()=>{

        const provider = new ethers.providers.JsonRpcProvider();
        const signer = provider.getSigner();
        const Contract = new ethers.Contract(GameAddress, GameABI,signer);
        const ordersData = await  Contract.getOrdersOf(tokenId)

        console.log(ordersData);

    }

    if(nft== {}) return <h1>Loading</h1>
    return (
    <div>

        <button onClick={FetchOrders}>fetchORders</button>
<CardItem
        
        title={nft.name}
        description={nft.description}
        image={nft.image}
        link ={"/nft/"+(1)}
      />    <button >show nft</button>
    </div>
    )
}

export default nft;
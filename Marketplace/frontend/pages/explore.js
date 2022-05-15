import { useWeb3React } from "@web3-react/core";
 import { GameABI, GameAddress } from "../config";
 import { useEffect, useState } from "react";
 import { ethers } from "ethers";
import AuctionCard from "../components/AuctionCard";

import { Grid } from "@mui/material";
import Auctions from "./Auctions";

const explore =  ()=> {

    const loadCollection = async () => {
        if(!active) return ;
        const provider = new ethers.providers.JsonRpcProvider();
        const signer = provider.getSigner();
        const Contract = new ethers.Contract(GameAddress, GameABI,signer);
        const data = await Contract.balanceOfBatch([account, account,account,account,account], [1, 2,3,4,5]);
    
        let nftArray = [];
        for (let i = 0; i < 5; i++) {
          let BalanceOfTokenID = data[i].toNumber();
          
          if(BalanceOfTokenID ==0) return;
          const response = await fetch("https://raw.githubusercontent.com/SamiKammoun/robinmania/main/metadata/"+(i+1)+".json", {
            headers: {
              'Accept': 'application/json'
            }
          })
          const responseJson = await response.json();
           nftArray.push(responseJson)
          
          
        }
    
        setNfts(nftArray);
        setLoadingState("loaded");
      };
    
    return (
    <>
    <h2>explore page</h2>
    <Auctions/>
    </>
    )
}
export default explore; 
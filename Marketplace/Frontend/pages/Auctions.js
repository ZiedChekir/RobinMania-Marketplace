import {  ethers } from "ethers"
import { NftAuctionABI, NftAuctionAddress } from "../config";
import { useLayoutEffect, useState } from "react";
import { Grid } from "@mui/material";
import AuctionCard from "../components/AuctionCard";

const Auctions = () => {
    const [auctions,setAuctions] = useState([])
    const loadAuctions = async () => {
        const provider = new ethers.providers.JsonRpcProvider();
        const signer = provider.getSigner();
        const contract = new ethers.Contract(NftAuctionAddress,NftAuctionABI,signer);
        let _auctions = []
        for(let i=0;i<5;i++){
            let data = await contract.getAuctionOf(i)
            data = data.map((auction) => ({
                ...auction,
                tokenID: i
            }))
            _auctions = [..._auctions,...data]
        }
        setAuctions(_auctions)
    }
    useLayoutEffect(() => {
      loadAuctions()
    },[])
    return (
        <Grid container rowSpacing={3} columnSpacing={3}>
            {
                auctions.map((auction) => (
                    <Grid key={[auction.tokenID,auction.index]} item xs={3}>
                        <AuctionCard auction={auction} />
                    </Grid>
                ))
            }
        </Grid>
    )
}
export default Auctions
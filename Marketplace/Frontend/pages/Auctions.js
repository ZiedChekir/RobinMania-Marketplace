import { BigNumber, ethers } from "ethers"
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
        for(let i=0;i<5;i++){
            let data = await contract.getAuctionOf(i)
            data = data.map((auction) => ({
                ...auction,
                tokenID: i
            }))
            setAuctions((prevAuctions) => [...prevAuctions,...data])
        }
    }
    useLayoutEffect(() => {
      loadAuctions()
    },[])
    return (
        <Grid container rowSpacing={3} columnSpacing={3}>
            {
                auctions.map((auction) => (
                    <Grid key={auction.auctionStartedAt} item xs={3}>
                        <AuctionCard auction={auction} />
                    </Grid>
                ))
            }
        </Grid>
    )
}
export default Auctions
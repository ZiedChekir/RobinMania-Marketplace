import { ethers } from "ethers";
import { NftAuctionABI, NftAuctionAddress } from "../config";
import { useLayoutEffect, useEffect, useState } from "react";
import { Container, Grid } from "@mui/material";
import AuctionCard from "../components/AuctionCard";
import { Typography, Button } from "@mui/material";
import { AssuredWorkload } from "@mui/icons-material";

const Aauctions = () => {
  const [allAuctions, setAllAuctions] = useState([]);
  const [notEndedAuctions, setNotEndedAuctions] = useState([]);
  async function loadAllAuctions() {
    const provider = new ethers.providers.JsonRpcProvider(
      "https://matic-testnet-archive-rpc.bwarelabs.com"
    );
    const signer = provider.getSigner(
      "0xAECd1a6c42866cd7dFb97334568579FA5Ff17B4B"
    );
    const contract = new ethers.Contract(
      NftAuctionAddress,
      NftAuctionABI,
      signer
    );
    let _auctions = [];
    let _data = await contract.getAllAuctions(5); //5 is the number of items
    for (let i = 1; i < 6; i++) {
      let data = _data[i - 1];
      data = data.map((auction) => ({
        ...auction,
        tokenID: i,
      }));
      _auctions = [..._auctions, ...data];
    }
    setAllAuctions(_auctions);
  }
  async function loadNotEndedAuctions() {
    const now = Math.floor(new Date().getTime() / 1000);
    let _auctions = allAuctions.filter((auction) => {
      return auction.auctionEnd - now > 0;
    });
    setNotEndedAuctions(_auctions);
    console.log(_auctions);
  }
  useEffect(() => {
    loadAllAuctions();
  }, []);
  useEffect(() => {
    loadNotEndedAuctions();
  }, [allAuctions]);
  return (
    <>
      <Container>
        <Grid
          container
          rowSpacing={3}
          columnSpacing={3}
          overflow="hidden"
          alignItems="stretch"
        >
          {notEndedAuctions.map((auction) => (
            <Grid
              key={[auction.tokenID, auction.index]}
              item
              xs={12}
              md={6}
              lg={4}
              style={{ display: "flex" }}
            >
              <AuctionCard CardType={0} auction={auction} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
};
export default Aauctions;

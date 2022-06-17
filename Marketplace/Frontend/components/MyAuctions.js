import { ethers } from "ethers";
import { NftAuctionABI, NftAuctionAddress } from "../config";
import { useLayoutEffect, useEffect, useState } from "react";
import { Container, Grid } from "@mui/material";
import AuctionCard from "../components/AuctionCard";
import { Typography, Button } from "@mui/material";
import { AssuredWorkload } from "@mui/icons-material";

const MyAuctions = () => {
  const [auctions, setAuctions] = useState([]);
  const [UserEndedAuctions, setUserEndedAuctions] = useState([]);
  const [UserNotEndedAuctions, setUserNotEndedAuctions] = useState([]);

  async function loadEndedAuctionsForThisAccount() {
    if (!window.ethereum) return;
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
    const account = await new ethers.providers.Web3Provider(window.ethereum)
      .getSigner()
      .getAddress();
    let _auctions = [];
    for (let i = 0; i < 5; i++) {
      let data = await contract.getAuctionOf(i);
      data = data.map((auction) => ({
        ...auction,
        tokenID: i,
      }));
      _auctions = [..._auctions, ...data];
    }
    const now = Math.floor(new Date().getTime() / 1000);

    _auctions = _auctions.filter((auction) => {
      return (
        auction.auctionEnd - now < 0 &&
        auction.highestBidder == account &&
        auction.state == 0
      );
    });
    setUserEndedAuctions(_auctions);
  }
  async function loadNotEndedAuctionsForThisAccount() {
    if (!window.ethereum) return;
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
    const account = await new ethers.providers.Web3Provider(window.ethereum)
      .getSigner()
      .getAddress();
    let _auctions = [];
    for (let i = 0; i < 5; i++) {
      let data = await contract.getAuctionOf(i);
      data = data.map((auction) => ({
        ...auction,
        tokenID: i,
      }));
      _auctions = [..._auctions, ...data];
    }
    const now = Math.floor(new Date().getTime() / 1000);

    _auctions = _auctions.filter((auction) => {
      return auction.auctionEnd - now > 0 && auction.highestBidder == account;
    });
    setUserNotEndedAuctions(_auctions);
  }

  async function loadAuctions() {
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
    for (let i = 1; i < 6; i++) {
      let data = await contract.getAuctionOf(i);
      data = data.map((auction) => ({
        ...auction,
        tokenID: i,
      }));
      _auctions = [..._auctions, ...data];
    }
    const now = Math.floor(new Date().getTime() / 1000);
    _auctions = _auctions.filter((auction) => {
      return auction.auctionEnd - now > 0;
    });
    setAuctions(_auctions);
  }
  useEffect(() => {
    loadAuctions();
    loadNotEndedAuctionsForThisAccount();
    loadEndedAuctionsForThisAccount();
  }, []);

  return (
    <>
      {UserEndedAuctions.length > 0 && (
        <Typography sx={{ color: "white" }} variant="h1" align="center">
          My Auctions
        </Typography>
      )}
      <Container>
        <Grid container rowSpacing={3} columnSpacing={3} alignItems="stretch">
          {UserEndedAuctions.map((auction) => (
            <Grid
              key={[auction.tokenID, auction.index]}
              item
              xs={12}
              md={6}
              lg={4}
              style={{ display: "flex" }}
            >
              <AuctionCard
                loadEndedAuctions={loadEndedAuctionsForThisAccount}
                loadAuctions={loadAuctions}
                CardType={1}
                auction={auction}
              />
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
};

export default MyAuctions;

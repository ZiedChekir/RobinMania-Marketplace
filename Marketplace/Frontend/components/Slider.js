import { ethers } from "ethers";
import { NftAuctionABI, NftAuctionAddress } from "../config";
import { useLayoutEffect, useEffect, useState } from "react";
import { Container, Grid } from "@mui/material";
import AuctionCard from "../components/AuctionCard";
import { Typography, Button } from "@mui/material";
import { AssuredWorkload } from "@mui/icons-material";
import { spacing } from "@mui/system";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import React from "react";
import Slider from "react-slick";

import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

const Cards = () => {
  const [auctions, setAuctions] = useState([]);
  const [UserEndedAuctions, setUserEndedAuctions] = useState([]);
  const [UserNotEndedAuctions, setUserNotEndedAuctions] = useState([]);

  async function loadEndedAuctionsForThisAccount() {
    if (!window.ethereum) return;
    const provider = new ethers.providers.JsonRpcProvider(
      "https://matic-mumbai.chainstacklabs.com/"
    );
    const signer = provider.getSigner(
      
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
      "https://matic-mumbai.chainstacklabs.com/"
    );
    const signer = provider.getSigner(
      
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
      "https://matic-mumbai.chainstacklabs.com/"
    );
    const signer = provider.getSigner(
      
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

  function CardsContainer(props) {
    return (
      <div>
        <div className="cards">
          <div className="card-columns">
            <div className="cards__wrapper">
              <ul className="cards__items">
                {auctions.map((auction) => (
                  <Grid
                    key={[auction.tokenID, auction.index]}
                    item
                    xs={12}
                    md={6}
                    lg={4}
                    sx={{margin:"10px", display:"flex"}}
                  >
                    <AuctionCard CardType={0}  auction={auction} />
                  </Grid>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <CardsContainer auctions={auctions} />;
};

export default Cards;

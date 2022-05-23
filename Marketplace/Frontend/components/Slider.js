import { ethers } from "ethers";
import { NftAuctionABI, NftAuctionAddress } from "../config";
import { useLayoutEffect,useEffect, useState } from "react";
import { Container, Grid } from "@mui/material";
import AuctionCard from "../components/AuctionCard";
import { Typography, Button } from "@mui/material";
import { AssuredWorkload } from "@mui/icons-material";
import { spacing } from "@mui/system";
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';

const Cards = () => {
  const [auctions, setAuctions] = useState([]);
  const [UserEndedAuctions, setUserEndedAuctions] = useState([]);
  const [UserNotEndedAuctions, setUserNotEndedAuctions] = useState([]);

  async function loadEndedAuctionsForThisAccount () {
    if(!window.ethereum) return
    const provider = new ethers.providers.JsonRpcProvider("https://dev.kardiachain.io/");
    const signer = provider.getSigner("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
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
        
      return auction.auctionEnd - now < 0 && auction.highestBidder == account && auction.state == 0;
    });
    setUserEndedAuctions(_auctions);
  };
  async function loadNotEndedAuctionsForThisAccount () {
    if(!window.ethereum) return
    const provider = new ethers.providers.JsonRpcProvider("https://dev.kardiachain.io/");
    const signer = provider.getSigner("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
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
  };

  async function  loadAuctions(){
    

    const provider = new ethers.providers.JsonRpcProvider("https://dev.kardiachain.io/");
    const signer = provider.getSigner("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
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

  };
  useEffect(() => {
    loadAuctions();
    loadNotEndedAuctionsForThisAccount();
    loadEndedAuctionsForThisAccount();
  }, []);






function CardsContainer(props) {

  return (<div>
    <div className='cards'>

      <div className='card-columns' >
        <div className='cards__wrapper' >

          <ul className='cards__items' >
          {auctions.map((auction) => (
            <Grid
              key={[auction.tokenID, auction.index]}
              item
              xs={12}
              md={6}
              lg={4}
            >
              <AuctionCard CardType={0} auction={auction} />
            </Grid>
            ))}

          </ul>

        </div>
      </div>
    </div>

  </div>)
}



return (
  <CardsContainer auctions={auctions} />
);

};

export default Cards;
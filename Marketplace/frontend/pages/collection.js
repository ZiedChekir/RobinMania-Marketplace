import { GameABI, GameAddress } from "../config";
import { useEffect, useState } from "react";
import CardItem from "../components/Card";
import { ethers } from "ethers";
import NftCard from "../components/MuiCard";
import { Typography, Grid, Container,Button } from "@mui/material";
import { NftAuctionABI, NftAuctionAddress } from "../config";
import nft from "./nft/[tokenId]";

const Collection = () => {
  const [Nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");
  const [currentAccount, setCurrentAccount] = useState("");
  const [auctions, setAuctions] = useState([]);


  useEffect(() => {
    ethereum.on("accountsChanged", (accounts) => {
      setCurrentAccount(accounts[0]);
    });
    loadCollection();
    console.log("updated");
  }, [currentAccount]);
  const loadCollection = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const Contract = new ethers.Contract(GameAddress, GameABI, signer);
    const account = await signer.getAddress();
    const data = await Contract.balanceOfBatch(
      [account, account, account, account, account],
      [1, 2, 3, 4, 5]
    );
    
    let nftArray = [];
    for (let i = 0; i < 5; i++) {
      let BalanceOfTokenID = data[i].toNumber();
      
      if (BalanceOfTokenID == 0) continue;

      const response = await fetch(
        "https://raw.githubusercontent.com/SamiKammoun/robinmania/main/metadata/" +
          (i + 1) +
          ".json",
        {
          headers: {
            Accept: "application/json",
          },
        }
      );

      const responseJson = await response.json();
      responseJson["quantity"] = BalanceOfTokenID;
      nftArray.push(responseJson);
    }
    setNfts(nftArray);
    setLoadingState("loaded");
  };
  if (Nfts.length == 0) return <Typography
  sx={{ color: "white" }}
  className="explore"
  variant="h1"
  align="center"
>
  You have no item
</Typography>
  return (
    <section className="cards-primary">
      <Typography
        sx={{ color: "white" }}
        className="explore"
        variant="h1"
        align="center"
      >
        Owned Items
      </Typography>
      <Container>
        <Grid className="nftGrid" container rowSpacing={3} columnSpacing={3}>
          {Nfts.map((nft, i) => {
            return (
              <Grid item xs={12} md={6} lg={4}>
                <NftCard
                  key={nft.name}
                  title={nft.name}
                  description={nft.description}
                  quantity={nft.quantity}
                  image={nft.image}
                  link={"/nft/" + (i + 1)}
                />
              </Grid>
            );
          })}

        </Grid>

      </Container>
    </section>
  );
};

export default Collection;

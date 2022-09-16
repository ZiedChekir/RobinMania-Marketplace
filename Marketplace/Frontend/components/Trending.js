import { useWeb3React } from "@web3-react/core";
import { GameABI, GameAddress } from "../config";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import AuctionCard from "../components/AuctionCard";
import { Container } from "@mui/material";
import { Grid } from "@mui/material";
import NftCard from "../components/MuiCard";
import { Typography } from "@mui/material";
import { TrendingFlatOutlined } from "@mui/icons-material";

const Trending = () => {
  const [Nfts, setNfts] = useState([]);

  useEffect(() => {
    loadNfts();
  }, []);

  const loadNfts = async () => {
    const provider = new ethers.providers.JsonRpcProvider("https://eth.bd.evmos.dev:8545");
    const signer = provider.getSigner("0xAECd1a6c42866cd7dFb97334568579FA5Ff17B4B");
    const Contract = new ethers.Contract(GameAddress, GameABI, signer);
    let nftArray = [];
    for (let i = 0; i < 5; i++) {
      const response = await fetch(
        "https://raw.githubusercontent.com/SamiKammoun/robinmania/main/metadata/" + (i + 1) + ".json",
        {
          headers: {
            Accept: "application/json",
          },
        }
      );
      const responseJson = await response.json();
      nftArray.push(responseJson);
    }

    setNfts(nftArray);
  };

  function CardsContainerNFT(props) {
    return (
      <Grid container alignItems="stretch" rowSpacing={3} columnSpacing={3}>
        {Nfts.map((nft, i) => {
          if (i > 3) return;

          return (
            <Grid key={nft.name} item xs={12} md={6} lg={3} style={{ display: "flex" }}>
              <NftCard
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
    );
  }

  return <CardsContainerNFT Nfts={Nfts} />;
};

export default Trending;

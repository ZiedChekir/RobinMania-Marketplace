import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { MarketplaceABI, MarketplaceAddress } from "../../config";
import { GameABI, GameAddress } from "../../config";
import {
  Grid,
  Container,
  Box,
  Typography,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
} from "@mui/material";
import { ethers } from "ethers";
import { NftAuctionABI, NftAuctionAddress } from "../../config";
import toast from "react-hot-toast";
//import { Button } from 'react-bootstrap';
import CardItem from "../../components/Card";
import { fontSize } from "@mui/system";
//import priceModal from "../../components/priceModal";

const nft = () => {
  const { query, isReady } = useRouter();
  const [showing, setShowing] = useState(false);

  const tokenId = query.tokenId;
  const [nft, setNft] = useState({});
  const [Orders, setOrders] = useState([]);
  const [price, setPrice] = useState("");
  const [StartingPrice, setStartingPrice] = useState("");
  const [BidPeriod, setBidPeriod] = useState("");
  const [MinIncriment, setMinIncriment] = useState("");
  const [SellState, setSellState] = useState(false);
  const [BuyState, setBuyState] = useState(false);
  const [AuctionState, setAuctionState] = useState(false);

  useEffect(() => {
    setShowing(true);
    if (isReady) {
      FetchOrders();
      FetchNftData();
    }
  }, [query]);

  if (!showing) {
    return null;
  }

  const sell = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const MarketplaceContract = new ethers.Contract(
      MarketplaceAddress,
      MarketplaceABI,
      signer
    );
    const account = await signer.getAddress();

    const NFTContract = new ethers.Contract(GameAddress, GameABI, signer);

    let approved = await NFTContract.isApprovedForAll(
      account,
      MarketplaceAddress
    );
    if (!approved) {
      await NFTContract.setApprovalForAll(MarketplaceAddress, true);
    }
    const toastId = toast.loading("Waiting...");

    const result = await MarketplaceContract.listItem(
      GameAddress,
      tokenId,
      price.toString()
    );
    toast.dismiss(toastId);

    if (result["hash"].length == 66)
      toast.success("Successfully listed for sale!");
    else toast.error("error");

    setSellState(false);
  };

  const buy = async (orderIndex, price) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const MarketplaceContract = new ethers.Contract(
      MarketplaceAddress,
      MarketplaceABI,
      signer
    );
    // const NFTContract = new ethers.Contract(GameAddress,GameABI,signer)
    //await NFTContract.setApprovalForAll(MarketplaceAddress, true);
    const toastId = toast.loading("waiting...");

    const result = await MarketplaceContract.buyItem(
      GameAddress,
      tokenId,
      parseInt(orderIndex),
      {
        value: price.toString(),
      }
    );
    toast.dismiss(toastId);

    if (result["hash"].length == 66) {
      toast.success("Item successfully bought");
    } else {
      toast.error("error");
    }
  };

  const createAuction = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const AuctionContract = new ethers.Contract(
      NftAuctionAddress,
      NftAuctionABI,
      signer
    );
    const toastId = toast.loading("Waiting...");

    const result = await AuctionContract.createNewAuctionItem(
      GameAddress,
      tokenId,
      ethers.utils.parseEther(StartingPrice).toString(),
      BidPeriod,
      MinIncriment
    );
    toast.dismiss(toastId);

    if (result["hash"].length == 66)
      toast.success("Auction successfully created!");
    else toast.error("error");

    setAuctionState(false);
  };

  async function FetchNftData() {
    const response = await fetch(
      "https://raw.githubusercontent.com/SamiKammoun/robinmania/main/metadata/" +
        tokenId +
        ".json",
      {
        headers: {
          Accept: "application/json",
        },
      }
    );
    const nftjson = await response.json();
    console.log(nftjson);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const Contract = new ethers.Contract(GameAddress, GameABI, signer);
    const account = await signer.getAddress();
    const data = await Contract.balanceOf(account, tokenId);
    nftjson["quantity"] = data;
    setNft(nftjson);
  }

  async function FetchOrders() {
    const provider = new ethers.providers.JsonRpcProvider();
    const signer = provider.getSigner();
    const Contract = new ethers.Contract(
      MarketplaceAddress,
      MarketplaceABI,
      signer
    );
    const ordersData = await Contract.getOrdersOf(tokenId);
    console.log(ordersData[0].price.toString());
    console.log(ordersData[0].seller);
    console.log(ordersData[0].index.toString());
    const tempArray = [];
    ordersData.map((order) => {
      const orderJson = {
        seller: order.seller,
        price: order.price.toString(),
        orderIndex: order.index.toString(),
      };
      tempArray.push(orderJson);
    });
    setOrders(tempArray);
  }
  const handleChange = (e) => {
    setPrice(e.target.value);
  };
  const OpenSellModel = () => {
    setSellState(true);
  };
  if (typeof window === "undefined") {
    return <></>;
  } else {
    return (
      <Container fixed className="NftPage">
        {/* <button onClick={FetchOrders}>fetchORders</button>
        <button onClick={OpenPriceModel}>sell</button>
        <button onClick={buy}>buy</button> <br />
        <input type="text" onChange={handleChange} /> */}
        <Grid container spacing={2} className="NftDetails">
          <Grid item xs={4}>
            <img src={nft.image} height="450px" />
          </Grid>
          <Grid item xs={8}>
            <Box
              sx={{
                height: 450,
                p: 2,
                border: "4px solid #1EB854",
                borderRadius: "16px",
                backgroundColor:"#272935",
              }}
            >
              <Typography sx={{color:"white"}} variant="h3">{nft.name}</Typography>
              <Typography sx={{color:"white", fontSize:"15px"}}>Description: </Typography>
              <Typography style={{ color: "white",fontSize:"20px" }} >
                {nft.description}
              </Typography>
              <Box className="Buttons">
                {nft.quantity > 0 ? (
                  <Grid container spacing={2}>
                    <Grid item xs={6}></Grid>
                    <Grid item xs={3}>
                      <Button className="SellButton" onClick={() => setSellState(true)} variant="contained" sx={{backgroundColor:"#1EB854"}}>
                        Sell
                      </Button>
                    </Grid>

                    <Grid item xs={3}>
                      <Button ClassName="CreateAuctionButton"
                        onClick={() => setAuctionState(true)}
                        variant="contained"
                        sx={{backgroundColor:"#1EB854"}}
                      >
                        Create Auction
                      </Button>
                    </Grid>
                  </Grid>
                ) : (
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Button disabled variant="text">
                        Sell
                      </Button>
                    </Grid>

                    <Grid item xs={6}>
                      <Button disabled variant="text">
                        Create Auction
                      </Button>
                    </Grid>
                  </Grid>
                )}
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Typography className="seeOrders" variant="h3" align="center">
          See Orders
        </Typography>
        <div className="OrderTable">
          <table border="1" width="100%" cellspacing="0" cellpadding="6">
            <tr>
              <td width="50%" bgcolor="#000000">
                <font color="#FFFFFF">Seller</font>
              </td>
              <td width="50%" bgcolor="#000000">
                <font color="#FFFFFF">Price</font>
              </td>
              <td width="50%" bgcolor="#000000">
                <font color="#FFFFFF">Buy</font>
              </td>
            </tr>

            {Orders.map((x) => {
              return (
                <tr>
                  <td width="50%">{x.seller}</td>
                  <td width="50%">{x.price}</td>
                  <td width="50%">
                    <Button onClick={() => buy(x.orderIndex, x.price)}>
                      Buy
                    </Button>
                  </td>
                </tr>
              );
            })}
          </table>
        </div>

        <Dialog
          open={BuyState}
          onClose={() => setBuyState(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Confirmation"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to buy this item?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setBuyState(false)}>No</Button>
            <Button onClick={() => setBuyState(false)} autoFocus>
              Confirm
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={SellState} onClose={() => setSellState(false)}>
          <DialogTitle>Confirmation</DialogTitle>
          <DialogContent>
            <DialogContentText>Name your price!</DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="price"
              type="text"
              fullWidth
              variant="standard"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSellState(false)}>Cancel</Button>
            <Button onClick={sell}>Sell</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={AuctionState} onClose={() => setAuctionState(false)}>
          <DialogTitle>Confirmation</DialogTitle>
          <DialogContent>
            <DialogContentText>Create auction</DialogContentText>

            <Grid container spacing={2}>
              <Grid item xs={8}>
                <TextField
                  autoFocus
                  margin="dense"
                  id="name"
                  label="Starting Price"
                  type="text"
                  fullWidth
                  variant="standard"
                  value={StartingPrice}
                  onChange={(e) => setStartingPrice(e.target.value)}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  id="outlined-select-currency"
                  select
                  label="Select"
                  value={BidPeriod}
                  onChange={(e) => setBidPeriod(e.target.value)}
                  helperText="Select the Auction Period"
                >
                  <MenuItem value="43200">12 Hours</MenuItem>

                  <MenuItem value="84600">1 Day</MenuItem>
                  <MenuItem value="172800">2 Days</MenuItem>
                </TextField>
              </Grid>
            </Grid>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Minimum Bid Incriment"
              type="text"
              fullWidth
              variant="standard"
              value={MinIncriment}
              onChange={(e) => setMinIncriment(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAuctionState(false)}>Cancel</Button>
            <Button onClick={() => createAuction()}>Create Auction</Button>
          </DialogActions>
        </Dialog>
      </Container>
    );
  }
};

export default nft;

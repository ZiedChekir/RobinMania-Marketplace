import { useRouter } from "next/router";
import { useEffect, useState } from "react";
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
const Nft = () => {
  const { query, isReady } = useRouter();
  const [showing, setShowing] = useState(false);

  const tokenId = query.tokenId;
  const [nft, setNft] = useState({});
  const [Orders, setOrders] = useState([]);
  const [price, setPrice] = useState("");
  const [StartingPrice, setStartingPrice] = useState("");
  const [BidPeriod, setBidPeriod] = useState("");
  const [MinIncrement, setMinIncriment] = useState("");
  const [SellState, setSellState] = useState(false);
  const [BuyState, setBuyState] = useState(false);
  const [AuctionState, setAuctionState] = useState(false);
  const [OrderState, setOrderState] = useState(false);

  useEffect(() => {
    setShowing(true);
    if (isReady) {
      FetchOrders();
      FetchNftData();
    }
  }, [query, OrderState]);

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

    const NFTContract = new ethers.Contract(GameAddress, GameABI, signer);
    const account = await signer.getAddress();

    let approved = await NFTContract.isApprovedForAll(
      account,
      MarketplaceAddress
    );
    if (!approved) {
      const x = await NFTContract.setApprovalForAll(MarketplaceAddress, true);
      x.wait();
    }
    const toastId = toast.loading("Waiting...", { duration: 3000 });

    const result = await MarketplaceContract.listItem(
      GameAddress,
      tokenId,
      ethers.utils.parseEther(price)
    );
    result.wait();
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
    const toastId = toast.loading("waiting...", { duration: 3000 });

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
    setOrderState(!OrderState);
  };

  const createAuction = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const AuctionContract = new ethers.Contract(
      NftAuctionAddress,
      NftAuctionABI,
      signer
    );
    const toastId = toast.loading("Waiting...", { duration: 3000 });
    const account = await signer.getAddress();
    const NFTContract = new ethers.Contract(GameAddress, GameABI, signer);

    let approved = await NFTContract.isApprovedForAll(
      account,
      NftAuctionAddress
    );
    if (!approved) {
      const x = await NFTContract.setApprovalForAll(NftAuctionAddress, true);
      x.wait();
    }
    const result = await AuctionContract.createNewAuctionItem(
      GameAddress,
      tokenId,
      ethers.utils.parseEther(StartingPrice).toString(),
      BidPeriod,
      ethers.utils.parseEther(MinIncrement).toString()
    );
    toast.dismiss(toastId);

    if (result["hash"].length == 66)
      toast.success("Auction successfully created!");
    else toast.error("error");

    setAuctionState(false);
  };

  async function FetchNftData() {
    const _provider = new ethers.providers.JsonRpcProvider(
      "https://matic-testnet-archive-rpc.bwarelabs.com"
    );
    const _signer = _provider.getSigner(
      "0xAECd1a6c42866cd7dFb97334568579FA5Ff17B4B"
    );
    const gameContract = new ethers.Contract(GameAddress, GameABI, _signer);
    const URI = await gameContract.uri(tokenId);
    const response = await fetch(URI, {
      headers: {
        Accept: "application/json",
      },
    });
    const nftjson = await response.json();
    if (!window.ethereum) {
      setNft(nftjson);
      return;
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const Contract = new ethers.Contract(GameAddress, GameABI, signer);
    const account = await signer.getAddress();
    const data = await Contract.balanceOf(account, tokenId);
    nftjson["quantity"] = data;
    setNft(nftjson);
  }

  async function FetchOrders() {

   
    const signer = provider.getSigner(
      "0xAECd1a6c42866cd7dFb97334568579FA5Ff17B4B"
    );
    const provider = new ethers.providers.JsonRpcProvider(
      
      "https://matic-testnet-archive-rpc.bwarelabs.com"
    );
    const Contract = new ethers.Contract(
      MarketplaceAddress,
      MarketplaceABI,
      signer
    );
    const ordersData = await Contract.getOrdersOf(tokenId);
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

  if (typeof window === "undefined") {
    return <></>;
  } else {
    return (
      <Container fixed className="NftPage">
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
                backgroundColor: "#272935",
              }}
            >
              <Typography sx={{ color: "white" }} variant="h3">
                {nft.name}
              </Typography>
              <Typography sx={{ color: "white", fontSize: "15px" }}>
                Description:{" "}
              </Typography>
              <Typography style={{ color: "white", fontSize: "20px" }}>
                {nft.description}
              </Typography>
              <Box className="Buttons">
                {nft.quantity > 0 ? (
                  <Grid container spacing={2}>
                    <Grid item xs={6}></Grid>
                    <Grid item xs={3}>
                      <Button
                        className="SellButton"
                        onClick={() => setSellState(true)}
                        variant="contained"
                        sx={{ backgroundColor: "#1EB854" }}
                      >
                        Sell
                      </Button>
                    </Grid>

                    <Grid item xs={3}>
                      <Button
                        className="CreateAuctionButton"
                        onClick={() => setAuctionState(true)}
                        variant="contained"
                        sx={{ backgroundColor: "#1EB854" }}
                      >
                        Create Auction
                      </Button>
                    </Grid>
                  </Grid>
                ) : (
                  <Grid container spacing={2}>
                    <Grid item xs={6}></Grid>
                    <Grid item xs={3}>
                      <Button
                        variant="contained"
                        sx={{ backgroundColor: "#1EB854" }}
                        disabled
                      >
                        Sell
                      </Button>
                    </Grid>

                    <Grid item xs={3}>
                      <Button
                        variant="contained"
                        sx={{ backgroundColor: "#1EB854" }}
                        disabled
                      >
                        Create Auction
                      </Button>
                    </Grid>
                  </Grid>
                )}
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Typography
          sx={{ color: "white" }}
          className="seeOrders"
          variant="h3"
          align="center"
        >
          See Orders
        </Typography>
        <div className="OrderTable">
          <table border="1" width="100%">
            <tr>
              <td width="50%" bgcolor="#272935">
                <font color="#FFFFFF">Seller</font>
              </td>
              <td width="50%" bgcolor="#272935">
                <font color="#FFFFFF">Price in MATIC</font>
              </td>
              <td width="50%" bgcolor="#272935">
                <font color="#FFFFFF">Buy</font>
              </td>
            </tr>

            {Orders.map((x, i) => {
              return (
                <tr key={i}>
                  <td bgcolor="#FFFFFF" width="50%">
                    {x.seller}
                  </td>
                  <td bgcolor="#FFFFFF" width="50%">
                    {ethers.utils.formatEther(x.price)}
                  </td>
                  <td bgcolor="#FFFFFF" width="50%">
                    <Button
                      variant="contained"
                      sx={{ backgroundColor: "#1EB854" }}
                      onClick={() => buy(x.orderIndex, x.price)}
                    >
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
            <Button
              variant="contained"
              sx={{ backgroundColor: "#1EB854" }}
              onClick={() => setBuyState(false)}
            >
              No
            </Button>
            <Button
              variant="contained"
              sx={{ backgroundColor: "#1EB854" }}
              onClick={() => setBuyState(false)}
              autoFocus
            >
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
              label="price In MATIC"
              type="text"
              fullWidth
              variant="standard"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button variant="contained" onClick={() => setSellState(false)}>
              Cancel
            </Button>
            <Button
              variant="contained"
              sx={{ backgroundColor: "#1EB854" }}
              onClick={sell}
            >
              Sell
            </Button>
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
                  label="Starting Price in MATIC"
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
              label="Minimum Bid Incriment In MATIC"
              type="text"
              fullWidth
              variant="standard"
              value={MinIncrement}
              onChange={(e) => setMinIncriment(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button variant="contained" onClick={() => setAuctionState(false)}>
              Cancel
            </Button>
            <Button
              variant="contained"
              sx={{ backgroundColor: "#1EB854" }}
              onClick={() => createAuction()}
            >
              Create Auction
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    );
  }
};

export default Nft;

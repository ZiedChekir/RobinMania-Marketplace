import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { MarketplaceABI, MarketplaceAddress } from "../../config";
import { GameABI, GameAddress } from "../../config";
import { Grid,Container ,Box,Typography,Button} from "@mui/material";
import { ethers } from "ethers";

import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

//import { Button } from 'react-bootstrap';
import CardItem from "../../components/Card";
//import priceModal from "../../components/priceModal";
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
]


const nft = () => {
  const { query, isReady } = useRouter();
  const [showing, setShowing] = useState(false);

  const tokenId = query.tokenId;
  const [nft, setNft] = useState({});
  const [Orders, setOrders] = useState([]);
  const [price, setPrice] = useState("");
  const [state, setState] = useState(false);

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
    const NFTContract = new ethers.Contract(GameAddress, GameABI, signer);
    await NFTContract.setApprovalForAll(MarketplaceAddress, true);
    await MarketplaceContract.listItem(GameAddress, tokenId, price.toString());
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

    await MarketplaceContract.buyItem(
      GameAddress,
      tokenId,
      parseInt(orderIndex),
      {
        value: price.toString(),
      }
    );
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
    const account = await signer.getAddress()
    const data = await Contract.balanceOf(account, tokenId);
     nftjson['quantity'] = data
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
  const OpenPriceModel = () => {
    setState(true);
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
          <Grid item xs={4} >
            <img src={nft.image} height="450px"/>
          </Grid>
          <Grid item xs={8}>
          <Box  sx={{ 
        height: 450,p: 2, border: '3px solid #1EB854',borderRadius: '16px' }}>
                <Typography  variant="h2" align="center">{nft.name}</Typography>
                  <h5>Description:</h5>
                <Typography  style={{color:"grey"}}  variant="h6" >{nft.description}</Typography>
                
                 {nft.quantity >0 ? 
                  <Grid container spacing={2}>

                  <Grid item xs={6} >

                      <Button  variant="text">Sell</Button>
                  </Grid>
              
                  <Grid item xs={6} >
                      <Button  variant="text">Create Auction</Button>
                  </Grid>
            </Grid> 
            :
            <Grid container spacing={2}>

            <Grid item xs={6} >

                <Button disabled variant="text">Sell</Button>
            </Grid>
        
            <Grid item xs={6} >
                <Button disabled variant="text">Create Auction</Button>
            </Grid>
      </Grid> 
                }
                
                {/* <Grid container spacing={2}>

                      <Grid item xs={6} >

                          <Button disabled variant="text">Sell</Button>
                      </Grid>
                  
                      <Grid item xs={6} >
                          <Button disabled variant="text">Create Auction</Button>
                      </Grid>
                </Grid> */}

          </Box>
          </Grid>
        </Grid>
        {/* <CardItem
          key={1}
          title={nft.name}
          description={nft.description}
          image={nft.image}
          link={"/nft/" + 1}
        /> */}
        <div>
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
                    <button onClick={() => buy(x.orderIndex, x.price)}>
                      Buy
                    </button>
                  </td>
                </tr>
              );
            })}
          </table>
        </div>







        {state ? (
          <div className="modal-success">
            <div className="modal-cover" onClick={() => setState(false)}></div>
            <div className="modal-container">
              <div className="modal">
                <div className="modal-header">
                  <div className="modal-details">
                    <h4>Selling Item</h4>
                    <p>Name your price</p>
                    <div className="email-primary">
                      <label for="email">Price</label>
                      <div className="email-container">
                        <input
                          type="email"
                          placeholder="wei"
                          id="email"
                          className="email-input"
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="btn-primary" onClick={() => sell()}>
                    Sell
                  </button>
                  <button
                    className="btn-secondary"
                    onClick={() => setState(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}



<TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Seller</StyledTableCell>
            <StyledTableCell align="right">Price</StyledTableCell>
            <StyledTableCell align="right">Buy</StyledTableCell>
            
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <StyledTableRow key={row.name}>
              <StyledTableCell component="th" scope="row">
                {row.name}
              </StyledTableCell>
              <StyledTableCell align="right">{row.calories}</StyledTableCell>
              <StyledTableCell align="right">{row.fat}</StyledTableCell>
              <StyledTableCell align="right">{row.carbs}</StyledTableCell>
              <StyledTableCell align="right">{row.protein}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );


      </Container>
    );
  }
};

export default nft;

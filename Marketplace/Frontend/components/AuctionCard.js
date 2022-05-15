import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions, Grid } from '@mui/material';
import { blue } from '@mui/material/colors';
import { Stack } from '@mui/material';
import { Box } from '@mui/system';
import { LinearProgress } from '@mui/material';
import { Paper } from '@mui/material';
import { useState,useEffect } from 'react';
import { GameABI, GameAddress } from '../config';
import { ethers } from 'ethers';
export default function AuctionCard({auction}) {
  const [tokenImg, setTokenImg] = useState("")
  const ownerAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
  const truncateAddress = (address) => {
      return address.substring(0,4)+"..." + address.substring(39,address.length);
  }
  const fetchTokenImg = async (tokenID) => {
    const provider = new ethers.providers.JsonRpcProvider();
    const signer = provider.getSigner();
    const contract = new ethers.Contract(GameAddress,GameABI,signer);
    // const imgURI = await contract.uri(tokenID)
    // setTokenImg(imgURI)
    const balance = await contract.ownerAddress()
    console.log(balance)
  }
  useEffect(() => {
    fetchTokenImg(auction.tokenID)
  }, [])
  
  return (
    <Card sx={{ maxWidth: 320 ,color:"#1EB854", backgroundColor:"#272935"}} elevation={10}>
      <CardActionArea>
        <CardMedia
          component="img"
          image={tokenImg}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Bow
          </Typography>
          <Typography variant="body2" color="white">
            3 points of dmg
          </Typography>
          <Paper sx={{
                    width:'100%',
                    height: 50,
                    backgroundColor : '#110e0e'
                }}>
            <Stack alignItems="center">
                <Typography color={'white'} fontSize={15}>15Hrs:20Mins:22Sec</Typography>
                <Box sx={{width: '90%' , paddingTop:1}}>
                    <LinearProgress variant="determinate" value={50} />
                </Box>
            </Stack>
          </Paper>
          <Grid container>
            <Grid item xs={6}>
              <Stack>
              <Typography>
                Starting Price :
              </Typography>
              <Typography>
                5 KAI
              </Typography>
              </Stack>
            </Grid>
            <Grid item xs={6}>
            <Stack>
              <Typography>
                Current Price :
              </Typography>
              <Typography>
                5 KAI
              </Typography>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </CardActionArea>
      <CardActions >
        <Button size="small" sx={{backgroundColor:"#1EB854"}} variant="contained">
          Place Bid
        </Button>
        <Stack style={{paddingLeft:100}}>
        <Typography>
            NFT Owner :
        </Typography>
        <Typography>
            {truncateAddress(ownerAddress)}
        </Typography>
        </Stack>
        
      </CardActions>
    </Card>
  );
}

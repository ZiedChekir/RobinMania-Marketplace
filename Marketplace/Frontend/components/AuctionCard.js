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
import { useState,useEffect,useRef } from 'react';
import { GameABI, GameAddress } from '../config';
import { ethers } from 'ethers';
export default function AuctionCard({auction}) {
  const [timerDays,setTimerDays] = useState('00');
  const [timerHours,setTimerHours] = useState('00');
  const [timerMinutes,setTimerMinutes] = useState('00');
  const [timerSeconds,setTimerSeconds] = useState('00');
  const [tokenImg, setTokenImg] = useState("")
  const [tokenName,setTokenName] = useState("")
  const [tokenDescription,setTokenDescription] = useState("")
  let interval = useRef()
  const startTimer = () => { 
    interval = setInterval(()=> {
      const now = Math.floor((new Date().getTime()) / 1000);
      console.log(now)
      
      const distance = auction.auctionEnd.toNumber() - now;
      console.log(distance)
      const days = Math.floor(distance / (60*60*24))
      const hours = Math.floor((distance % (60*60*24)) / (60*60))
      const minutes = Math.floor((distance % (60*60))/60)
      const seconds = Math.floor(distance % (60))
      if(distance > 0){
        setTimerDays(days)
        setTimerHours(hours)
        setTimerMinutes(minutes)
        setTimerSeconds(seconds)
      }else {
        clearInterval(interval.current)
      }
      
    },1000)
    
  }
  useEffect(()=> {
    startTimer()
  })
  const truncateAddress = (address) => {
      return address.substring(0,4)+"..." + address.substring(39,address.length);
  }
  const fetchToken = async (tokenID) => {
    const provider = new ethers.providers.JsonRpcProvider();
    const signer = provider.getSigner();
    const contract = new ethers.Contract(GameAddress,GameABI,signer);
    const URI = await contract.uri(tokenID)
    const response = await fetch(
      URI,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );
    const responseJson = await response.json();
    setTokenImg(responseJson.image)
    setTokenName(responseJson.name)
    setTokenDescription(responseJson.description)
  }
  useEffect(() => {
    fetchToken(auction.tokenID)
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
            {tokenName}
          </Typography>
          <Typography variant="body2" color="white">
            {tokenDescription}
          </Typography>
          <Paper sx={{
                    width:'100%',
                    height: 50,
                    backgroundColor : '#110e0e'
                }}>
            <Stack alignItems="center">
                <Typography color={'white'} fontSize={15}>{timerDays}:{timerHours}:{timerMinutes}:{timerSeconds}</Typography>
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
                {ethers.utils.formatEther(auction.startPrice)}
              </Typography>
              </Stack>
            </Grid>
            <Grid item xs={6}>
            <Stack>
              <Typography>
                Current Price :
              </Typography>
              <Typography>
                {ethers.utils.formatEther(auction.highestBid)}
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
            {truncateAddress(auction.seller)}
        </Typography>
        </Stack>
        
      </CardActions>
    </Card>
  );
}

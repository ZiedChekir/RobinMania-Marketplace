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
import { GameABI, GameAddress, NftAuctionABI, NftAuctionAddress } from '../config';
import { ethers } from 'ethers';
import toast from 'react-hot-toast';
import { Dialog,DialogTitle,DialogContent,DialogContentText,TextField,DialogActions } from '@mui/material';
export default function AuctionCard({ CardType,auction,loadEndedAuctions,loadAuctions}) {
  const [timerDays,setTimerDays] = useState('00');
  const [timerHours,setTimerHours] = useState('00');
  const [timerMinutes,setTimerMinutes] = useState('00');
  const [timerSeconds,setTimerSeconds] = useState('00');
  const [progress,setProgress] = useState(100);
  const [tokenImg, setTokenImg] = useState("")
  const [tokenName,setTokenName] = useState("")
  const [tokenDescription,setTokenDescription] = useState("")
  const [bid,setBid] = useState("")
  const [placeBidStatus,setPlaceBidStatus] = useState(false)
  let interval = useRef()
  const startTimer = () => { 
    interval = setInterval(()=> {
      const now = Math.floor((new Date().getTime()) / 1000);
      const distance = auction.auctionEnd.toNumber() - now;
      const days = Math.floor(distance / (60*60*24))
      const hours = Math.floor((distance % (60*60*24)) / (60*60))
      const minutes = Math.floor((distance % (60*60))/60)
      const seconds = Math.floor(distance % (60))
      if(distance >= 0){
        setTimerDays(days)
        setTimerHours(hours)
        setTimerMinutes(minutes)
        setTimerSeconds(seconds)
        setProgress((100*(now-auction.auctionStartedAt))/(auction.auctionEnd-auction.auctionStartedAt))
      }else {
        clearInterval(interval.current)
      }
      
      
    },1000)
    
  }
  useEffect(()=> {
    startTimer()
  },[])
  const handlePlaceBid = () => {
    setPlaceBidStatus(true)
  }
  const placeBid = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(
      NftAuctionAddress,
      NftAuctionABI,
      signer
    )
    const toastId = toast.loading('Waiting...',{duration:3000});
    const result = await contract.placeBid(auction.tokenID,auction.index,{value: ethers.utils.parseEther(bid)})
    result.wait()
    toast.dismiss(toastId);
    if(result["hash"].length == 66) toast.success('Successfully placed bid!');
    else toast.error("error")
    
    setPlaceBidStatus(false)
    
    
  }

  const Claim = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(
      NftAuctionAddress,
      NftAuctionABI,
      signer
    )
    const toastId = toast.loading('Waiting...',{duration:3000});
    const result = await contract.AuctionEnd(GameAddress,auction.tokenID,auction.index)
    result.wait()
    toast.dismiss(toastId);
    if(result["hash"].length == 66) toast.success('Successfully claimed the item!');
    else toast.error("error")
    setPlaceBidStatus(false)

  }

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
                <Typography color={'white'} fontSize={15}>{timerDays}D:{timerHours}H:{timerMinutes}M:{timerSeconds}S</Typography>
                <Box sx={{width: '90%' , paddingTop:1}}>
                    <LinearProgress variant="determinate" value={progress} color='secondary'/>
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

      {CardType == 0 && <Button onClick={handlePlaceBid} size="small" sx={{backgroundColor:"#1EB854"}} variant="contained">
          Place Bid
        </Button>}
          {CardType == 1 && <Button onClick={handlePlaceBid} size="small" sx={{backgroundColor:"#1EB854"}} variant="contained">
          Claim
        </Button>}
        <Stack style={{paddingLeft:100}}>
        <Typography>
            NFT Owner :
        </Typography>
        <Typography>
            {truncateAddress(auction.seller)}
        </Typography>
        </Stack>
        
      </CardActions>
      <Dialog open={placeBidStatus} onClose={()=>setPlaceBidStatus(false)}>
        <DialogTitle>Confirmation</DialogTitle>
        {CardType == 0 && 
        <DialogContent>
       
          <DialogContentText>
            Name your Bid in KAI! it sould be higher than {ethers.utils.formatEther(auction.highestBid.add(auction.minBidIncrement))} KAI
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Bid"
            type="text"
            fullWidth
            variant="standard"
            value={bid}
            onChange={(e)=>setBid(e.target.value)}
          />

        </DialogContent>
}

{CardType == 1 && 
        <DialogContent sx={{width:250}}>
       
          <DialogContentText>
            Claim your item 
          </DialogContentText>
       

        </DialogContent>
}
        <DialogActions>
          <Button onClick={()=>setPlaceBidStatus(false)}>Cancel</Button>

          {CardType == 0 && <Button onClick={placeBid}>Place a Bid</Button>}
          {CardType == 1 && <Button onClick={Claim}>Claim</Button>}

        </DialogActions>
      </Dialog>
    </Card>
  );
}

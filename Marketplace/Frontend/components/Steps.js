import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Icon, IconButton, Container, Grid } from '@mui/material';

import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ExploreIcon from '@mui/icons-material/Explore';
import StorefrontIcon from '@mui/icons-material/Storefront';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

const steps = ['Setup your wallet', 'Explore NFTs', 'Place a bid or buy', 'List your items for sale'];

const description=["Once You've Set Up Your Wallet, Connect it by Clicking the CONNECT WALLET Button in The Top Right Corner",
                  "Set Up Your Collection. Explore items and Collections",
                  "Choose Your Items and place a Higher Bid or Buy Them",
                  "Choose Between Auctions, Price Listings. You Choose How You Want To Sell Your NFTs. & We Help You!"];

const icons={
  1: <AccountBalanceWalletIcon />,
  2: <ExploreIcon />,
  3: <StorefrontIcon />,
  4: <MonetizationOnIcon />,
};

export default function Steps() {
  return (
    <Container>
    <Grid container alignItems="stretch" rowSpacing={3} columnSpacing={3} >

        <Grid 
          item
          xs={12}
          md={6}
          lg={3}
          style={{display: 'flex'}}
        >
    <Card sx={{ minWidth: 275, backgroundColor:"#272935" }} variant="outlined" style={{display: 'flex', justifyContent: 'space-between', flexDirection: 'column', }}>
      <CardContent>
      <IconButton sx={{ p: 0, color:"#1EB854" }} style={{variant:"contained" }}>
                <Icon style={{fontSize: 60,textAlign: 'center'}}>
                  <AccountBalanceWalletIcon fontSize="large" style={{height: '100%'}}/>
                </Icon>
              </IconButton>
        <Typography variant="h5" component="div" sx={{color:"white"}}>
        Setup your wallet
        </Typography>
        <br />
        <Typography variant="body2" sx={{color:"white"}}>
        Once You've Set Up Your Wallet, Connect it by Clicking the CONNECT WALLET Button in The Top Right Corner
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" color="secondary">Learn More</Button>
      </CardActions> 
    </Card>
    </Grid>
  

<Grid
item
xs={12}
md={6}
lg={3}
style={{display: 'flex'}}
>
<Card sx={{ minWidth: 275, backgroundColor:"#272935" }} variant="outlined" style={{display: 'flex', justifyContent: 'space-between', flexDirection: 'column'}}>
<CardContent>
<IconButton sx={{ p: 0, color:"#1EB854" }}>
      <Icon style={{fontSize: 60,textAlign: 'center'}}>
        <ExploreIcon fontSize="large" style={{height: '100%'}}/>
      </Icon>
    </IconButton>
<Typography variant="h5" component="div" sx={{color:"white"}}>
Explore NFTs
</Typography>
<br />
<Typography variant="body2" sx={{color:"white"}}>
Set Up Your Collection. Explore items and Collections
</Typography>
</CardContent>
<CardActions>
<Button size="small" color="secondary">Learn More</Button>
</CardActions> 
</Card>
</Grid>


<Grid
item
xs={12}
md={6}
lg={3}
style={{display: 'flex'}}
>
<Card sx={{ minWidth: 275, backgroundColor:"#272935" }} variant="outlined" style={{display: 'flex', justifyContent: 'space-between', flexDirection: 'column'}}>
<CardContent>
<IconButton sx={{ p: 0, color:"#1EB854" }}>
      <Icon style={{fontSize: 60,textAlign: 'center'}}>
        <StorefrontIcon fontSize="large" style={{height: '100%'}}/>
      </Icon>
    </IconButton>
<Typography variant="h5" component="div" sx={{color:"white"}}>
Place a bid or buy
</Typography>
<br />
<Typography variant="body2" sx={{color:"white"}}>
Choose Your Items and place a Higher Bid or Buy Them
</Typography>
</CardContent>
<CardActions>
<Button size="small" color="secondary">Learn More</Button>
</CardActions> 
</Card>
</Grid>

<Grid
item
xs={12}
md={6}
lg={3}
style={{display: 'flex'}}
>
<Card sx={{ minWidth: 275, backgroundColor:"#272935" }} variant="outlined" style={{display: 'flex', justifyContent: 'space-between', flexDirection: 'column'}}>
<CardContent>
<IconButton sx={{ p: 0, color:"#1EB854" }}>
      <Icon style={{fontSize: 60,textAlign: 'center'}}>
        <MonetizationOnIcon fontSize="large" style={{height: '100%'}} />
      </Icon>
    </IconButton>
<Typography variant="h5" component="div" sx={{color:"white"}}>
List your items for sale
</Typography>
<br />
<Typography variant="body2" sx={{color:"white"}}>
Choose Between Auctions, Price Listings. You Choose How You Want To Sell Your NFTs. & We Help You!
</Typography>
</CardContent>
<CardActions>
<Button size="small" color="secondary">Learn More</Button>
</CardActions> 
</Card>
</Grid>


</Grid>
</Container>
  )
    };
  
import Container from "@mui/material/Container";
import Hero from '../components/Hero'
import Cards from "../components/Slider";
import Steps from '../components/Steps'
import { Typography } from "@mui/material";
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';
import Trending from "../components/Trending";


const Homepage = () => {
  return (
    <Container >


    <Hero />


    <div style={{ justifyContent: "center", alignItems: "baseline", direction: "column"}}>
    
    <Typography className="ActiveAuctions" sx={{ color: "white", margin:"0 0 0 0"}} variant="h3" align="left" gutterBottom="false" noWrap>
    <Typography className="ActiveAuctions" sx={{color:"#1EB854", margin:"0 0 0 0"}} variant="h5" align="left" gutterBottom="false"  noWrap>
        <HorizontalRuleIcon fontSize="small" />
        Live Auctions
      </Typography>
      Trending Auctions
      </Typography>
    </div>
      
    <Cards />


    <div style={{ justifyContent: "center", alignItems: "baseline", direction: "column"}}>
    <Typography className="ActiveAuctions" sx={{ color: "white", margin:"0 0 0 0"}} variant="h3" align="left" gutterBottom="false" noWrap>
    <Typography className="ActiveAuctions" sx={{color:"#1EB854", margin:"0 0 0 0"}} variant="h5" align="left" gutterBottom="false"  noWrap>
        <HorizontalRuleIcon fontSize="small" />
        Trending
      </Typography>
      Trending NFTs
      </Typography>
      </div>
   <Trending />


   <div style={{ justifyContent: "center", alignItems: "baseline", direction: "column"}}>
   <Typography className="ActiveAuctions" sx={{ color: "white", margin:"0 0 0 0"}} variant="h3" align="left" gutterBottom="false" noWrap>
    <Typography className="ActiveAuctions" sx={{color:"#1EB854", margin:"0 0 0 0"}} variant="h5" align="left" gutterBottom="false"  noWrap>
        <HorizontalRuleIcon fontSize="small" />
        Steps for sell and buy
      </Typography>
      Easy steps to follow to buy and sell items
      </Typography>
      </div>
      <Steps />

    
    </Container>
  );
};

export default Homepage;
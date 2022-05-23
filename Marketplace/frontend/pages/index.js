import Container from "@mui/material/Container";
import Hero from '../components/Hero'
import Cards from "../components/Slider";
import CustomizedSteppers from '../components/Steps'
import { Typography } from "@mui/material";
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';


const Homepage = () => {
  return (
    <Container >


    <Hero />


    <div style={{ justifyContent: "center", alignItems: "baseline", direction: "column"}}>
    
    <Typography className="ActiveAuctions" sx={{ color: "white", margin:"0 0 0 0"}} variant="h2" align="left" gutterBottom="false" noWrap>
    <Typography className="ActiveAuctions" sx={{color:"#1EB854", margin:"0 0 0 0"}} variant="h5" align="left" gutterBottom="false"  noWrap>
        <HorizontalRuleIcon fontSize="small" />
        Live Auctions
      </Typography>
      Trending Auctions
      </Typography>
    </div>
      
    <Cards />

   

    
    </Container>
  );
};

export default Homepage;
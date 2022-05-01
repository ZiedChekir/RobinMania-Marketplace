import { Box, Grid } from "@mui/material";
import Image from "next/image";
import Typography from "@mui/material/Typography";
import MuiNextLink from "../components/MuiNextLink";
import Button from "@mui/material/Button";
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    height: '80vh',
    position: 'relative',
    '& video': {
      objectFit: 'cover',
    },
  },
  
}));

const Hero = () => {
  const classes = useStyles();
  return (
    <section className={classes.root}>
      <Grid container spacing={5} justifyContent="space-around" alignItems="center">

        <Grid
         item 
        xs={12} 
        sm={7} 
        md={7}
        lg={7}
        container 
        flexDirection="column" 
        justifyContent="center" 
        alignItems="flex-start" 
        >
            <Typography component="h2" variant="h4" textAlign="flex-start" gutterBottom>
                A Japanese Chef Who Love Western Food
            </Typography>
            <Typography textAlign="flex-start" sx={{ mb: 5 }}>
                {`We mix Japanese and Western ingredients and cooking methods. Provide you
                    with a different tasting dimension with the fusion food in our restaurant.
                    Don't miss the chance to surprise your tongue!`}
            </Typography>
            <MuiNextLink href="/explore" underline="none">
                <Button variant="outlined" size="large">
                    Explore
                </Button>
            </MuiNextLink>
        </Grid>

        <Grid
         item  
        sm={1} 
        md={1}
        lg={1}
        container 
        flexDirection="column" 
        justifyContent="center" 
        alignItems="center"
        ></Grid>

        <Grid 
        item 
        xs={12} 
        sm={4} 
        md={4}
        lg={4}>
            <Image
            src="/peepo-peepoblush.gif"
            alt="peepoblush"
            layout="responsive"
            width={800}
            height={600}
            />
        </Grid>
        
      </Grid>
      </section>
  );
};

export default Hero;





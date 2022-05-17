import React, { useEffect, useState } from 'react';
import { makeStyles } from '@mui/styles';
import { Collapse } from '@mui/material';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Grid, Box, Container } from '@mui/material';
import ReactPlayer from 'react-player';


const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    height: '100vh',
    fontFamily: 'Nunito',
  },
  gridContainer: {
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  appbar: {
    background: 'none',
  },
  appbarWrapper: {
    width: '80%',
    margin: '0 auto',
  },
  appbarTitle: {
    flexGrow: '1',
  },
  icon: {
    color: '#fff',
    // fontSize: '2rem',
  },
  colorText: {
    color: '#5AFF3D',
  },
  container: {
    textAlign: 'left',
  },
  title: {
    color: '#fff',
    // fontSize: '4.5rem',
  },
  goDown: {
    color: '#5AFF3D',
    // fontSize: '4rem',
  },
}));
export default function Hero() {
  const classes = useStyles();
  const [checked, setChecked] = useState(false);
  useEffect(() => {
    setChecked(true);
  }, []);
  
  return (
    <div className={classes.root} id="hero">
      <Box className={classes.heroBox}>
        <Grid container className={classes.gridContainer}>
          <Grid item xs={12} md={9}>
            <Collapse
              in={checked}
              {...(checked ? { timeout: 1000 } : {})}
              collapsedheight={50}
            >
              <div className={classes.container}>
                <Typography variant="h1" className={classes.title}>
                  Welcome to <br />
                  Our<span className={classes.colorText}> Marketplace.</span>
                </Typography>
                {/* <Scroll to="place-to-visit" smooth={true}>
            <IconButton>
              <ExpandMoreIcon className={classes.goDown} />
            </IconButton>
          </Scroll> */}
              </div>
            </Collapse>

            <Button
              variant="contained"
              color="primary"
              sx={{ width: '200px', fontSize: '16px' }}
            >
              Explore
            </Button>
          </Grid>

          <Grid item xs={12} md={3}>
            <Box
              sx={{
                width: 512,
                height: 288,
                backgroundColor: 'primary.dark',
                '&:hover': {
                  backgroundColor: 'primary.main',
                  opacity: [0.9, 0.8, 0.7],
                },
              }}
            >
              <ReactPlayer
                url={"./some-action-2_PUXcq8Mh.mp4"}
                playing
                loop
                muted
                width="100%"
                height="100%"
              />
            </Box>
          </Grid>
        </Grid>
      </Box>

    </div>
  );
}



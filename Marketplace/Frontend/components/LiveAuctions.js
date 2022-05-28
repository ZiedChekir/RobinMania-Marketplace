import * as React from 'react';
import Grid from '@mui/material/Grid';
import { makeStyles } from '@mui/styles';
import AuctionCard from './AuctionCard';
import Auctions from '../pages/auctions';

const useStyles = makeStyles({
  auctionCardGrid: {
    margin: 0,
    display: 'flex',
    justifyContent: "space-between", 
  },
});

const LiveAuctions = () => {
  const classes = useStyles();
  return (
    <div style={{ maxWidth: '100%' , overflow:'hidden'}}>
      <Auctions />
    </div>
  );
};

export default LiveAuctions;
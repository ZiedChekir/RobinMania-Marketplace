import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions } from '@mui/material';
import Link from 'next/link';
export default function NftCard(props) {
  return (
      <Link href={props.link}>
    <Card sx={{ maxWidth: 320,color:"#1EB854", backgroundColor:"#272935",}}>
      <CardActionArea>
        <CardMedia
          component="img"
          image={props.image}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
           {props.title}
          </Typography>
          <Typography variant="body2"  color={'white'}>
            {props.description}
            <br/>
            {props.quantity ? "Quantity: "+ props.quantity : ""}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size="small" sx={{backgroundColor:"#1EB854",color:"white"}}>
            View NFT
        </Button>
      </CardActions>
    </Card>
    </Link>
  );
}

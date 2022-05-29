import React from 'react';
import { Button, IconButton,Icon, Typography, Grid, Container } from '@mui/material';
import Link from './MuiNextLink';

function Footer() {
  return (
    <div className='footer-container'>
      
      <div className='footer-links'>
        <div className='footer-link-wrapper'>
          <div className='footer-link-items'>
            <h2>About Us</h2>
            <Link href='https://discord.gg/PQ2XW5EURG'>Team</Link>
          </div>
          <div className='footer-link-items'>
            <h2>Contact Us</h2>
            <Link href='https://discord.gg/PQ2XW5EURG'>Contact</Link>
          </div>
        </div>
        <div className='footer-link-wrapper'>
          <div className='footer-link-items'>
            <h2>Collections</h2>
            <Link href='/explore'>Explore</Link>
          </div>
          <div className='footer-link-items'>
            <h2>Social Media</h2>
            <Link href='https://discord.gg/PQ2XW5EURG'>
            Discord&nbsp;
            <IconButton
                sx={{ p: 0, color: "#1EB854" }}
                style={{ variant: "contained" }}
              >
                <Icon style={{ fontSize: 30, textAlign: "center" }}>
                  <img style={{ height: "100%" }} src='Discord.png' />
                </Icon>
               
              </IconButton>
                
              </Link>
            
          </div>
        </div>
      </div>
      
      <section className='footer-subscription'>
        <p className='footer-subscription-heading'>
          Be updated with us
        </p>
        
        <div className='input-areas'>
        <Link href='https://discord.gg/PQ2XW5EURG'>
          <Button variant="outlined" color="lighter" Icon="Discord.png" >
          Join us!
          </Button>
          </Link>
        </div>
      </section>

    </div>
  );
}

export default Footer;



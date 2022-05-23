import React from 'react';
import { Button } from '@mui/material';
import Link from './MuiNextLink';

function Footer() {
  return (
    <div className='footer-container'>
      
      <div class='footer-links'>
        <div className='footer-link-wrapper'>
          <div class='footer-link-items'>
            <h2>About Us</h2>
            <Link href='/sign-up'>How it works</Link>
            <Link href='/'>Terms of Service</Link>
          </div>
          <div class='footer-link-items'>
            <h2>Contact Us</h2>
            <Link href='/'>Contact</Link>
            <Link href='/'>Support</Link>
            <Link href='/'>Sponsorships</Link>
          </div>
        </div>
        <div className='footer-link-wrapper'>
          <div class='footer-link-items'>
            <h2>Collections</h2>
            <Link href='/explore'>Explore</Link>
          </div>
          <div class='footer-link-items'>
            <h2>Social Media</h2>
            <Link href='/'>Instagram</Link>
            <Link href='/'>Facebook</Link>
            <Link href='/'>Youtube</Link>
            <Link href='/'>Twitter</Link>
          </div>
        </div>
      </div>
      
      <section className='footer-subscription'>
        <p className='footer-subscription-heading'>
          Be updated with us
        </p>
        
        <div className='input-areas'>
          <form>
            <input
              className='footer-input'
              name='email'
              type='email'
              placeholder='Your Email'
            />
          </form>
          <Button variant="outlined" color="lighter" >Subscribe</Button>
        </div>
      </section>

    </div>
  );
}

export default Footer;
import Link from "next/link";
import React from "react";
import Metamask from "./Metamask";
const Nabar = ()=>{

    return (
        <div>
          <Link href="/">Home</Link>
          <Link href="/explore">Explore</Link>
          <Link href="/collection">Collection</Link>
          
          <Metamask/>
        </div>
        
    )
}

export default Nabar;
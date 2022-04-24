
import {useRouter} from 'next/router'
import { useEffect, useState } from 'react';
//import { Button } from 'react-bootstrap';
import CardItem from '../../components/Card';
const nft =()=>{
    const router = useRouter();
    const tokenId = router.query.tokenId;
    
    const [nft , setNft] = useState({});
  useEffect(() => {
    FetchNftData();
  
    
  }, [])
  

   const  FetchNftData = async ()=>{
    
    const response = await fetch("https://raw.githubusercontent.com/SamiKammoun/robinmania/main/metadata/"+tokenId+".json", {
        headers: {
          'Accept': 'application/json'
        }
      })
      const nftjson = await response.json();
      console.log(nftjson)
      setNft(nftjson)
    }
    

    if(nft== {}) return <h1>Loading</h1>
    return (
    <div>
<CardItem
        
        title={nft.name}
        description={nft.description}
        image={nft.image}
        link ={"/nft/"+(1)}
      />    <Button >show nft</Button>
    </div>
    )
}

export default nft;
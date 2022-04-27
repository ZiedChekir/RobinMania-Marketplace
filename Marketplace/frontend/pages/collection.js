import { useWeb3React } from "@web3-react/core";
import { GameABI, GameAddress } from "../config";
import { useEffect, useState } from "react";
import CardItem from "../components/Card";
import { ethers } from "ethers";

const Collection = () => {
  const [Nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");
  const { active, account } = useWeb3React();

  useEffect(()=>{
    loadCollection();
  },[active]) // loadCollection when switch account
  const loadCollection = async () => {
    
    if(!active) return ;
    const provider = new ethers.providers.JsonRpcProvider();
    const signer = provider.getSigner();
    const Contract = new ethers.Contract(GameAddress, GameABI,signer);
    const data = await Contract.balanceOfBatch([account, account,account,account,account], [1, 2,3,4,5]);
    
    let nftArray = [];
    for (let i = 0; i < 5; i++) {
      let BalanceOfTokenID = data[i].toNumber();
      console.log(BalanceOfTokenID)
      if(BalanceOfTokenID ==0) break;
     
      const response = await fetch("https://raw.githubusercontent.com/SamiKammoun/robinmania/main/metadata/"+(i+1)+".json", {
        headers: {
          'Accept': 'application/json'
        }
      })
      
      
      const responseJson = await response.json();
      
       nftArray.push(responseJson)
     
      
    }

    setNfts(nftArray);
    console.log(Nfts)
    setLoadingState("loaded");
  };

 


  if (!active) return <h1>You need to connect your metamask account</h1>;
  // if(loadingState="not-loaded") return <h2>Loading</h2>
  // if (loadingState === "loaded" && collection.length > 0)
  //   return <h2>No Nfts owned</h2>;



  return (
    <section className="cards-primary">
        <div className="cards-header">
            <h1>
                My Collection
            </h1>
            <p>
                  Owned NFTs
            </p>
        </div>
        <div className="card-container">
        {Nfts.map((card,i)=>{
     
      return  <CardItem
        key={card.name}
        title={card.name}
        description={card.description}
        image={card.image}
        link ={"/nft/"+(i+1)}
      />
    })}
        </div>
    </section>
)



};

export default Collection;

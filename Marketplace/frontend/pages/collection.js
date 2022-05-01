import { GameABI, GameAddress } from "../config";
import { useEffect, useState } from "react";
import CardItem from "../components/Card";
import { ethers } from "ethers";

const Collection = () => {
  const [Nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");
  const [currentAccount, setCurrentAccount] = useState("")

  useEffect(()=>{
    ethereum.on('accountsChanged', (accounts) => {
      setCurrentAccount(accounts[0])
  });
    loadCollection();
    console.log("updated")
  },[currentAccount])
  const loadCollection = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const Contract = new ethers.Contract(GameAddress, GameABI,signer);
    const account = await signer.getAddress()
    const data = await Contract.balanceOfBatch([account, account,account,account,account], [1, 2,3,4,5]);
    
    let nftArray = [];
    for (let i = 0; i < 5; i++) {
      let BalanceOfTokenID = data[i].toNumber();
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
    setLoadingState("loaded");
  };
  if(Nfts.length == 0) return <h4>you don't have any items</h4>
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

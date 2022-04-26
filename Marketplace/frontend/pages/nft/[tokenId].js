import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { MarketplaceABI, MarketplaceAddress } from "../../config";
import { GameABI, GameAddress } from "../../config";

import { ethers } from "ethers";
//import { Button } from 'react-bootstrap';
import CardItem from "../../components/Card";
const nft = () => {
  const { query, isReady } = useRouter();
  const [showing, setShowing] = useState(false);

  const tokenId = query.tokenId;
  const [nft, setNft] = useState({});
  const [Orders, setOrders] = useState([]);


  useEffect(() => {
    setShowing(true);
    if (isReady) {
      FetchNftData();
      FetchOrders();
    }
  }, [query]);

  if (!showing) {
    return null;
  }

  const sell = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const MarketplaceContract = new ethers.Contract(
      MarketplaceAddress,
      MarketplaceABI,
      signer
    );
    const NFTContract = new ethers.Contract(GameAddress, GameABI, signer);
    await NFTContract.setApprovalForAll(MarketplaceAddress, true);
    await MarketplaceContract.listItem(GameAddress, tokenId, "23460000");
  };

  const buy = async (orderIndex,price) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const MarketplaceContract = new ethers.Contract(
      MarketplaceAddress,
      MarketplaceABI,
      signer
    );
    // const NFTContract = new ethers.Contract(GameAddress,GameABI,signer)
    //await NFTContract.setApprovalForAll(MarketplaceAddress, true);

    await MarketplaceContract.buyItem(GameAddress, tokenId, parseInt(orderIndex), {
      value: price.toString(),
    });
  };

  const FetchNftData = async () => {
    const response = await fetch(
      "https://raw.githubusercontent.com/SamiKammoun/robinmania/main/metadata/" +
        tokenId +
        ".json",
      {
        headers: {
          Accept: "application/json",
        },
      }
    );
    const nftjson = await response.json();
    console.log(nftjson);
    setNft(nftjson);
  };

  const FetchOrders = async () => {
    const provider = new ethers.providers.JsonRpcProvider();
    const signer = provider.getSigner();
    const Contract = new ethers.Contract(
      MarketplaceAddress,
      MarketplaceABI,
      signer
    );
    const ordersData = await Contract.getOrdersOf(tokenId);
    console.log((ordersData[0].price).toString())
    console.log((ordersData[0].seller))
    console.log((ordersData[0].index.toString()))
    const tempArray= []
    ordersData.map((order)=>{
        const orderJson = {seller:order.seller,price:order.price.toString(),orderIndex:order.index.toString()}
        tempArray.push(orderJson)

    })
    setOrders(tempArray)

  };

  if (typeof window === "undefined") {
    return <></>;
  } else {
    return (
      <div>
        <button onClick={FetchOrders}>fetchORders</button>
        <button onClick={sell}>sell</button>
        <button onClick={buy}>buy</button>
        <CardItem
          key={1}
          title={nft.name}
          description={nft.description}
          image={nft.image}
          link={"/nft/" + 1}
        />

        <div>
          <table border="1" width="100%" cellspacing="0" cellpadding="6">
            <tr>
              <td width="50%" bgcolor="#000000">
                <font color="#FFFFFF">Seller</font>
              </td>
              <td width="50%" bgcolor="#000000">
                <font color="#FFFFFF">Price</font>
              </td>
              <td width="50%" bgcolor="#000000">
                <font color="#FFFFFF">Buy</font>
              </td>
            </tr>

            {Orders.map((x)=>{
                return (<tr>
                    <td width="50%">{x.seller}</td>
                    <td width="50%">{x.price}</td>
                    <td width="50%"><button onClick={()=>buy(x.orderIndex,x.price)}>Buy</button></td>
                  </tr>)
            })}
            
           
          </table>
        </div>
      </div>
    );
  }
};

export default nft;

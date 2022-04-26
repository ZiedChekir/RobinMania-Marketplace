import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { MarketplaceABI, MarketplaceAddress } from "../../config";
import { GameABI, GameAddress } from "../../config";

import { ethers } from "ethers";
//import { Button } from 'react-bootstrap';
import CardItem from "../../components/Card";
import priceModal from "../../components/priceModal";

const nft = () => {
  const { query, isReady } = useRouter();
  const [showing, setShowing] = useState(false);

  const tokenId = query.tokenId;
  const [nft, setNft] = useState({});
  const [Orders, setOrders] = useState([]);
  const [price, setPrice] = useState("");
  const [state, setState] = useState(false);

  useEffect(() => {
    setShowing(true);
    if (isReady) {
    FetchOrders();
      FetchNftData();
      
    }
  }, [query, state]);

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
    await MarketplaceContract.listItem(GameAddress, tokenId, price.toString());
  };

  const buy = async (orderIndex, price) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const MarketplaceContract = new ethers.Contract(
      MarketplaceAddress,
      MarketplaceABI,
      signer
    );
    // const NFTContract = new ethers.Contract(GameAddress,GameABI,signer)
    //await NFTContract.setApprovalForAll(MarketplaceAddress, true);

    await MarketplaceContract.buyItem(
      GameAddress,
      tokenId,
      parseInt(orderIndex),
      {
        value: price.toString(),
      }
    );
  };

  async function FetchNftData() {
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

   async function  FetchOrders() {
    const provider = new ethers.providers.JsonRpcProvider();
    const signer = provider.getSigner();
    const Contract = new ethers.Contract(
      MarketplaceAddress,
      MarketplaceABI,
      signer
    );
    const ordersData = await Contract.getOrdersOf(tokenId);
    console.log(ordersData[0].price.toString());
    console.log(ordersData[0].seller);
    console.log(ordersData[0].index.toString());
    const tempArray = [];
    ordersData.map((order) => {
      const orderJson = {
        seller: order.seller,
        price: order.price.toString(),
        orderIndex: order.index.toString(),
      };
      tempArray.push(orderJson);
    });
    setOrders(tempArray);
  };
  const handleChange = (e) => {
    setPrice(e.target.value);
  };
  const OpenPriceModel = () => {
    setState(true);
  };
  if (typeof window === "undefined") {
    return <></>;
  } else {
    return (
      <div>
        <button onClick={FetchOrders}>fetchORders</button>
        <button onClick={OpenPriceModel}>sell</button>
        <button onClick={buy}>buy</button> <br />
        <input type="text" onChange={handleChange} />
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

            {Orders.map((x) => {
              return (
                <tr>
                  <td width="50%">{x.seller}</td>
                  <td width="50%">{x.price}</td>
                  <td width="50%">
                    <button onClick={() => buy(x.orderIndex, x.price)}>
                      Buy
                    </button>
                  </td>
                </tr>
              );
            })}
          </table>
        </div>
        {state ? (
          <div className="modal-success">
            <div className="modal-cover" onClick={() => setState(false)}></div>
            <div className="modal-container">
              <div className="modal">
                <div className="modal-header">
                 
                  
                  <div className="modal-details">
                    <h4>Selling Item</h4>
                    <p>Name your price</p>
                    <div className="email-primary">
                      <label for="email">Price</label>
                      <div className="email-container">
                    
                        <input
                          type="email"
                          placeholder="wei"
                          id="email"
                          className="email-input"
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    className="btn-primary"
                    onClick={() => sell()}
                  >
                    Sell
                  </button>
                  <button
                    className="btn-secondary"
                    onClick={() => setState(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    );
  }
};

export default nft;

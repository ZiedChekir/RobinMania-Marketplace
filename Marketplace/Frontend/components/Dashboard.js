import { MarketplaceABI, MarketplaceAddress } from "../config";
import OrdersTable from "../components/OrdersTable"
import { useEffect, useState } from "react";
import { ethers } from "ethers";

const Dashboard = () => {
  const [orders, setOrders] = useState([])
  const [avatars, setAvatars] = useState([])
  const [currentAccount, setCurrentAccount] = useState("")
  const fetchAvatars = async () => {
    const _avatars = [];
    for(let i = 1; i< 6; i++){
      const response = await fetch("https://raw.githubusercontent.com/SamiKammoun/robinmania/main/metadata/"+(i)+".json", {
        headers: {
          'Accept': 'application/json'
        }
      })
      const responseJson = await response.json()
      _avatars.push(responseJson.image)
      
    }
    setAvatars(_avatars);

  }
  const fetchOrders = async () => {
      //fetching orders here
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const Contract = new ethers.Contract(
        MarketplaceAddress,
        MarketplaceABI,
        signer
      );
      const data = []
      for(let tokenID=1;tokenID<6;tokenID++){
        const ordersData = await Contract.getOrdersOf(tokenID);
        const ownerAddress = await signer.getAddress()
        const ownerOrders = ordersData.filter((order) => order.seller == ownerAddress)
        ownerOrders.map((order) => {
          const orderJson = {
            index: order.index.toString(),
            tokenID: order.tokenID.toString(),
            price: ethers.utils.formatEther(order.price),
          };
          data.push(orderJson);
        });
  
      }
      setOrders(data)
    }
  useEffect(() => {
    ethereum.on('accountsChanged', (accounts) => {
        setCurrentAccount(accounts[0])
    });
    fetchOrders();
    fetchAvatars();
  }, [currentAccount])
  const removeItem = async (index,tokenID) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const Contract = new ethers.Contract(
      MarketplaceAddress,
      MarketplaceABI,
      signer
    );
   const result =  await Contract.removeListing(tokenID,index)
   result.wait()
    setOrders(orders.filter((order) => 
    order.tokenID.toString() != tokenID.toString() || order.index.toString() != index.toString()
    ))

  }
  
  return (
    <OrdersTable orders={orders} removeItem={removeItem} avatars={avatars}/>
  )
}

export default Dashboard
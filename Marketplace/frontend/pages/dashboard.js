import { useWeb3React } from "@web3-react/core";
import { MarketplaceABI, MarketplaceAddress } from "../config";
import OrdersTable from "../components/OrdersTable"
import { useEffect, useState } from "react";
import { Contract, ethers } from "ethers";
const dashboard = () => {
  const { active, account } = useWeb3React();
  const [orders, setOrders] = useState([])
  useEffect(() => {
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
        //TODO: need to place account instead of the actual address
        const ownerAddress = await signer.getAddress()
        const ownerOrders = ordersData.filter((order) => order.seller == ownerAddress)
        ownerOrders.map((order) => {
          const orderJson = {
            index: order.index.toString(),
            tokenID: order.tokenID.toString(),
            price: order.price.toString(),
          };
          data.push(orderJson);
        });
  
      }
      setOrders(data)
    }
    fetchOrders()
  }, [])
  const removeItem = async (index,tokenID) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const Contract = new ethers.Contract(
      MarketplaceAddress,
      MarketplaceABI,
      signer
    );
    await Contract.removeListing(tokenID,index)
    setOrders(orders.filter((order) => 
    order.tokenID.toString() != tokenID.toString() || order.index.toString() != index.toString()
    ))

  }
  
  return (
    <OrdersTable orders={orders} removeItem={removeItem}/>
  )
}

export default dashboard
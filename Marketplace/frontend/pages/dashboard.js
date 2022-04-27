import { useWeb3React } from "@web3-react/core";
import { MarketplaceABI, MarketplaceAddress } from "../config";
import OrdersTable from "../components/OrdersTable"
import { useEffect, useState } from "react";
import { ethers } from "ethers";
const dashboard = () => {
  const { active, account } = useWeb3React();
  const [orders, setOrders] = useState([])
  useEffect(() => {
    const fetchOrders = async () => {
      //fetching orders here
      const provider = new ethers.providers.JsonRpcProvider();
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
        const ownerOrders = ordersData.filter((order) => order.seller == "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266")
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
  }, [active])
  
  return (
    <OrdersTable orders={orders}/>
  )
}

export default dashboard
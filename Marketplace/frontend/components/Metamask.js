import React, { useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { injected } from "./connector";
import web3 from "web3";

export default function Metamask() {
  const { active, account, library, connector, chainId, activate, deactivate } =
    useWeb3React();

  const KARDIA_TESTNET = 242;
  async function CheckAndRequestNetworkSwitch() {
    //kardiachain rpc data
    if (chainId != KARDIA_TESTNET) {
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: web3.utils.toHex(242) }],
        });
      } catch (err) {
        // This error cod
        console.log(err);
      }
    }
  }

  async function connect() {
    try {
      await activate(injected);
      localStorage.setItem("isWalletConnected", true);
      await CheckAndRequestNetworkSwitch();
    } catch (err) {
      console.log(err);
    }
  }
  async function disconnect() {
    deactivate();
    localStorage.setItem("isWalletConnected", false);
  }
  async function test() {
    const contract = library.Contract(ContractAddress, ABI);
    console.log(contract.sayHello());
  }
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("chainChanged", () => {
        localStorage.setItem("isWalletConnected", false);

        window.location.reload();
      });
      window.ethereum.on("accountsChanged", () => {
        localStorage.setItem("isWalletConnected", false);

        window.location.reload();
      });
    }
    const connectWalletOnPageLoad = async () => {
      if (localStorage?.getItem("isWalletConnected") === "true") {
        try {
          await activate(injected);
        } catch (err) {
          console.log(err);
        }
      }
    };
    connectWalletOnPageLoad();
  }, []);

  return (
    <div>
      {active ? (
        <div>
          <span>address {account}</span>{" "}
          <li className="signup-link" onClick={disconnect}>Disconnect</li>
        </div>
      ) : (
        <li className="signup-link" onClick={connect}> Connect Metamask</li>
      )}
    </div>
  );
}

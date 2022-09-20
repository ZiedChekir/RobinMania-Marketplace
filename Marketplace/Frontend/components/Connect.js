import React from "react";
import { ethers } from "ethers";
import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import { Icon, Snackbar, SvgIcon } from "@mui/material";
import Alert from "@mui/material/Alert";

import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import Typography from "@mui/material/Typography";

const Connect = () => {
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [balance, setBalance] = useState("");
  const [currentAccount, setCurrentAccount] = useState("");
  const [chainId, setChainId] = useState(null);
  const [chainName, setChainName] = useState("");
  const [provider, setProvider] = useState(null);
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const truncateAddress = (address) => {
    return address.substring(0, 8) + "..." + address.substring(39, address.length);
  };
  const settings = [truncateAddress(currentAccount)];
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  useEffect(() => {
    if (!window.ethereum) return;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    provider
      .send("eth_requestAccounts", [])
      .then((accounts) => {
        if (accounts.length > 0) setCurrentAccount(accounts[0]);
      })
      .catch((e) => console.log(e));
    if (!currentAccount || !ethers.utils.isAddress(currentAccount)) return;
    ethereum.on("accountsChanged", (accounts) => {
      setCurrentAccount(accounts[0]);
    });
    window.ethereum.on("chainChanged", (network) => {
      provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(provider);
      setChainId(network);
      setOpenSnackBar(true);
    });

    provider.getBalance(currentAccount).then((result) => {
      setBalance(ethers.utils.formatEther(result));
    });
    provider.getNetwork().then((result) => {
      setChainId(result.chainId);
      setChainName(result.name);
    });
    if (chainId != "0x2328") {
      window.ethereum.request({
        id: 1,
        jsonrpc: "2.0",
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: "0x2328",
            rpcUrls: ["https://eth.bd.evmos.dev:8545"],
            chainName: "Evmos Testnet",
            blockExplorerUrls: ["https://evm.evmos.dev"],
            nativeCurrency: {
              name: "tEVMOS",
              symbol: "tEVMOS",
              decimals: 18,
            },
          },
        ],
      });
    } else {
      setOpenSnackBar(false);
    }
  }, [currentAccount, provider]);
  const onClickConnect = () => {
    if (!window.ethereum) {
      console.log("please install MetaMask!");
      return;
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    provider
      .send("eth_requestAccounts", [])
      .then((accounts) => {
        if (accounts.length > 0) setCurrentAccount(accounts[0]);
      })
      .catch((e) => console.log(e));
  };
  return (
    <>
      {!ethers.utils.isAddress(currentAccount) ? (
        <Button
          sx={{ color: "white" }}
          variant="outlined"
          onClick={() => {
            onClickConnect();
          }}
        >
          Connect Wallet
        </Button>
      ) : (
        // <h4>{currentAccount}</h4>

        <Box sx={{ flexGrow: 0 }}>
          <Tooltip title="See address" sx={{ backgroundColor: "black" }}>
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Icon style={{ fontSize: 60, textAlign: "center" }}>
                <img style={{ height: "100%" }} src="metamask-1.svg"></img>
              </Icon>
            </IconButton>
          </Tooltip>
          <Menu
            sx={{ mt: "45px" }}
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            {settings.map((setting) => (
              <MenuItem key={setting} onClick={handleCloseUserMenu}>
                <Typography textAlign="center">{setting}</Typography>
              </MenuItem>
            ))}
          </Menu>
        </Box>
      )}
      <Snackbar open={openSnackBar}>
        <Alert severity="warning">Please switch network!</Alert>
      </Snackbar>
    </>
  );
};
export default Connect;

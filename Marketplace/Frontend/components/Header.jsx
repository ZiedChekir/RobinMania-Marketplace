import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { styled } from "@mui/system";
import ResponsiveAppBar from './Navbar'

const Offset = styled("div")(({ theme }) => theme.mixins.toolbar);

export const navLinks = [
    { title: `Home`, path: `/` },
    { title: `Collection`, path: `/collection` },
    { title: `Explore`, path: `/explore` },
    { title: `Auctions`, path: `/auctions` },
  ];

const Header = () => {
  return (
    <>
      <ResponsiveAppBar navLinks={navLinks} />
      <Offset />
    </>
  );
};

export default Header;
import ActiveAuctions from "../components/ActiveAuctions";
import MyAuctions from "../components/MyAuctions";
import Aauctions from "../components/ActiveAuctions";
import { Typography } from "@mui/material";

const Auctions = () => {
  return (
    <>
      <MyAuctions />

      <Typography
        className="ActiveAuctions"
        sx={{ color: "white" }}
        variant="h1"
        align="center"
      >
        Active Auctions
      </Typography>
      <Aauctions />
    </>
  );
};

export default Auctions;

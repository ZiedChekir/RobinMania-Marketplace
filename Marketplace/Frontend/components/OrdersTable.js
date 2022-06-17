import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { DeleteForever } from "@mui/icons-material";
import { Avatar, Typography } from "@mui/material";
const OrdersTable = ({ orders, removeItem, avatars }) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow sx={{ backgroundColor: "black" }}>
            <TableCell sx={{ color: "white" }}>
              <Typography fontSize={20}>Image</Typography>
            </TableCell>
            <TableCell align="center" sx={{ color: "white" }}>
              <Typography fontSize={20}>TokenID</Typography>
            </TableCell>
            <TableCell align="center" sx={{ color: "white" }}>
              <Typography fontSize={20}>Price</Typography>
            </TableCell>
            <TableCell align="right" sx={{ color: "white" }}>
              <Typography fontSize={20}>Delete</Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => (
            <TableRow
              key={[order.index, order.tokenID]}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="orders">
                <Avatar
                  sx={{ width: 80, height: 90 }}
                  src={avatars[order.tokenID - 1]}
                ></Avatar>
              </TableCell>
              <TableCell align="center">
                <Typography fontSize={25}>{order.tokenID}</Typography>
              </TableCell>
              <TableCell align="center">
                <Typography fontSize={25}>{order.price} MATIC</Typography>
              </TableCell>
              <TableCell align="right">
                <DeleteForever
                  fontSize="large"
                  color="warning"
                  cursor="pointer"
                  onClick={() => removeItem(order.index, order.tokenID)}
                ></DeleteForever>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
export default OrdersTable;

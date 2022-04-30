import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { DeleteForever } from '@mui/icons-material';
import { Avatar } from '@mui/material';
const OrdersTable = ({orders,removeItem,avatars}) =>  {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Image</TableCell>
            <TableCell align="center">TokenID</TableCell>
            <TableCell align="center">Price</TableCell>
            <TableCell align="right">Delete</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => (
            <TableRow
              key={[order.index,order.tokenID]}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="orders">
                <Avatar src={avatars[order.tokenID -1 ]}></Avatar>
              </TableCell>
              <TableCell align="center">{order.tokenID}</TableCell>
              <TableCell align="center">{order.price}</TableCell>
              <TableCell align="right"><DeleteForever color="primary" cursor='pointer' onClick={() => removeItem(order.index,order.tokenID)}></DeleteForever></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
export default OrdersTable
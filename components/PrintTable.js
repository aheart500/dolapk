import { Component } from "react";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

class PrintTable extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const orders = this.props.orders;
    if (orders.length === 0) return null;
    return (
      <TableContainer component={Paper} className="printTable">
        <Table
          size="small"
          aria-label="simple table"
          style={{ direction: "rtl", fontSize: "0.8rem" }}
        >
          <TableHead>
            <TableRow dens>
              <TableCell>الطلب</TableCell>
              <TableCell>الأسم</TableCell>
              <TableCell align="right">الهاتف</TableCell>
              <TableCell align="right">العنوان</TableCell>
              <TableCell align="right">الطلب</TableCell>
              <TableCell align="right">ملاحظات</TableCell>

              <TableCell align="right">الشحن </TableCell>
              <TableCell align="right">التسليم</TableCell>
              <TableCell align="right">السعر</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order, i) => {
              let formedID = `${order.trackID}`;
              formedID =
                formedID.length >= 4
                  ? formedID
                  : formedID.length === 3
                  ? `0${formedID}`
                  : formedID.length === 2
                  ? `00${formedID}`
                  : formedID.length === 1
                  ? `000${formedID}`
                  : formedID;
              formedID = `DP${formedID}`;
              return (
                <TableRow key={i}>
                  <TableCell align="left">
                    {order.trackID ? formedID : ""}
                  </TableCell>
                  <TableCell>{order.customer.name}</TableCell>
                  <TableCell align="right">{order.customer.phone}</TableCell>
                  <TableCell align="right" style={{ width: "30rem" }}>
                    {order.customer.address}
                  </TableCell>
                  <TableCell align="right" style={{ width: "40rem" }}>
                    {order.details}
                  </TableCell>
                  <TableCell align="right" style={{ width: "30rem" }}>
                    {order.notes}
                  </TableCell>

                  <TableCell align="right">
                    {order.shipped ? "تم الشحن" : "قيد المعالجة"}
                  </TableCell>
                  <TableCell align="right">
                    {order.finished ? "تم التسليم" : "في انتظار التسليم"}
                  </TableCell>
                  <TableCell align="right">{`${order.price}$`}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
}
export default PrintTable;

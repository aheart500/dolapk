import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/react-hooks";
import Loader from "./Loader";
import { LAST_ORDERS } from "../GraphQL";
import { makeStyles } from "@material-ui/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Checkbox from "@material-ui/core/Checkbox";
import TableToolBar from "./TableToolBar";
const tableHeads = [
  "ID",
  "الأسم",
  "رقم الهاتف",
  "العنوان",
  "تفاصيل الطلب",
  "ملاحظات",
  "السعر",
  "الشحن",
  "الحالة",
  "فعَّال",
  "",
];

const useStyles = makeStyles((theme) => ({
  listItem: {
    backgroundColor: "gray",
    margin: "0.5rem",
    direction: "rtl",
  },
  listHeader: {
    backgroundColor: "gray",
    margin: "0.5rem",
    direction: "rtl",
    display: "flex",
  },
  table: {
    direction: "rtl",
  },
  tableContainer: {
    width: "95%",
    margin: " 1rem auto",
    overflow: "scroll",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
}));

const OrdersList = ({ list, showOrder, setOrder, addOrder, users, name }) => {
  const [orders, setOrders] = useState([]);
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState("");
  const { data, error, loading, fetchMore, refetch } = useQuery(LAST_ORDERS, {
    variables: { limit: 10, category: list === "all" ? "" : list, search },
  });
  const classes = useStyles();

  useEffect(() => {
    if (data) setOrders(data.lastOrders);
  }, [data]);

  const loadMore = () => {
    fetchMore({
      variables: { cursor: orders[orders.length - 1].id, search },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        const previousEntry = previousResult.lastOrders;
        const newOrders = fetchMoreResult.lastOrders;
        return {
          lastOrders: [...previousEntry, ...newOrders],
        };
      },
    });
  };

  const handleSelectall = (event) => {
    if (event.target.checked) {
      setSelected(orders.map((order) => order.id));
      return;
    }
    setSelected([]);
  };
  const handleClick = (event, id) => {
    if (event.target.id !== "s") {
      selected.includes(id)
        ? setSelected(selected.filter((orderId) => orderId !== id))
        : setSelected(selected.concat(id));
    }
  };
  const handleOrder = (id) => {
    setOrder(id);
    showOrder();
  };
  const numSelected = selected.length;
  const ordersCount = orders.length;

  if (!data) return <Loader />;
  return (
    <div>
      <div
        style={{
          width: "70%",
          margin: "2rem auto",
          display:
            name === "Omar Mohamed"
              ? "block"
              : name === "Mohamed Nasser"
              ? "block"
              : "none",
        }}
      >
        <h4>Online users:</h4>
        <ul style={{ color: "green" }}>
          <li>You</li>
          {users.map((user, i) => {
            return <li key={i}>{user}</li>;
          })}
        </ul>
      </div>
      <TableToolBar
        numSelected={numSelected}
        selected={selected}
        refetch={refetch}
        loadMore={loadMore}
        setSearch={setSearch}
        setSelected={setSelected}
        addOrder={addOrder}
        orders={orders}
      />
      <div className={classes.tableContainer} dir="rtl">
        <Table className={classes.table} size="small">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={numSelected > 0 && numSelected < ordersCount}
                  checked={ordersCount > 0 && numSelected === ordersCount}
                  onChange={handleSelectall}
                  inputProps={{ "aria-label": "select all orders" }}
                />
              </TableCell>
              {tableHeads.map((cell) => (
                <TableCell key={cell} align="right">
                  {cell}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order, index) => {
              const isItemSelected = selected.includes(order.id);
              const labelId = `enhanced-table-checkbox-${index}`;
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
                <TableRow
                  key={order.id}
                  hover
                  onClick={(event) => handleClick(event, order.id)}
                  role="checkbox"
                  aria-checked={isItemSelected}
                  tabIndex={-1}
                  selected={isItemSelected}
                  style={{
                    backgroundColor:
                      order.status === "تم التسليم"
                        ? "lightgreen"
                        : order.cancelled
                        ? "rgb(221, 115, 115)"
                        : isItemSelected
                        ? "rgba(245, 0, 87, 0.08)"
                        : "inherit",
                  }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isItemSelected}
                      inputProps={{ "aria-labelledby": labelId }}
                    />
                  </TableCell>
                  <TableCell
                    component="th"
                    id={labelId}
                    scope="row"
                    align="right"
                    style={{
                      direction: "ltr",
                    }}
                    padding="none"
                  >
                    {order.trackID ? formedID : ""}
                  </TableCell>
                  <TableCell align="right">{order.customer.name}</TableCell>
                  <TableCell align="right">{order.customer.phone}</TableCell>
                  <TableCell align="right">{order.customer.address}</TableCell>
                  <TableCell align="right">{order.details}</TableCell>
                  <TableCell align="right">{order.notes}</TableCell>
                  <TableCell align="right">{`${order.price.order}$ + ${
                    order.price.shipment
                  }$ = ${order.price.order + order.price.shipment}`}</TableCell>

                  <TableCell align="right">
                    <span
                      className={
                        order.status === "تم التسليم"
                          ? "tag finished"
                          : order.status === "في انتظار التسليم"
                          ? "tag waiting"
                          : order.status === "جاهز للشحن"
                          ? "tag processed"
                          : order.status === "تم التسليم للشحن"
                          ? "tag delievered"
                          : "tag processing"
                      }
                    >
                      {order.status}
                    </span>
                  </TableCell>
                  <TableCell align="right">
                    <span
                      className={
                        order.cancelled ? "tag cancelled" : "tag active"
                      }
                    >
                      {" "}
                      {order.cancelled ? "ملغي" : "فعَّال"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <button
                      id="s"
                      style={{
                        backgroundColor: "#2489d6",
                        color: "white",
                        padding: "5px",
                        cursor: "pointer",
                        border: "none",
                        borderRadius: "10px",
                      }}
                      onClick={() => handleOrder(order.id)}
                    >
                      عرض
                    </button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default OrdersList;

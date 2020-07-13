import React, { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";
import ReactToPrint from "react-to-print";
import Loader from "./Loader";
import {
  LAST_ORDERS,
  FINISH_ORDERS,
  UNFINISH_ORDERS,
  SHIP_ORDERS,
  UNSHIP_ORDERS,
  CANCEL_ORDERS,
  UNCANCEL_ORDERS,
  DELETE_ORDERS,
} from "../GraphQL";
import InputBase from "@material-ui/core/InputBase";

import { makeStyles } from "@material-ui/styles";
import { lighten, fade } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import SpellcheckIcon from "@material-ui/icons/Spellcheck";
import DeleteIcon from "@material-ui/icons/Delete";
import CachedIcon from "@material-ui/icons/Cached";
import {
  AddCircleOutline,
  RemoveCircleOutline,
  CheckCircleOutline,
  HighlightOff,
  Search,
} from "@material-ui/icons";
import { Button } from "@material-ui/core";
import PrintCards from "./PrintCards";
import PrintTable from "./PrintTable";

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

    toolbar: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(1),
    },
    highlight:
      theme.palette.type === "light"
        ? {
            color: theme.palette.secondary.main,
            backgroundColor: lighten(theme.palette.secondary.light, 0.85),
          }
        : {
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.secondary.dark,
          },
  },
  title: {
    marginLeft: "auto",
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      width: "auto",
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

const OrdersList = ({ list, showOrder, setOrder }) => {
  const [orders, setOrders] = useState([]);
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState("");
  const { data, error, loading, fetchMore, refetch } = useQuery(LAST_ORDERS, {
    variables: { limit: 10, category: list === "all" ? "" : list, search },
  });
  const [finishOrders] = useMutation(FINISH_ORDERS);
  const [unfinishOrders] = useMutation(UNFINISH_ORDERS);
  const [shipOrders] = useMutation(SHIP_ORDERS);
  const [unshipOrders] = useMutation(UNSHIP_ORDERS);
  const [cancelOrders] = useMutation(CANCEL_ORDERS);
  const [uncancelOrders] = useMutation(UNCANCEL_ORDERS);
  const [deleteOrders] = useMutation(DELETE_ORDERS);

  const classes = useStyles();
  const printCards = useRef();
  const printTable = useRef();

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
  const handleSearch = (e) => {
    setSearch(e.target.value);
    refetch();
  };
  const handleAction = async (action) => {
    try {
      switch (action) {
        case "finish": {
          await finishOrders({ variables: { ids: selected } });
          break;
        }
        case "unfinish": {
          await unfinishOrders({ variables: { ids: selected } });
          break;
        }
        case "ship": {
          await shipOrders({ variables: { ids: selected } });
          break;
        }
        case "unship": {
          await unshipOrders({ variables: { ids: selected } });
          break;
        }
        case "activate": {
          await uncancelOrders({ variables: { ids: selected } });
          break;
        }
        case "cancel": {
          await cancelOrders({ variables: { ids: selected } });
          break;
        }
        case "delete": {
          await deleteOrders({ variables: { ids: selected } });
          break;
        }
      }
      setSelected([]);
      refetch();
    } catch (e) {
      console.log(e);
    }
  };

  if (!data) return <Loader />;
  return (
    <div>
      <Toolbar className="toolbar-custom">
        {numSelected > 0 ? (
          <Typography
            className={classes.title}
            color="inherit"
            variant="subtitle1"
            component="div"
          >
            تم تحديد {numSelected} طلبات
          </Typography>
        ) : (
          <Typography
            className={classes.title}
            variant="h6"
            id="tableTitle"
            component="div"
          >
            الطلبات
          </Typography>
        )}

        <>
          <Button onClick={() => loadMore()} variant="contained">
            تحميل المزيد
          </Button>

          <Button
            onClick={() => refetch()}
            variant="contained"
            style={{ margin: "0.5rem" }}
          >
            إعادة التحميل
          </Button>
          <ReactToPrint
            trigger={() => (
              <Button variant="contained" style={{ margin: "0.5rem" }}>
                طباعة جدول
              </Button>
            )}
            content={() => printTable.current}
            pageStyle="@page { size: auto;  margin: 1rem;} @media print { body { -webkit-print-color-adjust: exact; } }"
          />
          <ReactToPrint
            trigger={() => (
              <Button variant="contained" style={{ margin: "0.5rem" }}>
                طباعة كروت
              </Button>
            )}
            content={() => printCards.current}
            pageStyle="@page { size: auto;  margin: 1rem;} @media print { body { -webkit-print-color-adjust: exact; } }"
          />
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <Search />
            </div>
            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              onChange={handleSearch}
              inputProps={{ "aria-label": "search" }}
            />
          </div>
        </>
        {selected.length > 0 && (
          <div className="little-icons">
            <Tooltip title="تم التسليم" onClick={() => handleAction("finish")}>
              <IconButton>
                <AddCircleOutline />
              </IconButton>
            </Tooltip>
            <Tooltip
              title="في انتظار التسليم"
              onClick={() => handleAction("unfinish")}
            >
              <IconButton>
                <RemoveCircleOutline />
              </IconButton>
            </Tooltip>
            <Tooltip title="تم الشحن" onClick={() => handleAction("ship")}>
              <IconButton>
                <SpellcheckIcon />
              </IconButton>
            </Tooltip>
            <Tooltip
              title="تحت المعالجة"
              onClick={() => handleAction("unship")}
            >
              <IconButton>
                <CachedIcon />
              </IconButton>
            </Tooltip>

            <Tooltip
              title="تحويل إلى فعَّال"
              onClick={() => handleAction("activate")}
            >
              <IconButton>
                <CheckCircleOutline />
              </IconButton>
            </Tooltip>
            <Tooltip title="إلغاء" onClick={() => handleAction("cancel")}>
              <IconButton>
                <HighlightOff />
              </IconButton>
            </Tooltip>
            <Tooltip title="حذف" onClick={() => handleAction("delete")}>
              <IconButton>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </div>
        )}
      </Toolbar>
      <div className={classes.tableContainer}>
        <Table className={classes.table}>
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
                  <TableCell align="right" style={{ width: "20rem" }}>
                    {order.customer.address}
                  </TableCell>
                  <TableCell align="right" style={{ width: "40rem" }}>
                    {order.details}
                  </TableCell>
                  <TableCell align="right" style={{ width: "30rem" }}>
                    {order.notes}
                  </TableCell>
                  <TableCell align="right">{`${order.price}$`}</TableCell>

                  <TableCell align="right">
                    <span
                      className={
                        order.shipped ? "tag processed" : "tag processing"
                      }
                    >
                      {" "}
                      {order.shipped ? "تم الشحن" : "قيد المعالجة"}
                    </span>
                  </TableCell>
                  <TableCell align="right">
                    <span
                      className={
                        order.finished ? "tag finished" : "tag waiting"
                      }
                    >
                      {" "}
                      {order.finished ? "تم التسليم" : "في انتظار التسليم"}
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
      <PrintCards
        ref={printCards}
        orders={orders.filter((order) => selected.includes(order.id))}
      />
      <PrintTable
        ref={printTable}
        orders={orders.filter((order) => selected.includes(order.id))}
      />
    </div>
  );
};

export default OrdersList;

import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import SpellcheckIcon from "@material-ui/icons/Spellcheck";
import DeleteIcon from "@material-ui/icons/Delete";
import CachedIcon from "@material-ui/icons/Cached";
import AddCircleOutline from "@material-ui/icons/AddCircleOutline";
import RemoveCircleOutline from "@material-ui/icons/RemoveCircleOutline";
import CheckCircleOutline from "@material-ui/icons/CheckCircleOutline";
import HighlightOff from "@material-ui/icons/HighlightOff";
import Search from "@material-ui/icons/Search";
import Button from "@material-ui/core/Button";
import PrintCards from "./PrintCards";
import PrintTable from "./PrintTable";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import PostAddIcon from "@material-ui/icons/PostAdd";
import InputBase from "@material-ui/core/InputBase";
import { makeStyles } from "@material-ui/styles";
import ReactToPrint from "react-to-print";
import { lighten, fade } from "@material-ui/core/styles";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import {
  UPDATE_ORDERS,
  CANCEL_ORDERS,
  UNCANCEL_ORDERS,
  DELETE_ORDERS,
} from "../GraphQL";
import { useMutation } from "@apollo/react-hooks";
import { useRef } from "react";
const useStyles = makeStyles((theme) => ({
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
  title: {
    marginLeft: "auto",
    fontFamily: "Cairo",
    [theme.breakpoints.down(800)]: {
      marginLeft: "unset",
      marginBottom: "0.5rem",
    },
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

const TableToolBar = ({
  numSelected,
  selected,
  refetch,

  setSearch,
  addOrder,
  setSelected,
  orders,
}) => {
  const classes = useStyles();

  const [updateOrders] = useMutation(UPDATE_ORDERS);
  const [cancelOrders] = useMutation(CANCEL_ORDERS);
  const [uncancelOrders] = useMutation(UNCANCEL_ORDERS);
  const [deleteOrders] = useMutation(DELETE_ORDERS);
  const printCards = useRef();
  const printTable = useRef();

  const handleSearch = (e) => {
    setSearch(e.target.value);
    refetch();
  };

  const handleAction = async (action, newStatus) => {
    try {
      switch (action) {
        case "updataStatus": {
          await updateOrders({
            variables: { ids: selected, status: newStatus },
          });
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

  return (
    <>
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
        <Button
          color="primary"
          variant="contained"
          size="large"
          className="addOrder"
          onClick={() => addOrder()}
          endIcon={<PostAddIcon />}
        >
          أضف طلب جديد
        </Button>
        <>
          <Button
            onClick={() => refetch()}
            variant="contained"
            style={{ margin: "0.5rem" }}
          >
            إعادة التحميل
          </Button>
          <ReactToPrint
            trigger={() => (
              <Button
                variant="contained"
                style={{ margin: "0.5rem" }}
                color="primary"
                disabled={numSelected < 1}
              >
                طباعة جدول
              </Button>
            )}
            content={() => printTable.current}
            pageStyle="@page { size: auto;  margin: 1rem;} @media print { body { -webkit-print-color-adjust: exact; } }"
          />
          <ReactToPrint
            trigger={() => (
              <Button
                variant="contained"
                style={{ margin: "0.5rem" }}
                color="secondary"
                disabled={numSelected < 1}
              >
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
            <Tooltip
              title="قيد المعالجة"
              onClick={() => handleAction("updataStatus", "قيد المعالجة")}
            >
              <IconButton>
                <RemoveCircleOutline />
              </IconButton>
            </Tooltip>
            <Tooltip
              title="جاهز للشحن"
              onClick={() => handleAction("updataStatus", "جاهز للشحن")}
            >
              <IconButton>
                <AddCircleOutline />
              </IconButton>
            </Tooltip>

            <Tooltip
              title="تم التسليم للشحن"
              onClick={() => handleAction("updataStatus", "تم التسليم للشحن")}
            >
              <IconButton>
                <SpellcheckIcon />
              </IconButton>
            </Tooltip>
            <Tooltip
              title="جاري توزيع الشحنة"
              onClick={() => handleAction("updataStatus", "جاري توزيع الشحنة")}
            >
              <IconButton>
                <CachedIcon />
              </IconButton>
            </Tooltip>
            <Tooltip
              title="تم التسليم"
              onClick={() => handleAction("updataStatus", "تم التسليم")}
            >
              <IconButton>
                <StarBorderIcon />
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
      <PrintCards
        ref={printCards}
        orders={orders.filter((order) => selected.includes(order.id))}
      />
      <PrintTable
        ref={printTable}
        orders={orders.filter((order) => selected.includes(order.id))}
      />
    </>
  );
};

export default TableToolBar;

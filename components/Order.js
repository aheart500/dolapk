import styles from "../styles/order.module.css";
import {
  GET_ORDER,
  UPDATE_ORDERS,
  CANCEL_ORDERS,
  UNCANCEL_ORDERS,
  DELETE_ORDERS,
} from "../GraphQL";
import Slider from "@material-ui/core/Slider";
import { useQuery, useMutation } from "@apollo/react-hooks";
import Loader from "./Loader";
import Switch from "@material-ui/core/Switch";
import { Button } from "@material-ui/core";

const marks = [
  {
    value: 0,
    label: "قيد المعالجة",
  },
  {
    value: 25,
    label: "جاهز للشحن",
  },
  {
    value: 50,
    label: "تم التسليم للشحن",
  },
  {
    value: 75,
    label: "جاري توزيع الشحنة",
  },
  {
    value: 100,
    label: "تم التسليم",
  },
];

const valueLabelFormat = (value) => {
  return value;
};
const Order = ({
  orderId,
  editOrder,
  backToList,
  setSelectedOrderId,
  addOrder,
}) => {
  const { data, error, loading, refetch } = useQuery(GET_ORDER, {
    variables: { id: orderId },
  });

  const [updataStatus] = useMutation(UPDATE_ORDERS, {
    variables: { ids: [orderId], status },
  });

  const [cancelOrder] = useMutation(CANCEL_ORDERS, {
    variables: { ids: [orderId] },
  });
  const [uncancelOrder] = useMutation(UNCANCEL_ORDERS, {
    variables: { ids: [orderId] },
  });
  const [deleteOrder] = useMutation(DELETE_ORDERS, {
    variables: { ids: [orderId] },
  });
  if (loading) return <Loader />;
  if (error) return <h1>Error</h1>;
  if (!data) return <h2>Sorry we didn't find your order</h2>;
  let order = data.getOrder;
  const handleAction = async (e, action, n) => {
    let newStatus = marks.find((mark) => mark.value === n);

    try {
      if (action === "update") {
        await updataStatus({
          variables: {
            ids: [orderId],
            status: newStatus.label,
          },
        });
      } else if (action === "cancel") {
        let checked = e.target.checked;
        checked ? await cancelOrder() : await uncancelOrder();
      } else {
        return;
      }
      refetch();
    } catch (e) {
      console.log(e);
    }
  };
  if (order) {
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

    const createdAt = new Date(parseInt(order.created_at))
      .toString()
      .replace("GMT+0200 (Eastern European Standard Time)", "");
    const updatedAt = new Date(parseInt(order.updated_at))
      .toString()
      .replace("GMT+0200 (Eastern European Standard Time)", "");
    const sliderDefault =
      order.status === "جاهز للشحن"
        ? 25
        : order.status === "تم التسليم للشحن"
        ? 50
        : order.status === "جاري توزيع الشحنة"
        ? 75
        : order.status === "تم التسليم"
        ? 100
        : 0;
    return (
      <div className={styles.orderContainer}>
        <div
          style={{
            textAlign: "center",
            display: "flex",
            justifyContent: "space-around",
          }}
        >
          <Button variant="outlined" onClick={() => backToList()}>
            العودة لقائمة الطلبات
          </Button>
          <Button variant="outlined" onClick={() => addOrder()}>
            إضافة طلب جديد
          </Button>
          <Button variant="outlined" onClick={() => refetch()}>
            إعادة تحميل الطلب
          </Button>
        </div>
        <div className={styles.row}>
          <div className={styles.right}>رقم الطلب</div>
          <div>{order.trackID ? formedID : ""}</div>
        </div>
        <div className={styles.row}>
          <div className={styles.right}>الأسم</div>
          <div>{order.customer.name}</div>
        </div>
        <div className={styles.row}>
          <div className={styles.right}>رقم الهاتف</div>
          <div>{order.customer.phone}</div>
        </div>
        <div className={styles.row}>
          <div className={styles.right}>العنوان</div>
          <div>{order.customer.address}</div>
        </div>
        <div className={styles.row}>
          <div className={styles.right}>تفاصيل الطلب</div>
          <div>{order.details}</div>
        </div>
        <div className={styles.row}>
          <div className={styles.right}>ملاحظات</div>
          <div>{order.notes}</div>
        </div>
        <div className={styles.row}>
          <div className={styles.right}>السعر</div>
          <div dir="ltr">{`${order.price.order} EGP + ${
            order.price.shipment || "0"
          } EGP = ${order.price.order + order.price.shipment} EGP`}</div>
        </div>

        <div className={styles.row}>
          <div className={styles.right}>حالة الطلب</div>
          <div
            style={{
              margin: "1rem",
            }}
          >
            <span
              className={
                order.status === "تم التسليم"
                  ? "tag finished"
                  : order.status === "جاري توزيع الشحنة"
                  ? "tag waiting"
                  : order.status === "جاهز للشحن"
                  ? "tag processed"
                  : order.status === "تم التسليم للشحن"
                  ? "tag delievered"
                  : "tag processing"
              }
            >
              {" "}
              {order.status}
            </span>
          </div>
          <Slider
            value={sliderDefault}
            valueLabelFormat={valueLabelFormat}
            onChange={(e, n) => handleAction(e, "update", n)}
            step={null}
            valueLabelDisplay="auto"
            marks={marks}
            className="order-slider"
          />
        </div>
        <div className={styles.row}>
          <div className={styles.right}>فعّال</div>
          <div
            style={{
              margin: "1rem",
            }}
          >
            <span className={order.cancelled ? "tag cancelled" : "tag active"}>
              {" "}
              {order.cancelled ? "ملغي" : "فعَّال"}
            </span>
          </div>
          <Switch
            checked={order.cancelled}
            onChange={(e) => handleAction(e, "cancel")}
            name="checkedA"
            inputProps={{ "aria-label": "secondary checkbox" }}
          />
        </div>
        <div className={styles.row}>
          <div className={styles.right}>مُسَّجِل الطلب</div>
          <div>{order.created_by}</div>
        </div>
        <div className={styles.row}>
          <div className={styles.right}>تاريخ التسجيل</div>
          <div style={{ direction: "ltr" }}>{createdAt}</div>
        </div>
        <div className={styles.row}>
          <div className={styles.right}>مُعَّدِل الطلب</div>
          <div>{order.updated_by ? order.updated_by : "لم يتم التعديل"}</div>
        </div>
        <div className={styles.row}>
          <div className={styles.right}>تاريخ التعديل</div>
          <div style={{ direction: "ltr" }}>
            {order.updated_by ? updatedAt : ""}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin: "1rem",
          }}
        >
          <Button
            variant="contained"
            style={{
              margin: "0 1rem",
            }}
            color="primary"
            onClick={() => {
              editOrder(order);
            }}
          >
            تعديل الطلب
          </Button>
          <Button
            onClick={() => {
              setSelectedOrderId("");
              deleteOrder().catch((e) => console.log(e));
              backToList();
            }}
            variant="contained"
            color="secondary"
          >
            حذف الطلب
          </Button>
        </div>
      </div>
    );
  }
};

export default Order;

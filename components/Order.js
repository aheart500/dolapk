import React, { useState } from "react";
import styles from "../styles/order.module.css";
import {
  GET_ORDER,
  FINISH_ORDERS,
  UNFINISH_ORDERS,
  CANCEL_ORDERS,
  UNCANCEL_ORDERS,
  SHIP_ORDERS,
  UNSHIP_ORDERS,
  DELETE_ORDERS,
} from "../GraphQL";
import { useQuery, useMutation } from "@apollo/react-hooks";
import Loader from "./Loader";
import Switch from "@material-ui/core/Switch";
import { Button } from "@material-ui/core";
const Order = ({ orderId, editOrder, backToList, setSelectedOrderId }) => {
  const { data, error, loading, refetch } = useQuery(GET_ORDER, {
    variables: { id: orderId },
  });
  const [finishOrder] = useMutation(FINISH_ORDERS, {
    variables: { ids: [orderId] },
  });
  const [unfinishOrder] = useMutation(UNFINISH_ORDERS, {
    variables: { ids: [orderId] },
  });
  const [shipOrder] = useMutation(SHIP_ORDERS, {
    variables: { ids: [orderId] },
  });
  const [unshipOrder] = useMutation(UNSHIP_ORDERS, {
    variables: { ids: [orderId] },
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
  const handleAction = async (e, action) => {
    let checked = e.target.checked;
    try {
      if (action === "shipment") {
        checked ? await shipOrder() : await unshipOrder();
      } else if (action === "finish") {
        checked ? await finishOrder() : await unfinishOrder();
      } else if (action === "cancel") {
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
    return (
      <div className={styles.orderContainer}>
        <Button variant="outlined" onClick={() => backToList()}>
          العودة لقائمة الطلبات
        </Button>
        <Button variant="outlined" onClick={() => refetch()}>
          إعادة تحميل الطلب
        </Button>
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
          <div dir="ltr">{`${order.price} EGP`}</div>
        </div>
        <div className={styles.row}>
          <div className={styles.right}>حالة الشحن</div>
          <div
            style={{
              margin: "1rem",
            }}
          >
            <span
              className={order.shipped ? "tag processed" : "tag processing"}
            >
              {" "}
              {order.shipped ? "تم الشحن" : "قيد المعالجة"}
            </span>
          </div>
          <Switch
            checked={order.shipped}
            onChange={(e) => handleAction(e, "shipment")}
            name="checkedA"
            inputProps={{ "aria-label": "secondary checkbox" }}
          />
        </div>
        <div className={styles.row}>
          <div className={styles.right}>حالة الطلب</div>
          <div
            style={{
              margin: "1rem",
            }}
          >
            <span className={order.finished ? "tag finished" : "tag waiting"}>
              {" "}
              {order.finished ? "تم التسليم" : "في انتظار التسليم"}
            </span>
          </div>
          <Switch
            checked={order.finished}
            onChange={(e) => handleAction(e, "finish")}
            name="checkedA"
            inputProps={{ "aria-label": "secondary checkbox" }}
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
            onClick={() => console.log("dehk")}
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

import React, { useContext, useState } from "react";
import { useLazyQuery } from "@apollo/react-hooks";
import { GET_ORDER, GET_ORDER_SENSETIVE } from "../GraphQL";
import UserContext from "../Contexts/User/UserContext";
import { TextField, Button } from "@material-ui/core";
import styles from "../styles/order.module.css";
import Loader from "../components/Loader";

const track = () => {
  const {
    userState: { isLoggedIn },
  } = useContext(UserContext);
  const [trackId, setTrackId] = useState("");
  const [message, setMessage] = useState("");
  const [loadOrder, { loading, data, called }] = useLazyQuery(
    isLoggedIn ? GET_ORDER : GET_ORDER_SENSETIVE
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");
    let id = `${trackId}`;
    if (!id.toLowerCase().startsWith("dp")) {
      setMessage(
        "برجاء إدخال رقم الطلب بطريقة صحيحة ومراعاة الحروف التي في البداية"
      );
      return;
    }
    id = id.split("").slice(2).join("");
    if (id.length < 4) {
      setMessage(
        "برجاء إدخال رقم الطلب بطريقة صحيحة ومراعاة الحروف التي في البداية"
      );
      return;
    }

    loadOrder({ variables: { trackID: parseInt(id) } });
  };

  let formedID, createdAt, updatedAt;
  const order = data?.getOrder;
  if (order) {
    formedID = `${order.trackID}`;
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

    createdAt = new Date(parseInt(order.created_at))
      .toString()
      .replace("GMT+0200 (Eastern European Standard Time)", "");
    updatedAt = new Date(parseInt(order.updated_at))
      .toString()
      .replace("GMT+0200 (Eastern European Standard Time)", "");
  }
  return (
    <div
      style={{
        width: "90%",

        margin: "2rem auto",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <TextField
          value={trackId}
          onChange={(e) => setTrackId(e.target.value)}
          variant="filled"
          label="Track ID"
          style={{
            margin: "1rem 0",
          }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
          style={{
            alignSelf: "center",
          }}
        >
          عرض حالة الطلب
        </Button>
      </form>
      {loading && <Loader />}
      {message && (
        <p
          style={{
            fontFamily: "Cairo",
            color: "red",
            fontSize: "1.2rem",
            textAlign: "center",
            margin: "2rem 0",
          }}
        >
          {message}
        </p>
      )}
      {!order && called && (
        <p
          style={{
            fontFamily: "Cairo",
            color: "red",
            fontSize: "1.2rem",
            textAlign: "center",
            margin: "2rem 0",
          }}
        >
          هذا الطلب غير موجود
        </p>
      )}

      {order && (
        <div className={styles.orderContainer}>
          <div className={styles.row}>
            <div className={styles.right}>رقم الطلب</div>
            <div>{order.trackID ? formedID : ""}</div>
          </div>

          {order.customer && (
            <>
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
            </>
          )}

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
            <div dir="ltr">
              {`${order.price.order} EGP + ${
                order.price.shipment || "0"
              } EGP = ${order.price.order + order.price.shipment} EGP`}
            </div>
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
                    : order.status === "في انتظار التسليم"
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
          </div>
          <div className={styles.row}>
            <div className={styles.right}>فعّال</div>
            <div
              style={{
                margin: "1rem",
              }}
            >
              <span
                className={order.cancelled ? "tag cancelled" : "tag active"}
              >
                {" "}
                {order.cancelled ? "ملغي" : "فعَّال"}
              </span>
            </div>
          </div>
          {isLoggedIn && (
            <>
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
                <div>
                  {order.updated_by ? order.updated_by : "لم يتم التعديل"}
                </div>
              </div>
              <div className={styles.row}>
                <div className={styles.right}>تاريخ التعديل</div>
                <div style={{ direction: "ltr" }}>
                  {order.updated_by ? updatedAt : ""}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
export default track;

import React, { useEffect, useReducer } from "react";
import { useQuery } from "@apollo/react-hooks";
import { GET_ORDER } from "../GraphQL";
import styles from "../styles/order.module.css";
import { TextField } from "@material-ui/core";
const initialState = {
  customer_name: "",
  customer_phone: "",
  customer_address: "",
  details: "",
  notes: "",
  price: "",
};
const reducer = (state, action) => {
  switch (action.type) {
    case "field":
      return { ...state, [action.field]: action.value };
    case "clear":
      return initialState;
    default:
      return state;
  }
};

const OrderForm = ({ editOrder, showOrder, setEditOrder }) => {
  const isEdit = editOrder ? true : false;

  const [state, dispatch] = useReducer(
    reducer,
    isEdit
      ? {
          customer_name: editOrder.customer.name,
          customer_phone: editOrder.customer.phone,
          customer_address: editOrder.customer.address,
          details: editOrder.details,
          notes: editOrder.notes,
          price: editOrder.price,
        }
      : initialState
  );
  const handleChange = (e) => {
    dispatch({ type: "field", field: e.target.name, value: e.target.value });
  };
  console.log(state);
  return (
    <div className={styles.orderContainer}>
      <div className={styles.row}>
        <div className={styles.right}>الأسم</div>
        <div>
          <TextField
            value={state.customer_name}
            name="customer_name"
            onChange={handleChange}
          />
        </div>
      </div>
      <div className={styles.row}>
        <div className={styles.right}>رقم الهاتف</div>
        <TextField
          value={state.customer_phone}
          name="customer_phone"
          onChange={handleChange}
        />
        <div></div>
      </div>
      <div className={styles.row}>
        <div className={styles.right}>العنوان</div>
        <div>
          {" "}
          <TextField
            value={state.customer_address}
            name="customer_address"
            onChange={handleChange}
          />
        </div>
      </div>
      <div className={styles.row}>
        <div className={styles.right}>تفاصيل الطلب</div>
        <div>
          {" "}
          <TextField
            value={state.details}
            name="details"
            onChange={handleChange}
          />
        </div>
      </div>
      <div className={styles.row}>
        <div className={styles.right}>ملاحظات</div>
        <div>
          {" "}
          <TextField value={state.notes} name="notes" onChange={handleChange} />
        </div>
      </div>
      <div className={styles.row}>
        <div className={styles.right}>السعر</div>
        <div>
          {" "}
          <TextField value={state.price} name="price" onChange={handleChange} />
        </div>
      </div>
    </div>
  );
};

export default OrderForm;

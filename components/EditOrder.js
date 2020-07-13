import React, { useState, useReducer } from "react";
import { useMutation } from "@apollo/react-hooks";
import { EDIT_ORDER } from "../GraphQL";
import styles from "../styles/order.module.css";
import { Button, TextField } from "@material-ui/core";
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

const EditOrder = ({
  editOrder,
  showOrder,

  setSelectedOrderId,
}) => {
  const [state, dispatch] = useReducer(reducer, {
    customer_name: editOrder.customer.name,
    customer_phone: editOrder.customer.phone,
    customer_address: editOrder.customer.address,
    details: editOrder.details,
    notes: editOrder.notes,
    price: editOrder.price,
  });
  const [editOrderM, { error, loading }] = useMutation(EDIT_ORDER);
  const [errors, setErrors] = useState([]);
  const {
    customer_name,
    customer_phone,
    customer_address,
    details,
    notes,
    price,
  } = state;
  const handleChange = (e) => {
    dispatch({ type: "field", field: e.target.name, value: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]);
    if (
      !customer_name ||
      !customer_phone ||
      !customer_address ||
      !details ||
      !price ||
      isNaN(parseFloat(price))
    ) {
      Object.keys(state).forEach((name) => {
        if (state[name] === "" || state[name] === " ") {
          name === "notes" ? null : setErrors((prev) => [...prev, name]);
        }
      });
    } else {
      editOrderM({
        variables: { ...state, id: editOrder.id, price: parseFloat(price) },
      })
        .then(({ data }) => {
          setSelectedOrderId(data.editOrder.id);

          dispatch({ type: "clear" });
          showOrder();
        })
        .catch((e) => console.log(e));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className={styles.orderContainer}>
        <div className={styles.row}>
          <div className={styles.right}>الأسم</div>
          <div className={styles.textBoxContainer}>
            <TextField
              value={state.customer_name}
              name="customer_name"
              onChange={handleChange}
              fullWidth
            />
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.right}>رقم الهاتف</div>

          <div className={styles.textBoxContainer}>
            <TextField
              value={state.customer_phone}
              name="customer_phone"
              onChange={handleChange}
              fullWidth
            />
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.right}>العنوان</div>
          <div className={styles.textBoxContainer}>
            {" "}
            <TextField
              value={state.customer_address}
              name="customer_address"
              onChange={handleChange}
              multiline
              rows={2}
              fullWidth
            />
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.right}>تفاصيل الطلب</div>
          <div className={styles.textBoxContainer}>
            {" "}
            <TextField
              value={state.details}
              name="details"
              onChange={handleChange}
              multiline
              rows={4}
              fullWidth
            />
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.right}>ملاحظات</div>
          <div className={styles.textBoxContainer}>
            {" "}
            <TextField
              value={state.notes}
              name="notes"
              onChange={handleChange}
              multiline
              rows={4}
              fullWidth
            />
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.right}>السعر</div>
          <div className={styles.textBoxContainer}>
            {" "}
            <TextField
              value={state.price}
              type="number"
              name="price"
              onChange={handleChange}
              fullWidth
            />
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
            color="primary"
            type="submit"
            disabled={loading}
          >
            {loading ? "جاري الحفظ.." : "تحديث الطلب"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default EditOrder;

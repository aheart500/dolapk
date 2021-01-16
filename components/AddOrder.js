import React, { useState, useReducer } from "react";
import { useMutation } from "@apollo/react-hooks";
import { ADD_ORDER } from "../GraphQL";
import styles from "../styles/order.module.css";
import { TextField, Button, Select, MenuItem } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import EgyptianGovernorates from "../EgyptianGovernorates.json";
const initialState = {
  customer_name: "",
  customer_phone: "",
  customer_address: "",
  details: "",
  notes: "",
  order_price: "",
  shipment_price: "",
  deliveryType: "",
  governorate: "",
  product: "",
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

const AddOrder = ({ showOrder, setSelectedOrderId }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [addOrder, { error, loading }] = useMutation(ADD_ORDER);
  const [errors, setErrors] = useState([]);
  const {
    customer_name,
    customer_phone,
    customer_address,
    details,
    order_price,
    shipment_price,
  } = state;
  const handleChange = (e) => {
    dispatch({ type: "field", field: e.target.name, value: e.target.value });
  };
  console.log(state);
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]);
    if (
      !customer_name ||
      !customer_phone ||
      !customer_address ||
      !details ||
      !order_price ||
      customer_phone.length !== 11
    ) {
      let newErrors = [];
      Object.keys(state).forEach((name) => {
        if (state[name] === "" || state[name] === " ") {
          name === "notes"
            ? null
            : name === "shipment_price"
            ? null
            : newErrors.push(name);
        }
        if (customer_phone.length !== 11) {
          newErrors.push("customer_phone");
        }
      });
      setErrors(newErrors);
    } else {
      addOrder({
        variables: {
          ...state,
          order_price: parseFloat(order_price),
          shipment_price: parseFloat(shipment_price),
        },
      })
        .then(({ data }) => {
          setSelectedOrderId(data.addOrder.id);
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
              error={errors.includes("customer_name")}
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
              error={errors.includes("customer_phone")}
              fullWidth
            />
            {errors.includes("customer_phone") && (
              <p
                style={{
                  marginTop: "0.5rem",
                  color: "red",
                }}
              >
                {" "}
                يجب أن يكون رقم الهاتف مكوناً من 11 رقم فقط
              </p>
            )}
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.right}>المحافظة</div>
          <div className={styles.textBoxContainer}>
            {" "}
            <Autocomplete
              options={EgyptianGovernorates}
              value={state.governorate}
              onChange={(e, newValue) => {
                dispatch({
                  type: "field",
                  field: "governorate",
                  value: newValue,
                });
              }}
              renderInput={(params) => (
                <TextField {...params} variant="outlined" />
              )}
            />
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.right}>نوع توصيل</div>
          <div className={styles.textBoxContainer}>
            {" "}
            <Select
              name="deliveryType"
              value={state.deliveryType}
              onChange={handleChange}
              fullWidth
            >
              <MenuItem value="مترو">مترو</MenuItem>
              <MenuItem value="بيت">بيت</MenuItem>
              <MenuItem value="QP">QP</MenuItem>
              <MenuItem value="Urgent">Urgent</MenuItem>
              <MenuItem value="البراق">البراق</MenuItem>
            </Select>
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.right}>العنوان</div>
          <div className={styles.textBoxContainer}>
            {" "}
            <TextField
              value={state.customer_address}
              name="customer_address"
              error={errors.includes("customer_address")}
              onChange={handleChange}
              multiline
              rows={2}
              fullWidth
            />
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.right}>نوع المنتج</div>
          <div className={styles.textBoxContainer}>
            {" "}
            <TextField
              value={state.product}
              name="product"
              error={errors.includes("product")}
              onChange={handleChange}
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
              error={errors.includes("details")}
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
              multiline
              rows={4}
              name="notes"
              onChange={handleChange}
              fullWidth
            />
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.right}>السعر</div>
          <div className={styles.textBoxContainer}>
            {" "}
            <TextField
              value={state.order_price}
              type="number"
              name="order_price"
              error={errors.includes("order_price")}
              helperText="تأكد من إدخال رقم"
              onChange={handleChange}
              placeholder="سعر الطلب"
              style={{
                marginLeft: "1rem",
              }}
            />
            +
            <TextField
              value={state.shipment_price}
              type="number"
              name="shipment_price"
              placeholder="سعر الشحن"
              error={errors.includes("shipment_price")}
              helperText="تأكد من إدخال رقم"
              onChange={handleChange}
              className="shipment-price"
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
            {loading ? "جاري الحفظ..." : "حفظ الطلب"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default AddOrder;

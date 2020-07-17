import { Component } from "react";
import Container from "@material-ui/core/Container";
import { Grid } from "@material-ui/core";
class PrintCards extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const orders = this.props.orders;

    return (
      <Container className="cards-container printCards" maxWidth="lg">
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
            <div key={i} className="card">
              <div className="card-row">
                <div className="card-right">رقم الطلب</div>
                <div>{order.trackID ? formedID : ""}</div>
              </div>
              <div className="card-row">
                <div className="card-right">الأسم</div>
                <div>{order.customer.name}</div>
              </div>
              <div className="card-row">
                <div className="card-right">الهاتف</div>
                <div>{order.customer.phone}</div>
              </div>
              <div className="card-row">
                <div className="card-right">العنوان</div>
                <div>{order.customer.address}</div>
              </div>
              <div className="card-row">
                <div className="card-right">الطلب</div>
                <div>{order.details}</div>
              </div>
              <div className="card-row">
                <div className="card-right">السعر</div>
                <div dir="rtl">
                  {`${order.price.order} + ${order.price.shipment || "0"} = `}
                  <span dir="ltr">
                    {order.price.order + order.price.shipment} EGP
                  </span>{" "}
                </div>

                <div
                  style={{
                    marginRight: "auto",
                    marginLeft: "1rem",
                    fontSize: "1.2rem",
                    fontWeight: "bold",
                  }}
                >
                  Dolapk
                </div>
              </div>
            </div>
          );
        })}
      </Container>
    );
  }
}

export default PrintCards;

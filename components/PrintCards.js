import { Component } from "react";
import Container from "@material-ui/core/Container";
import { Grid } from "@material-ui/core";
import QR from "../public/qr.png";
import ReportProblemOutlinedIcon from "@material-ui/icons/ReportProblemOutlined";
import PhoneInTalkOutlinedIcon from "@material-ui/icons/PhoneInTalkOutlined";
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
          const address = order.customer.address;
          return (
            <div key={i} className="card">
              <div>
                <div className="card-header">
                  <div
                    className={{
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <h1 className="logo">DOLAPK</h1>
                    <p className="my-link">www.dolapk.com</p>
                  </div>
                  <img src={QR} className="qr-code" />
                </div>
              </div>
              <div
                style={{
                  border: "1px solid black",
                  width: "100%",
                  height: "300px",
                }}
              >
                <div className="card-row">
                  <p
                    style={{
                      width: "50%",
                      borderLeft: "1px solid black",
                      padding: "0 5px",
                    }}
                  >
                    المحافظة : {order.governorate}
                  </p>
                  <p
                    style={{
                      width: "50%",
                      padding: "0 5px",
                    }}
                  >
                    نوع التوصيل : {order.deliveryType ? order.deliveryType : ""}{" "}
                  </p>
                </div>
                <div className="card-row">
                  <div
                    style={{
                      width: "80%",
                      borderLeft: "1px solid black",
                      padding: "0 5px",
                      height: "80px",
                      overflow: "hidden",
                    }}
                  >
                    <p>اسم العميل : {order.customer.name} </p>
                    <p>رقم التليفون : {order.customer.phone} </p>
                    <p>
                      عنوان :{" "}
                      <span
                        style={{
                          fontSize:
                            address.length > 120
                              ? "0.5rem"
                              : address.length > 100
                              ? "0.6em"
                              : "0.8rem",
                        }}
                      >
                        {address}{" "}
                      </span>{" "}
                    </p>
                  </div>
                  <div
                    style={{
                      width: "20%",
                    }}
                  >
                    <div
                      style={{
                        height: "50%",
                        width: "100%",
                        textAlign: "center",
                        borderBottom: "1px solid black",
                        padding: "0 5px",
                      }}
                    >
                      <p>رقم الطلب</p>
                      <p>{formedID}</p>
                    </div>
                    <div
                      style={{
                        height: "50%",
                        width: "100%",
                        textAlign: "center",

                        padding: "0 5px",
                      }}
                    >
                      <p
                        style={{
                          fontSize: "0.5rem",
                        }}
                      >
                        معاد التسليم
                      </p>
                      <p></p>
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    borderBottom: "1px solid black",
                  }}
                >
                  <div
                    style={{
                      width: "25%",
                      borderLeft: "1px solid black",
                      padding: "0 5px",
                    }}
                  >
                    <p>سعر المنتج : {order.price.order} </p>
                  </div>
                  <div
                    style={{
                      width: "25%",
                      borderLeft: "1px solid black",
                      padding: "0 5px",
                    }}
                  >
                    <p>الشحن : {order.price.shipment} </p>
                  </div>
                  <div
                    style={{
                      width: "50%",
                      padding: "0 5px",
                    }}
                  >
                    <p>
                      الإجمالي :{" "}
                      {order.price.shipment
                        ? order.price.order + order.price.shipment
                        : order.price.order}{" "}
                    </p>
                  </div>
                </div>
                <div className="card-row">
                  <div
                    style={{
                      width: "80%",
                      borderLeft: "1px solid black",
                      padding: "0 5px",
                      height: "70px",
                      overflow: "hidden",
                    }}
                  >
                    <p>
                      تفاصيل الطلب :{" "}
                      <span
                        style={{
                          fontSize:
                            order.details.length > 120
                              ? "0.5rem"
                              : order.details.length > 100
                              ? "0.6em"
                              : "0.8rem",
                        }}
                      >
                        {order.details}{" "}
                      </span>{" "}
                    </p>
                  </div>
                  <div
                    style={{
                      padding: "0 2px",
                      textAlign: "center",
                      width: "20%",
                    }}
                  >
                    <p>نوع المنتج </p>
                    <p>{order.product}</p>
                  </div>
                </div>
                <div
                  style={{
                    padding: "0 5px",
                    height: "25px",
                    overflow: "hidden",
                  }}
                >
                  <p>
                    ملاحظات :
                    <span
                      style={{
                        fontSize:
                          order.notes?.length > 120
                            ? "0.5rem"
                            : order.notes?.length > 100
                            ? "0.6em"
                            : "0.8rem",
                      }}
                    >
                      {order.notes}{" "}
                    </span>{" "}
                  </p>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <ReportProblemOutlinedIcon
                  style={{
                    fontSize: "1rem",
                    marginLeft: "0.2rem",
                  }}
                />
                <p
                  style={{
                    fontSize: "0.3rem",
                  }}
                >
                  في حالة عدم استلام الأوردر يتم دفع مصاريف الشحن فقط
                </p>
                <p
                  className="my-link"
                  style={{
                    fontSize: "0.5rem",
                    textAlign: "left",
                    marginRight: "auto",
                  }}
                >
                  {new Date(parseInt(order.created_at)).toLocaleDateString()}
                </p>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <PhoneInTalkOutlinedIcon
                  style={{
                    fontSize: "1rem",
                    marginLeft: "0.2rem",
                  }}
                />
                <p
                  style={{
                    fontSize: "0.3rem",
                  }}
                >
                  في حالة الشكاوي والمقترحات :01004717429 - 01097223141{" "}
                </p>
              </div>
            </div>
          );
        })}
      </Container>
    );
  }
}

export default PrintCards;

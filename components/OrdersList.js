import React from "react";
import { useQuery } from "@apollo/react-hooks";
import { LAST_ORDERS } from "../GraphQL";
const OrdersList = ({ list }) => {
  const { data } = useQuery(LAST_ORDERS, { variables: { limit: 10 } });
  return (
    <div>
      <div>{JSON.stringify(data, null, 2)}</div>
    </div>
  );
};

export default OrdersList;

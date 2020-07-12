import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/react-hooks";
import { LAST_ORDERS } from "../GraphQL";
const OrdersList = ({ list }) => {
  const { data, error, loading, fetchMore } = useQuery(LAST_ORDERS, {
    variables: { limit: 2, category: list === "all" ? "" : list },
  });
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (data) setOrders(data.lastOrders);
  }, [data]);

  const loadMore = () => {
    fetchMore({
      variables: { cursor: orders[orders.length - 1].id },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        const previousEntry = previousResult.lastOrders;
        const newOrders = fetchMoreResult.lastOrders;
        return {
          lastOrders: [...previousEntry, ...newOrders],
        };
      },
    });
  };

  if (!data) return <h1>Loading</h1>;
  return (
    <div>
      <button onClick={() => loadMore()}>MORe</button>
      {orders?.map((order, i) => {
        return <div key={i}>{order.customer.name}</div>;
      })}
    </div>
  );
};

export default OrdersList;

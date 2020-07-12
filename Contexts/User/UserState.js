import UserContext from "./UserContext";
import UserReducer from "./UserReducer";
import React, { useReducer, useEffect, useState } from "react";
import { LOGIN } from "../../GraphQL";
import { useMutation } from "@apollo/react-hooks";
import Loader from "../../components/Loader";
export default function UserState({ children }) {
  const [loading, setLoading] = useState(true);
  const [GraphLogin] = useMutation(LOGIN);
  const initialState = {
    isLoggedIn: false,
    name: "",
    token: "",
  };
  const [state, dispatch] = useReducer(UserReducer, initialState);

  useEffect(() => {
    let loggedUser = localStorage.getItem("loggedUser");
    if (loggedUser) loggedUser = JSON.parse(loggedUser);
    if (loggedUser && loggedUser.name) {
      dispatch({
        type: "LOGIN",
        name: loggedUser.name,
        token: loggedUser.token,
        img: loggedUser.img,
      });
    }
    setLoading(false);
  }, []);

  const Login = (username, password) => {
    return GraphLogin({ variables: { username, password } }).then(
      ({ data }) => {
        const { name, value: token, img } = data.login;
        localStorage.setItem(
          "loggedUser",
          JSON.stringify({ name, token, img })
        );
        dispatch({ type: "LOGIN", name, token, img });
      }
    );
  };

  const Logout = () => {
    localStorage.clear();
    dispatch({ type: "LOGOUT" });
  };

  return (
    <UserContext.Provider
      value={{
        userState: state,
        Login,
        Logout,
      }}
    >
      {loading ? <Loader /> : children}
    </UserContext.Provider>
  );
}

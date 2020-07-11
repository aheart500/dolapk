import UserContext from "./UserContext";
import UserReducer from "./UserReducer";
import React, { useReducer, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { LOGIN } from "../../GraphQL";
import { useMutation } from "@apollo/react-hooks";

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
    const loggedUser = Cookies.getJSON("loggedUser");
    if (loggedUser && loggedUser.name) {
      dispatch({
        type: "LOGIN",
        name: loggedUser.name,
        token: loggedUser.token,
      });
    }
    setLoading(false);
  }, []);

  const Login = (username, password) => {
    return GraphLogin({ variables: { username, password } }).then(
      ({ data }) => {
        console.log(data);
        const { name, value: token } = data.login;
        Cookies.set(
          "loggedUser",
          { name, token },
          { sameSite: "None", secure: true }
        );
        dispatch({ type: "LOGIN", name, token });
      }
    );
  };

  const Logout = () => {
    Cookies.remove("loggedUser");
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
      {loading ? <h1>Loading...</h1> : children}
    </UserContext.Provider>
  );
}

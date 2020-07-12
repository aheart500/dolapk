import UserContext from "./UserContext";
import UserReducer from "./UserReducer";
import React, { useReducer, useEffect, useState } from "react";
import Cookies from "js-cookie";
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
    const loggedUser = Cookies.getJSON("loggedUser");
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
        Cookies.set("loggedUser", { name, token, img }, { sameSite: "Lax" });
        dispatch({ type: "LOGIN", name, token, img });
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
      {loading ? <Loader /> : children}
    </UserContext.Provider>
  );
}

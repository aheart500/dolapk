import UserContext from "./UserContext";
import UserReducer from "./UserReducer";
import React, { useReducer, useEffect, useState } from "react";
import { IS_CURRENTLY_ADMIN, LOGIN } from "../../GraphQL";
import { useMutation,  } from "@apollo/react-hooks";
import Loader from "../../components/Loader";
export default function UserState({ children }) {
  const [loading, setLoading] = useState(true);
  const [GraphLogin] = useMutation(LOGIN);
  const [checkIfCurrentAdmin] = useMutation(IS_CURRENTLY_ADMIN);
  const initialState = {
    isLoggedIn: false,
    name: "",
    token: "",
    id: ''
  };
  const [state, dispatch] = useReducer(UserReducer, initialState);
  
  useEffect(() => {
    let loggedUser = localStorage.getItem("loggedUser");
    if (loggedUser) loggedUser = JSON.parse(loggedUser);
    if (loggedUser && loggedUser.id) {
      checkIfCurrentAdmin({variables: {id: loggedUser.id}}).then(({data: {isCurrentlyAdmin}})=> {
     
        if(isCurrentlyAdmin){
          dispatch({
            type: "LOGIN",
            name: loggedUser.name,
            token: loggedUser.token,
            img: loggedUser.img,
            id: loggedUser.id
          });
        }
      }).finally(()=>     setLoading(false))
    }else{
      setLoading(false) 
      
    }

  }, []);
  const Login = (username, password) => {
    return GraphLogin({ variables: { username, password } }).then(
      ({ data }) => {
        const { name, value: token, img,id } = data.login;
        localStorage.setItem(
          "loggedUser",
          JSON.stringify({ name, token, img,id })
        );
        dispatch({ type: "LOGIN", name, token, img,id });
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

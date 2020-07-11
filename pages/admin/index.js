import { useContext, useEffect, useState } from "react";
import UserContext from "../../Contexts/User/UserContext";
import { useRouter } from "next/router";

const Admin = () => {
  const { userState } = useContext(UserContext);
  const router = useRouter();
  const [pageLoading, setPageLoading] = useState(true);
  useEffect(() => {
    if (!userState.isLoggedIn) {
      router.replace("/admin/login");
    }
    setPageLoading(false);
  }, [userState.isLoggedIn]);
  return pageLoading ? <h1>Loading</h1> : <h1>Hi {userState.name} !</h1>;
};

export default Admin;

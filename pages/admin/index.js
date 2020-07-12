import { useContext, useEffect, useState } from "react";
import UserContext from "../../Contexts/User/UserContext";
import LanguageContext from "../../Contexts/Language/LanguageContext";
import { useRouter } from "next/router";
import Header from "../../components/Header";
import Drawer from "../../components/Drawer";
import AdminMain from "../../components/AdminMain";
import OrdersList from "../../components/OrdersList";
import OrderForm from "../../components/OrderForm";
const Admin = () => {
  const { userState, Logout } = useContext(UserContext);
  const [open, setOpen] = useState(false);
  const [tap, setTap] = useState("main");
  const {
    languageState: { language },
    changeLang,
  } = useContext(LanguageContext);
  const router = useRouter();
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    if (!userState.isLoggedIn) {
      router.replace("/admin/login");
    } else {
      setPageLoading(false);
    }
  }, []);

  const renderedTap = () => {
    switch (tap) {
      case "main":
        return <AdminMain />;
      case "list-all":
        return <OrdersList list="all" />;
      case "list-wait":
        return <OrdersList list="wait" />;
      case "list-finish":
        return <OrdersList list="finish" />;
      case "list-cancel":
        return <OrdersList list="cancel" />;
      case "add-order":
        return <OrderForm />;
      default:
        return <AdminMain />;
    }
  };
  console.log(language);
  return pageLoading ? null : (
    <main>
      <Header
        openDrawer={() => setOpen(true)}
        name={userState.name}
        img={userState.img}
      />
      <Drawer
        opened={open}
        hide={() => setOpen(false)}
        img={userState.img}
        name={userState.name}
        setTap={setTap}
        logout={Logout}
        lang={language}
        changeLang={changeLang}
      />
      {renderedTap()}
    </main>
  );
};

export default Admin;

import LanguageContext from "./LanguageContext";
import LanguageReducer from "./LanguageReducer";
import { useReducer, useEffect } from "react";
import Cookies from "js-cookie";
const LanguageState = ({ children }) => {
  const initialState = {
    language: "en",
  };
  const [state, dispatch] = useReducer(LanguageReducer, initialState);
  useEffect(() => {
    const language = Cookies.getJSON("language");
    if (language && language.lang !== "en") {
      dispatch({ type: language.lang });
    }
  }, []);
  const changeLang = (lang) => {
    Cookies.set("language", { lang }, { sameSite: "Lax" });
    dispatch({ type: lang });
  };
  return (
    <LanguageContext.Provider
      value={{
        languageState: state,
        changeLang,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageState;

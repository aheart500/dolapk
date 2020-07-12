import LanguageContext from "./LanguageContext";
import LanguageReducer from "./LanguageReducer";
import { useReducer, useEffect } from "react";
const LanguageState = ({ children }) => {
  const initialState = {
    language: "en",
  };
  const [state, dispatch] = useReducer(LanguageReducer, initialState);
  useEffect(() => {
    let language = localStorage.getItem("language");
    if (language) language = JSON.parse(language);
    if (language && language.lang !== "en") {
      dispatch({ type: language.lang });
    }
  }, []);
  const changeLang = (lang) => {
    localStorage.setItem("language", JSON.stringify({ lang }));
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

const reducer = (state, action) => {
  switch (action.type) {
    case "ar":
      return { ...state, language: "ar" };
    case "en":
      return { ...state, language: "en" };
    default:
      return state;
  }
};

export default reducer;

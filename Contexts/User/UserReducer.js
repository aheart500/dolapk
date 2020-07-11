export default function userReducer(state, action) {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        isLoggedIn: true,
        name: action.name,
        token: action.token,
      };

    case "LOGOUT":
      return { ...state, isLoggedIn: false, name: "", token: "" };

    default:
      return state;
  }
}

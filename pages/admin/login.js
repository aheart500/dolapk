import Head from "next/head";
import styles from "../../styles/login.module.css";
import { TextField, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { useState, useContext, useEffect } from "react";
import UserContext from "../../Contexts/User/UserContext";
import { useRouter } from "next/router";

const useStyles = makeStyles((theme) => ({
  form: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgb(128, 240, 231)",
    padding: "1rem",
    borderRadius: "10px",
    width: "50%",
    margin: "auto",
    [theme.breakpoints.down("sm")]: {
      width: "90%",
    },
  },
  inputField: {
    marginBottom: "1rem",
    width: "90%",
  },
  button: {
    alignSelf: "center",
    width: "50%",
  },
}));

export default function Login() {
  const { userState, Login } = useContext(UserContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const classes = useStyles();
  const router = useRouter();

  const [pageLoading, setPageLoading] = useState(true);
  useEffect(() => {
    if (userState.isLoggedIn) {
      router.replace("/admin");
    } else {
      setPageLoading(false);
    }
    setError(JSON.stringify(userState, null, 2));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await Login(username, password);
      router.replace("/admin");
    } catch (e) {
      if (e.graphQLErrors) setError(e.graphQLErrors[0].message);
      console.log(e);
    }
  };
  if (pageLoading) return null;

  return (
    <div>
      <Head>
        <title>Login</title>
      </Head>
      <main className={styles.container}>
        <form onSubmit={handleSubmit} className={classes.form}>
          <TextField
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            label="Username"
            className={classes.inputField}
            required
          />
          <TextField
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={classes.inputField}
            label="Password"
            required
          />
          {error && (
            <p
              style={{
                margin: "0.5rem 0",
                color: "red",
                fontSize: "1.2rem",
              }}
            >
              {JSON.stringify(error, null, 2)}
            </p>
          )}
          <Button variant="contained" className={classes.button} type="submit">
            Login
          </Button>
        </form>
      </main>
    </div>
  );
}

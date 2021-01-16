import { useContext, useEffect, useState } from "react";
import UserContext from "../Contexts/User/UserContext";
import { GET_ADMINS, EDIT_ADMIN, CREATE_ADMIN, DELETE_ADMIN } from "../GraphQL";
import { useLazyQuery, useMutation } from "@apollo/react-hooks";
import classes from "../styles/admin.module.css";
import { Button, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
const useStyles = makeStyles({
  textField: {
    marginRight: "1rem",
  },
});
const intialState = { name: "", username: "", password: "" };
const AdminMain = () => {
  const { userState, Logout } = useContext(UserContext);
  const isAdmin = userState.name === "Omar Mohamed";
  const muiClasses = useStyles();
  const [loadAdmins, { loading, data, refetch }] = useLazyQuery(GET_ADMINS);
  const [editAdmin] = useMutation(EDIT_ADMIN);
  const [newAdmin, setNewAdmin] = useState(intialState);
  const [admins, setAdmins] = useState([]);
  const [createAdmin] = useMutation(CREATE_ADMIN, { variables: newAdmin });
  const [deleteAdmin] = useMutation(DELETE_ADMIN);

  useEffect(() => {
    if (isAdmin) {
      loadAdmins();
    }
  }, []);
  useEffect(() => {
    if (data && data.getAdmins) {
      setAdmins(data.getAdmins.map((admin) => ({ ...admin, password: "" })));
    }
  }, [data]);
  if (!data) {
    return null;
  }

  const handleChangeAdmin = (e, id) => {
    const { name, value } = e.target;
    setAdmins(
      admins.map((admin) =>
        admin.id === id ? { ...admin, [name]: value } : admin
      )
    );
  };
  const handleChangeNewAdmin = (e) => {
    const { name, value } = e.target;
    setNewAdmin({ ...newAdmin, [name]: value });
  };
  const handleAddNewAdmin = () => {
    createAdmin()
      .then(() => {
        refetch();
        setNewAdmin(intialState);
      })
      .catch((err) => console.log(err));
  };
  const handleDeleteAdmin = (id) => {
    deleteAdmin({ variables: { id } })
      .then(() => {
        refetch();
      })
      .catch((err) => console.log(err));
  };
  const handleEditAdmin = (id) => {
    let changedAdmin = { ...admins.find((admin) => admin.id === id) };
    if (changedAdmin.password === "") {
      delete changedAdmin.password;
    }
    editAdmin({ variables: changedAdmin })
      .then(() => {
        refetch();
      })
      .catch((err) => console.log(err));
  };
  return (
    <div className={classes.admins}>
      <h1>Admins</h1>
      <h2>New</h2>
      <div className={classes.admin}>
        <div className={classes.fields}>
          <TextField
            value={newAdmin.name}
            className={muiClasses.textField}
            label="Name"
            variant="outlined"
            name="name"
            onChange={handleChangeNewAdmin}
          />
          <TextField
            value={newAdmin.username}
            label="Username"
            className={muiClasses.textField}
            variant="outlined"
            name="username"
            onChange={handleChangeNewAdmin}
          />
          <TextField
            value={newAdmin.password}
            className={muiClasses.textField}
            label="Password"
            variant="outlined"
            name="password"
            type="password"
            onChange={handleChangeNewAdmin}
          />
          <Button
            variant="outlined"
            color="primary"
            onClick={() => handleAddNewAdmin()}
          >
            Add
          </Button>
        </div>
      </div>
      <h2>Current</h2>
      {admins.map(({ id, name, username, password }) => {
        return (
          <div className={classes.admin} key={id}>
            <div className={classes.fields}>
              <TextField
                value={name}
                className={muiClasses.textField}
                label="Name"
                variant="outlined"
                name="name"
                onChange={(e) => handleChangeAdmin(e, id)}
              />
              <TextField
                value={username}
                label="Username"
                className={muiClasses.textField}
                variant="outlined"
                name="username"
                onChange={(e) => handleChangeAdmin(e, id)}
              />
              <TextField
                value={password}
                className={muiClasses.textField}
                label="Password"
                variant="outlined"
                name="password"
                type="password"
                onChange={(e) => handleChangeAdmin(e, id)}
              />
              <Button
                variant="outlined"
                color="primary"
                className={muiClasses.textField}
                onClick={() => handleEditAdmin(id)}
              >
                Edit
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => handleDeleteAdmin(id)}
              >
                Delete
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AdminMain;

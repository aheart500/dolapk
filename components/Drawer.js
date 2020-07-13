import { useState } from "react";
import { useRouter } from "next/router";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import Collapse from "@material-ui/core/Collapse";
import ListAltIcon from "@material-ui/icons/ListAlt";
import ListIcon from "@material-ui/icons/List";
import PlaylistAddCheckIcon from "@material-ui/icons/PlaylistAddCheck";
import CancelIcon from "@material-ui/icons/Cancel";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import PostAddIcon from "@material-ui/icons/PostAdd";
import FormatListBulletedIcon from "@material-ui/icons/FormatListBulleted";
const useStyle = makeStyles((theme) => ({
  list: {
    width: 250,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
  large: {
    width: theme.spacing(15),
    height: theme.spacing(15),
    margin: "2rem auto 0.5rem auto",
  },
  name: {
    margin: "0 auto",
    width: "fit-content",
    color: "gray",
  },
}));

const Drawer_ = ({
  opened,
  hide,
  img,
  name,
  setTap,
  logout,
  lang,
  changeLang,
}) => {
  const [showOrdersLists, setShowOrdersLists] = useState(false);
  const classes = useStyle();
  const router = useRouter();
  const handleClickAway = () => {
    if (opened) hide();
  };
  const handleClick = (tapName) => {
    hide();
    setTap(tapName);
  };
  const handleLogout = () => {
    logout();
    router.replace("/admin/login");
  };
  return (
    <Drawer open={opened} anchor="right">
      <ClickAwayListener onClickAway={handleClickAway}>
        <div>
          <Avatar src={img} alt="Mohamed Nasser" className={classes.large} />
          <Typography variant="h6" className={classes.name}>
            {name}
          </Typography>
          <List className={classes.list}>
            <ListItem button onClick={() => handleClick("order-form-add")}>
              <ListItemIcon>
                <PostAddIcon />
              </ListItemIcon>
              <ListItemText>Add order</ListItemText>
            </ListItem>
            <ListItem
              button
              onClick={() => setShowOrdersLists(!showOrdersLists)}
            >
              <ListItemIcon>
                <ListAltIcon />
              </ListItemIcon>
              <ListItemText primary="Orders list" />
              {showOrdersLists ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={showOrdersLists} timeout="auto" unmountOnExit>
              <List disablePadding component="div">
                <ListItem
                  button
                  className={classes.nested}
                  onClick={() => handleClick("list-all")}
                >
                  <ListItemIcon>
                    <FormatListBulletedIcon />
                  </ListItemIcon>
                  <ListItemText primary="All orders" />
                </ListItem>
                <ListItem
                  button
                  className={classes.nested}
                  onClick={() => handleClick("list-wait")}
                >
                  <ListItemIcon>
                    <ListIcon />
                  </ListItemIcon>
                  <ListItemText primary="Waiting orders" />
                </ListItem>

                <ListItem
                  button
                  className={classes.nested}
                  onClick={() => handleClick("list-finish")}
                >
                  <ListItemIcon>
                    <PlaylistAddCheckIcon />
                  </ListItemIcon>
                  <ListItemText primary="Finished orders" />
                </ListItem>
                <ListItem
                  button
                  className={classes.nested}
                  onClick={() => handleClick("list-cancel")}
                >
                  <ListItemIcon>
                    <CancelIcon />
                  </ListItemIcon>
                  <ListItemText primary="Cancelled orders" />
                </ListItem>
              </List>
            </Collapse>
            <ListItem button onClick={handleLogout}>
              <ListItemIcon>
                <ExitToAppIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </List>
          <footer
            style={{
              position: "absolute",
              bottom: "1rem",
              width: "100%",
              textAlign: "center",
            }}
          >
            <span
              style={{
                color: lang === "en" ? "black" : "gray",
                cursor: "pointer",
              }}
              onClick={() => (lang === "en" ? null : changeLang("en"))}
            >
              English
            </span>{" "}
            |{" "}
            <span
              style={{
                color: lang === "ar" ? "black" : "gray",
                cursor: "pointer",
              }}
              onClick={() => (lang === "ar" ? null : changeLang("ar"))}
            >
              العربية
            </span>
          </footer>
        </div>
      </ClickAwayListener>
    </Drawer>
  );
};

export default Drawer_;

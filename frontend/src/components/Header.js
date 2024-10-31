  import React, { useState } from "react";
  import AppBar from "@mui/material/AppBar";
  import Box from "@mui/material/Box";
  import Toolbar from "@mui/material/Toolbar";
  import IconButton from "@mui/material/IconButton";
  import Typography from "@mui/material/Typography";
  import Menu from "@mui/material/Menu";
  import Container from "@mui/material/Container";
  import Avatar from "@mui/material/Avatar";
  import Button from "@mui/material/Button";
  import Tooltip from "@mui/material/Tooltip";
  import MenuItem from "@mui/material/MenuItem";
  import WhatshotIcon from "@material-ui/icons/Whatshot";
  import axios from "axios";
  import useToken from "./authentication/useToken";
  import { updateState } from "../burnoutReducer";
  import { useTheme } from "./ThemeContext"; // Import the theme context

  const mainPages = {
    Home: "/",
    Events: "/events",
    "My Meals": "/meals",
    "My Workouts": "/workouts",
    FAQ: "/faq",
    "Contact Us": "/contactus",
  };
  const userPages = { Profile: "/profile" };

  function Header(props) {
    const [userMenuToggle, setUserMenuToggle] = useState(null);
    const { removeToken } = useToken();
    const { theme, toggleTheme, themeName } = useTheme(); // Access theme, toggleTheme, and themeName

    const handleOpenUserMenu = (event) => {
      setUserMenuToggle(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
      setUserMenuToggle(null);
    };

    const handleLogOut = () => {
      handleCloseUserMenu();
      axios({
        method: "POST",
        url: "/logout",
      })
        .then((response) => {
          removeToken();
          const loggedOutState = {
            loggedIn: false,
            token: null,
          };
          props.dispatch(updateState(loggedOutState));
        })
        .catch((error) => {
          if (error.response) {
            console.log(error.response);
            console.log(error.response.status);
            console.log(error.response.headers);
          }
        });
    };

    // Handle theme change
    const handleThemeChange = (event) => {
      toggleTheme(event.target.value);
    };

    return (
      <AppBar position="static" sx={{ backgroundColor: theme.headerColor }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Box>
              <WhatshotIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
            </Box>
            <Box>
              <Typography
                variant="h6"
                noWrap
                component="a"
                href="/"
                sx={{
                  mr: 2,
                  display: "flex",
                  fontFamily: "monospace",
                  fontWeight: 700,
                  color: theme.color,
                  textDecoration: "none",
                  paddingLeft: "10px",
                }}
              >
                BurnoutExtreme
              </Typography>
            </Box>
            <Box sx={{ flexGrow: 1, display: "flex" }}>
              {Object.keys(mainPages).map((page) => (
                <Button
                  key={page}
                  component="a"
                  href={mainPages[page]}
                  sx={{
                    mr: 2,
                    display: "block",
                    color: theme.color,
                    textDecoration: "none",
                    backgroundColor: window.location.pathname === mainPages[page] ? theme.background : 'transparent', // Highlight active tab
                    transition: 'background-color 0.3s ease',
                  }}
                >
                  {page}
                </Button>
              ))}
            </Box>
            {/* Display the current theme name */}
            <Box sx={{ marginRight: 2 }}>
              <Typography
                variant="subtitle1"
                sx={{ color: theme.color }}
              >
                
              </Typography>
            </Box>
            {/* Add a dropdown for theme selection */}
            <Box sx={{ marginRight: 2 }}>
              <select
                onChange={handleThemeChange}
                value={themeName}
                style={{
                  padding: "5px",
                  border: "none",
                  borderRadius: "4px",
                  backgroundColor: theme.dropdownBg || "#f0f0f0",
                  color: theme.color || "#000",
                  fontSize: "16px",
                }}
              >
                <option value="sunnyDay" style={{ backgroundColor: "#ffeb3b", color: "#000" }}>
                  Sunny Day
                </option>
                <option value="midnightMystique" style={{ backgroundColor: "#212121", color: "#fff" }}>
                  Midnight Mystique
                </option>
                <option value="blushBloom" style={{ backgroundColor: "#f06292", color: "#000" }}>
                  Blush & Bloom
                </option>
                <option value="boldBrave" style={{ backgroundColor: "#d32f2f", color: "#fff" }}>
                  Bold & Brave
                </option>
                <option value="sleekSimple" style={{ backgroundColor: "#90a4ae", color: "#000" }}>
                  Sleek & Simple
                </option>
                <option value="neutralGround" style={{ backgroundColor: "#bdbdbd", color: "#000" }}>
                  Neutral Ground
                </option>
                <option value="vibrantVibes" style={{ backgroundColor: "#4caf50", color: "#fff" }}>
                  Vibrant Vibes
                </option>
                <option value="earthyEssence" style={{ backgroundColor: "#795548", color: "#fff" }}>
                  Earth & Essence
                </option>
              </select>
            </Box>
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={userMenuToggle}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(userMenuToggle)}
                onClose={handleCloseUserMenu}
              >
                {Object.keys(userPages).map((page) => (
                  <MenuItem key={page} onClick={handleCloseUserMenu}>
                    <Typography
                      textAlign="center"
                      component="a"
                      href={userPages[page]}
                      sx={{
                        textDecoration: "none",
                        display: "block",
                        color: "black",
                      }}
                    >
                      {page}
                    </Typography>
                  </MenuItem>
                ))}
                <MenuItem key={"logout"} onClick={handleLogOut}>
                  <Typography
                    textAlign="center"
                    sx={{
                      textDecoration: "none",
                      display: "block",
                      color: "black",
                    }}
                  >
                    {"Logout"}
                  </Typography>
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    );
  }

  export default Header;

  import React, { useState } from "react";
  import {
    AppBar,
    Container,
    Toolbar,
    Typography,
    Button,
    IconButton,
    Menu,
    MenuItem,
    Box,
  } from '@mui/material';
  import Avatar from "@mui/material/Avatar";
  import Tooltip from "@mui/material/Tooltip";
  import WhatshotIcon from "@material-ui/icons/Whatshot";
  import axios from "axios";
  import useToken from "./authentication/useToken";
  import { updateState } from "../burnoutReducer";
  import { useTheme } from "./ThemeContext"; // Import the theme context
  import MenuIcon from '@mui/icons-material/Menu';

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
    const [anchorElNav, setAnchorElNav] = useState(null);
    const [userMenuToggle, setUserMenuToggle] = useState(null);
    const { removeToken } = useToken();
    const { theme, toggleTheme, themeName } = useTheme(); // Access theme, toggleTheme, and themeName
    //const muiTheme = useTheme();


    const handleOpenUserMenu = (event) => {
      setUserMenuToggle(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
      setUserMenuToggle(null);
    };

    const handleOpenNavMenu = (event) => {
      setAnchorElNav(event.currentTarget);
    };
  
    const handleCloseNavMenu = () => {
      setAnchorElNav(null);
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
                  display: { xs: 'none', md: 'flex' },
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
            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {Object.entries(mainPages).map(([page, path]) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography
                    textAlign="center"
                    component="a"
                    href={path}
                    sx={{
                      textDecoration: 'none',
                      color: theme.color,
                    }}
                  >
                    {page}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              color: theme.color,
              textDecoration: 'none',
            }}
          >
            BurnoutExtreme
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {Object.entries(mainPages).map(([page, path]) => (
              <Button
                key={page}
                component="a"
                href={path}
                sx={{
                  mr: 2,
                  color: theme.color,
                  display: 'block',
                  backgroundColor: window.location.pathname === path ? theme.background : 'transparent',
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
            <Box sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 2,
            alignItems: { xs: "stretch", md: "center" },
          }}>
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
                  cursor: "pointer",
                  minWidth: { xs: "100%", md: "150px" }
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

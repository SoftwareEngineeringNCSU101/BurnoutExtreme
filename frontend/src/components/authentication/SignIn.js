import * as React from "react";
import { useState, useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import axios from "axios";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import useToken from "./useToken";
import { useHistory } from "react-router-dom";
import { updateState } from "../../burnoutReducer";
import { useGoogleLogin } from '@react-oauth/google';

function SignIn(props) {
  const history = useHistory();
  const defaultTheme = createTheme();

  const [loginForm, setloginForm] = useState({
    email: "",
    password: "",
  });
  const { saveToken } = useToken();

  function logMeIn(event) {
    console.log(loginForm.email);
    console.log(loginForm.password);

    axios({
      method: "POST",
      url: "/token",
      data: {
        email: loginForm.email,
        password: loginForm.password,
      },
    })
      .then((response) => {
        console.log(response.data.message);
        let logInState = {
          loggedIn: true,
          token: response.data.access_token,
        };
        props.dispatch(updateState(logInState));
        saveToken(response.data.access_token);
        history.push("/");
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
      });

    setloginForm({
      email: "",
      password: "",
    });

    event.preventDefault();
  }

  function handleChange(event) {
    const { value, name } = event.target;
    setloginForm((prevNote) => ({
      ...prevNote,
      [name]: value,
    }));
  }

  const [ user, setUser ] = useState([]);
  const [ profile, setProfile ] = useState([]);

  const login = useGoogleLogin({
        onSuccess: (codeResponse) => setUser(codeResponse),
        onError: (error) => console.log('Login Failed:', error)
    });

	useEffect(
        () => {
            if (user) {
                axios
                    .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
                        headers: {
                            Authorization: `Bearer ${user.access_token}`,
                            Accept: 'application/json'
                        }
                    })
                    .then((res) => {
                        setProfile(res.data);
						axios({
							method: "POST",
							url: "/google-login",
							data: {
							  email: profile.email,
                first_name: profile.given_name,
                last_name: profile.family_name
							},
						  })
							.then((response) => {
							  console.log(response.data.message);
							  let logInState = {
								loggedIn: true,
								token: response.data.access_token,
							  };
							  props.dispatch(updateState(logInState));
							  saveToken(response.data.access_token);
							  history.push("/");
							})
							.catch((error) => {
							  if (error.response) {
								console.log(error.response);
								console.log(error.response.status);
								console.log(error.response.headers);
							  }
							});
                    })
                    .catch((err) => console.log(err));
            }
        },
        [user, profile, props, saveToken, history]
    );
	
  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={logMeIn} noValidate sx={{ mt: 1 }}>
            <TextField
              onChange={handleChange}
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={loginForm.email}
              autoFocus
            />
            <TextField
              onChange={handleChange}
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              value={loginForm.password}
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/SignUp" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
		  <Button
              onClick={login}
              fullWidth
              variant="outlined"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In With Google
            </Button>
        </Box>
        
      </Container>
    </ThemeProvider>
  );
}

export default SignIn;

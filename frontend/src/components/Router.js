import React, { useReducer, useEffect } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import SignUp from "./authentication/SignUp";
import SignIn from "./authentication/SignIn";
import ContactUs from "./ContactUs";
import Events from "./Events";
import Profile from "./Profile";
import Home from "./Home";
import Meals from "./Meals";
import Workouts from "./Workouts";
import burnoutReducer, { updateState } from "../burnoutReducer";
import PrivateRoute from "./PrivateRoute";
import useToken from "./authentication/useToken";
import FAQ from "./faq";

const initialState = {
  loggedIn: false,
  token: null,
  snackbar: {
    open: false,
    message: "",
    severity: "",
  },
};

function Router() {
  const { getToken, token } = useToken();
  const [state, dispatch] = useReducer(burnoutReducer, initialState);

  // Check token and update login state if not already logged in
  if (!state.loggedIn) {
    let loggedInUserJWTtoken = getToken();
    if (loggedInUserJWTtoken) {
      let logInState = {
        loggedIn: true,
        token: token,
      };
      dispatch(updateState(logInState));
    }
  }

  return (
    <Switch>
      <Route path="/signup">
        <SignUp />
      </Route>
      <Route path="/signin">
        <SignIn dispatch={dispatch} />
      </Route>
      <PrivateRoute state={state} dispatch={dispatch} path="/profile">
        <Profile state={state} dispatch={dispatch} />
      </PrivateRoute>
      <PrivateRoute state={state} dispatch={dispatch} path="/faq">
        <FAQ state={state} dispatch={dispatch} />
      </PrivateRoute>
      <PrivateRoute state={state} dispatch={dispatch} path="/contactus">
        <ContactUs state={state} dispatch={dispatch} />
      </PrivateRoute>
      <PrivateRoute state={state} dispatch={dispatch} path="/meals">
        <Meals state={state} dispatch={dispatch} />
      </PrivateRoute>
      <PrivateRoute state={state} dispatch={dispatch} path="/workouts">
        <Workouts state={state} dispatch={dispatch} />
      </PrivateRoute>
      <PrivateRoute state={state} dispatch={dispatch} path="/events">
        <Events state={state} dispatch={dispatch} />
      </PrivateRoute>
      <PrivateRoute state={state} dispatch={dispatch} path="/">
        <Home state={state} dispatch={dispatch} />
      </PrivateRoute>
    </Switch>
  );
}

export default Router;
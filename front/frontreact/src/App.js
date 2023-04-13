import "react-dropzone-uploader/dist/styles.css";
import Signin from "./pages/signin";
import SignUp from "./pages/signup";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import { useState, useEffect } from "react";
import Main from "./Main";
import { endpoint, get_token, getCookie } from "./constants";
import { NotificationsProvider } from "@mantine/notifications";
import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import React from "react";
function App(props) {
  return (
    <Router>
      <Switch>
        <MantineProvider
          withNormalizeCSS
          theme={{ colorScheme: "dark", primaryColor: "green" }}
        >
          <NotificationsProvider position="top-center">
            <ModalsProvider>
              <Route path="/" exact component={Main}></Route>
              <Route path="/playlist/" component={Main}></Route>
              <Route path="/login/" component={Signin}></Route>
              <Route path="/signup/" component={SignUp}></Route>
              <Route path="/demo/" component={Demo}></Route>
              <Route path="/code/">
                <Code />
              </Route>
            </ModalsProvider>
          </NotificationsProvider>
        </MantineProvider>
      </Switch>
    </Router>
  );
}
function Code() {
  const urlParams = new URLSearchParams(window.location.search);
  const myParam = urlParams.get("code");
  useEffect(() => {
    const requestoptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCookie("csrftoken"),
        Authorization: get_token(),
      },
      body: JSON.stringify({
        code: myParam,
      }),
    };
    fetch(endpoint + "/api/authcode/", requestoptions).then((response) => {
      if (response.ok) {
        window.location.href = "/";
      } else {
        window.location.href = "/login";
      }
    });
  });
  return <></>;
}
function Demo(){
  localStorage.setItem("token","530b53ef9d6c61b2759e14f1b2b1f37bb4ebdc3e")
  window.location.href="/"
  return <></>
}
export default App;

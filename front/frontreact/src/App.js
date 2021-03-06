import "react-dropzone-uploader/dist/styles.css";
import Signin from "./pages/signin";
import SignUp from "./pages/signup";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import "./App.css";
import { useState,useEffect} from "react";
import Main from "./Main";
import { endpoint, get_token } from "./constants";
import { NotificationsProvider } from "@mantine/notifications";
import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import React from "react"
function App(props) {  
  return (
    <Router>
      <Switch>
        <MantineProvider theme={{ colorScheme: "dark", primaryColor: "green" }}>
          <NotificationsProvider  position="top-center">
            <ModalsProvider>
            <Route  path="/" exact component={Main}></Route>
            <Route  path="/playlist/" component={Main}></Route>
              <Route path="/login/" component={Signin}></Route>
              <Route path="/signup/" component={SignUp}></Route>
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

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

export default App;

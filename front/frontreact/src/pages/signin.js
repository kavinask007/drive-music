import {
  Loader,
  TextInput,
  Center,
  Space,
  Card,
  PasswordInput,
  Button,
} from "@mantine/core";
import React, { useState } from "react";
import { get_redirect_uri, get_token } from "../constants";
import { endpoint, getCookie } from "../constants";
export default function Signin(props) {
  const [username, setuser] = useState(" ");
  const [password, setpassword] = useState("password");
  const [autherror, setautherror] = useState(false);
  const [loading, setloading] = useState(false);
  function handletextfieldchange(e) {
    if (e.target.id === "username") {
      setuser(e.target.value);
    }
    if (e.target.id === "password") {
      setpassword(e.target.value);
    }
  }
  function handlesubmitbutton() {
    setautherror(false);
    setloading(true);
    const requestoptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCookie("csrftoken"),
      },
      body: JSON.stringify({
        username: username.toString(),
        password: password.toString(),
      }),
    };
    fetch(endpoint + "/api/loginapi/", requestoptions)
      .then((response) => {
        setloading(false);
        if (!response.ok) {
          setautherror(true);
          return null;
        }
        setautherror(false);
        return response.json();
      })
      .then((data) => {
        if (data != null) {
          window.localStorage.setItem("token", data["token"]);
          const requestoptions2 = {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "X-CSRFToken": getCookie("csrftoken"),
              Authorization: `Token ${data["token"]}`,
            },
          };
          fetch(endpoint + "/api/drivename", requestoptions2).then(
            (response) => {
              if (response.ok) {
                props.history.push("/");
              } else {
                window.location.replace(get_redirect_uri());
              }
            }
          );
        }
      });
  }
  return (<>
    <Space h={"25vh"} />
    <Center>
      <Card shadow="sm" p="lg" radius="md" withBorder style={{ width: 320 }}>
        <a href="/signup">
          <div class="subtitle2">
            {"Create an account "}

            <span>&#8594;</span>
          </div>
        </a>
        <div class="title">Welcome</div>

        <div class="input-container ic1">
          <TextInput
          radius="lg"
          bg="#fff"
          variant="filled"
            label="Username"
            id="username"
            class="input"
            type="text"
            placeholder=" "
            onChange={handletextfieldchange}
          />
        </div>
        <div class="input-container ic2">
          <PasswordInput
          radius="lg"
          variant="unfilled"  
            label="Password"
            id="password"
            class="input"
            placeholder=" "
            onChange={handletextfieldchange}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handlesubmitbutton();
              }
            }}
          />
        </div>
        <Space h="xl" />
       {!autherror&&<Space h="xl" />}
        {autherror && <><div class="error">Invalid credentials</div><Space h="xl" /></>}

        {loading ? (
          <Center>
            <Loader />
          </Center>
        ) : (
          <Center><Button  variant="gradient" gradient={{ from: 'teal', to: 'lime', deg: 105 }} onClick={handlesubmitbutton}>
            Login
          </Button></Center>
        )}
      </Card>
    </Center>
    </>
  );
}

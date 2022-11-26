import { TextInput, Space, Button, Loader, Center, Card } from "@mantine/core";

import React, { useState } from "react";
import { endpoint, getCookie } from "../constants";
export default function SignUp(props) {
  const [username, setuser] = useState(" ");
  const [email, setemail] = useState(" ");
  const [password, setpassword] = useState(" ");
  const [password2, setpassword2] = useState(" ");
  const [usererror, setusererror] = useState(null);
  const [emailerror, setemailerror] = useState(null);
  const [password2error, setpassword2error] = useState(null);
  const [loading, setloading] = useState(false);
  function handletextfieldchange(e) {
    if (e.target.id === "name") {
      setuser(e.target.value);
    }
    if (e.target.id === "email") {
      setemail(e.target.value);
    }
    if (e.target.id === "password") {
      setpassword(e.target.value);
    }
    if (e.target.id === "password2") {
      setpassword2(e.target.value);
    }
  }
  function handlesubmitbutton() {
    setloading(true);
    setusererror(null);
    setpassword2error(null);
    setemailerror(null);
    const requestoptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCookie("csrftoken"),
      },
      body: JSON.stringify({
        username: username.toString(),
        email: email.toString(),
        password1: password.toString(),
        password2: password2.toString(),
      }),
    };
    fetch(endpoint + "/api/signup/", requestoptions)
      .then((response) => {
        setloading(false);
        if (!response.ok) {
          return response.json();
        }
        props.history.push("/login");
      })
      .then((data) => {
        if (data.error["username"] != undefined) {
          setusererror(data.error["username"]);
        }
        if (data.error["email"] != undefined) {
          setemailerror(data.error["email"]);
        }
        if (data.error["password2"] != undefined) {
          setpassword2error(data.error["password2"]);
        }
      });
  }
  return (
    <>
      <Space h={"10vh"} />
      <Center>
        <Card shadow="sm" p="lg" radius="md" withBorder style={{ width: 350 }}>
          <a href="/login">
            <div class="subtitle2">
              <span>&#8592;</span> {"Login"}
            </div>
          </a>
          <Space h="sm" />
          <div class="subtitle">Let's create your account!</div>
          <div class="input-container ic1">
            <TextInput
              required={true}
              error={usererror}
              label="Username"
              id="name"
              class="input"
              type="text"
              placeholder=" "
              onChange={handletextfieldchange}
            />
          </div>
          <Space h="sm" />
          <div class="input-container ic2">
            <TextInput
              label="Email"
              error={emailerror}
              id="email"
              class="input"
              type="text"
              placeholder=" "
              onChange={handletextfieldchange}
            />
          </div>
          <Space h="sm" />
          <div class="input-container ic2">
            <TextInput
              required={true}
              label="Password"
              id="password"
              class="input"
              type="password"
              placeholder=" "
              onChange={handletextfieldchange}
            />
          </div>
          <div class="input-container ic2">
            <TextInput
              required={true}
              error={password2error}
              label="Confirm password"
              id="password2"
              class="input"
              type="password"
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
          <Space h="xl" />
          <Space h="xl" />
          {loading ? (
            <Center>
              <Loader />
            </Center>
          ) : (
            <Center>
              <Button
                variant="gradient"
                gradient={{ from: "teal", to: "blue", deg: 60 }}
                onClick={handlesubmitbutton}
              >
                Create Account
              </Button>
            </Center>
          )}
        </Card>
      </Center>
    </>
  );
}

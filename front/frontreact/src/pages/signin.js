import { Loader, TextInput,Center } from "@mantine/core";
import React, { useState } from "react";
import { Space } from "tabler-icons-react";
import { get_redirect_uri, get_token } from "../constants";
import { endpoint } from "../constants";
export default function Signin(props) {
  const [username, setuser] = useState(" ");
  const [password, setpassword] = useState("password");
  const [autherror, setautherror] = useState(false);
  const [loading,setloading]=useState(false)
  function handletextfieldchange(e) {
    if (e.target.id === "username") {
      setuser(e.target.value);
    }
    if (e.target.id === "password") {
      setpassword(e.target.value);
    }
  }
  function handlesubmitbutton() {
    setautherror(false)
  setloading(true)
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
    fetch(endpoint+"/api/loginapi/", requestoptions).then((response) => {
      
      setloading(false)
      if (!response.ok) {
        setautherror(true);
        return null
      } 
      setautherror(false);
      return response.json()
    }).then((data)=>{
      if (data!=null){
        window.localStorage.setItem('token',data['token']);
        const requestoptions2 = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCookie("csrftoken"),
              'Authorization': `Token ${data['token']}`
          },
        };
        fetch(endpoint+"/api/drivename",requestoptions2) 
			.then((response) => {
				if (response.ok) {
           props.history.push("/");
				}
        else{
          window.location.replace(get_redirect_uri());;
        }
      })
    }
    })
     
  }
  return (
    <div class="parent">
      <div class="form2">
        <a href="/signup">
          <div class="subtitle2">
            {"Create an account "}

            <span>&#8594;</span>
          </div>
        </a>
        <div class="title">Welcome</div>
        
        <div class="input-container ic1">
          <TextInput
            label="Username"
            id="username"
            class="input"
            type="text"
            placeholder=" "
            onChange={handletextfieldchange}
          />
      
        </div>
        <div class="input-container ic2">
          <TextInput
            label="Password"
            id="password"
            class="input"
            type="password"
            placeholder=" "
            onChange={handletextfieldchange}
            onKeyDown={(e)=>{if(e.key==="Enter"){handlesubmitbutton()}}}
          />
          
        </div>
        <Space h="xl"/>
        {autherror && <div class="error">Invalid credentials</div>}

        {loading ?<Center><Loader/></Center>:
        <button type="text" class="submit" onClick={handlesubmitbutton}>
          Login
        </button>}
      </div>
    </div>
  );
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

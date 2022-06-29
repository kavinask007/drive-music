import { useState } from "react";
import { TextInput } from "@mantine/core";
import { Modal, Button, Group, Center, Space,LoadingOverlay } from "@mantine/core";
import { FolderPlus, SquarePlus } from "tabler-icons-react";
import { get_token ,endpoint} from "./constants/index";
import { showNotification } from '@mantine/notifications';
export function Addplaylist() {
  const [opened, setOpened] = useState(false);
  const [name, setName] = useState("");
  const [owner, setOwner] = useState("");
  const [id, setId] = useState("");
   const [visible, setVisible] = useState(false);

  function addPlaylist() {
    setVisible(true);
    const requestoptions = {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-CSRFToken": getCookie("csrftoken"),
						'Authorization':get_token()
				
			},
			body: JSON.stringify({
        name: name!=="" ? name : "Shared with me",
        owner: owner,
        playlistId: id  
			}),
		};
    fetch(endpoint+"/api/add-shared-playlist/", requestoptions).then((response) => {return response.json()})
    .then((data) => {
      setVisible(false)
      showNotification(
        {
          title:data['msg']}
      )
    })
  }
  return (
    <>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Add your Friend's playlist "
      >
       <LoadingOverlay visible={visible} />
        <TextInput
          defaultValue={"Shared with me"}
          placeholder="Playlist Name"
          label="Playlist Name"
          value={name}
          onChange={(event) => setName(event.currentTarget.value)}
        />
        <TextInput
          placeholder="Name"
          label="Playlist owner's Name"
          required
          value={owner}
          onChange={(event) => setOwner(event.currentTarget.value)}
          error={owner==""?"Can't be empty":false}
        />
        <TextInput
          placeholder="id"
          label="Playlist Id"
          required
          value={id}
          error={id==""?"Can't be empty":false}
          onChange={(event) => setId(event.currentTarget.value)}
          onKeyDown={(e)=>{if(e.key==="Enter" &&owner!=""){addPlaylist()}}}
        />
        <Space h="xl"></Space>
        <Center>
          <Button 
          disabled={owner==""||id==""?true:false}
          onClick={()=>addPlaylist()}>Add</Button>
        </Center>
      </Modal>
      <Center>
        <Button

          leftIcon={<FolderPlus />}
          variant="outline"
          styles={{
            outline: { color: "green" },
          }}
          onClick={() => setOpened(true)}
        >
          shared playlist
        </Button>
      </Center>
    </>
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
	return cookieValue;}

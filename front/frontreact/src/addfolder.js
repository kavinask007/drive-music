import { useState } from "react";
import { TextInput } from "@mantine/core";
import {
  Modal,
  Button,
  Center,
  Space,
  LoadingOverlay,
} from "@mantine/core";
import {endpoint, requestoptions } from "./constants/index";
import { showNotification } from "@mantine/notifications";
export function AddFolder(props) {
  const [opened, setOpened] = useState(false);
  const [name, setName] = useState("");
  const [visible, setVisible] = useState(false);

  function addPlaylist(props) {
    setVisible(true);
    requestoptions.method = "POST";
    requestoptions.body = JSON.stringify({
      foldername: name,
    });
    fetch(endpoint + "/api/create-folder/", requestoptions)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
      setOpened(false);
        showNotification({
          title: data["msg"],
        });
      });
  }
  return (
    <>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Add folder to your drive "
      >
        <LoadingOverlay visible={visible} />
        <TextInput
          defaultValue="All Songs"
          placeholder="folder name "
          label="folder Name"
          value={name}
          onChange={(event) => setName(event.currentTarget.value)}
          error={name == "" ? "Can't be empty" : false}
          onKeyDown={(e)=>{if(e.key==="Enter" &&name!=""){addPlaylist()}}}
        />

        <Space h="xl"></Space>
        <Center>
          <Button
            disabled={name == "" ? true : false}
            onClick={() => addPlaylist()}
          >
            Add
          </Button>
        </Center>
      </Modal>
      <Center>
      <span onClick={() => setOpened(true)}>
      { <props.trigger />}</span>
      </Center>
    </>
  );
}

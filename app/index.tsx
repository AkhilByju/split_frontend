import { View, Text, Button } from "react-native";
import { useState } from "react";
import axios from "axios";

export default function Index() {
  const [message, setMessage] = useState("");

  const apiCall = () => {
    axios.get('http://localhost:8080').then((data) => {
      console.log(data)
      setMessage(data.data);
    })
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Button onPress={apiCall} title="Make API Call" />
      <Text>{message}</Text>
    </View>
  );
}

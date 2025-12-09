import { View, Text, StyleSheet, Button, TouchableOpacity } from "react-native";
import { useState } from "react";
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';

const CreateBill = () => {
    const [facing, setFacing] = useState<CameraType>("back");
    const [permission, requestPermission] = useCameraPermissions();

    if (!permission) {
        // Add the screen when the persmission is not granted
        return <View />;
    }

    if (!permission.granted) { 
        return (
            <View style={styles.container}>
                <Text style={styles.message}>Permission to access camera is required!</Text>
                <Button onPress={requestPermission} title="grant permission"/>
            </View>
        )
    }

    function toggleCameraType() {
        setFacing(current => (current === "back" ? "front" : "back"));
    }

  return (
    <View style={styles.container}>
        <Text style={styles.title}>createBill</Text>
        <CameraView facing={facing}></CameraView>
        <View>
            <TouchableOpacity onPress={toggleCameraType}>
                <Text>Flip Camera</Text>
            </TouchableOpacity>
        </View>
    </View>
  )
}

export default CreateBill;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",     
        justifyContent: "flex-start", 
        paddingTop: 100,      
        backgroundColor: "#fff",  
    },
    title: {
        marginBottom: 40,
        fontSize: 32, 
    },
    message: {
        fontSize: 18,
    }
});
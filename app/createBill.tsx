import { View, Text, StyleSheet, Button, TouchableOpacity } from "react-native";
import { useState } from "react";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";

const CreateBill = () => {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [useCamera, setUseCamera] = useState(false);

  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Permission to access camera is required!</Text>
        <Button onPress={requestPermission} title="Grant permission" />
      </View>
    );
  }

  const toggleCameraType = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Button
          title={useCamera ? "Use Form" : "Use Camera"}
          onPress={() => setUseCamera((v) => !v)}
        />
        {useCamera && (
            <View>
          <TouchableOpacity onPress={toggleCameraType} style={styles.flipBtn}>
            <Text style={styles.flipText}>Flip</Text>
          </TouchableOpacity>
          </View>
        )}
      </View>

      {useCamera ? (
        <CameraView style={styles.camera} facing={facing} />
      ) : (
        <View style={styles.form}>
          <Text style={styles.title}>Create Bill</Text>
          {/* put your form inputs here */}
        </View>
      )}
    </View>
  );
};

export default CreateBill;

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#fff" 
  },
  topBar: {
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  camera: {
    marginTop: 25,
    height: "75%",
    width: "75%",
    alignSelf: "center",
    borderRadius: 16,
    overflow: "hidden",
  },
  cameraWindow: {
    width: "50%",
    height: 260,
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: "hidden",
  },
  form: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  title: { fontSize: 32, marginBottom: 12 },
  message: { fontSize: 18 },
  flipBtn: { padding: 10 },
  flipText: { fontSize: 16 },
});
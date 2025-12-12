import { View, Text, StyleSheet, Button, TouchableOpacity } from "react-native";
import { useState } from "react";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import CreatePartyForm from "../components/createPartyForm";
// import { useNavigation } from "expo-router";
import { api } from "../src/api";

const CreateBill = () => {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [useCamera, setUseCamera] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleSubmit = async ({
    displayName, merchant, subtotal, tax, tip
  }: {
    displayName: string;
    merchant: string;
    subtotal: number;
    tax: number;
    tip: number;
  }) => {
    try {
        setLoading(true);
        setError(null);

        // create the session
        const sessionResponse = await api.post('/sessions/create', {
            merchant, subtotal, tax, tip
        })

        const session = sessionResponse.data.session;
        console.log("Created session:", session);

        // Add the host as a user to the session
        const userResponse = await api.post(`/sessions/${session.code}/join`, {displayName, isHost: true});
        
        const hostUser = userResponse.data.user;
        console.log("Created host user:", hostUser);


        // On success, navigate to the bill screen
    } catch (error) {
        console.log(error);
        setError("An error occurred while creating the bill.");
    } finally {
        setLoading(false);
    }
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
          <CreatePartyForm 
            onSubmit={handleSubmit}
            loading={loading}
            error={error}
          />
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
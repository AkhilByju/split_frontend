import { View, Text, StyleSheet, Button, TouchableOpacity, Image } from "react-native";
import { useRef, useState } from "react";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import CreatePartyForm from "../components/createPartyForm";
import { router } from "expo-router";
import { api } from "../src/api";
import { extractTextFromImage, isSupported } from 'expo-text-extractor';

const CreateBill = () => {
  {/* Camera and form toggle */}
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [useCamera, setUseCamera] = useState(true);

  {/* Photo preview and capture */}
  const cameraRef = useRef<CameraView | null>(null);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [capturing, setCapturing] = useState(false);

  {/* OCR */}
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrError, setOcrError] = useState<string | null>(null);
  const [ocrLines, setOcrLines] = useState<string[]>([]);

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
        router.push(`/session/${session.code}`);
    } catch (error) {
        console.log(error);
        setError("An error occurred while creating the bill.");
    } finally {
        setLoading(false);
    }
  };

  const takePhoto = async () => {
    if (!cameraRef.current || capturing) return;

    try {
        setCapturing(true);
        const photo = await cameraRef.current.takePictureAsync({
            quality: 0.8,
            skipProcessing: true,   // might need to take off
        })

        if (photo.uri) {
            setPhotoUri(photo.uri);
        }
    } catch (error) {
        console.error("Error taking photo:", error);
    } finally {
        setCapturing(false);
    }
  };

  const runOcr = async (uri: string) => {
    try {
        setOcrLoading(true);
        setOcrError(null);

        if (!isSupported) {
            setOcrError("OCR is not supported on this device.");
            return;
        }

        const lines = await extractTextFromImage(uri);
        setOcrLines(lines);
        console.log("Extracted text lines:", lines);
        return lines;
    } catch (error: any) {
        setOcrError("Failed to extract text: " + error.message);
    } finally {
        setOcrLoading(false);
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
        photoUri ? (
            <View style={styles.preview}>
            <Image source={{ uri: photoUri }} style={styles.previewImg} />
            <View style={styles.previewActions}>
                <Button title="Retake" onPress={() => setPhotoUri(null)} />
                <Button
                    title={ocrLoading ? "Scanning..." : "Use Photo"}
                    disabled={ocrLoading}
                    onPress={async () => {
                        if (!photoUri) return;
                        const lines = await runOcr(photoUri);
                        if (!lines) return;

                        // MVP: just log / show on screen first
                        console.log(lines.join("\n"));
                    }}
                />
            </View>
                {ocrError ? <Text style={{ color: "red" }}>{ocrError}</Text> : null}

                {ocrLines.length > 0 ? (
                <View style={{ paddingTop: 10 }}>
                    <Text style={{ fontWeight: "600", marginBottom: 6 }}>Detected text</Text>
                    <Text selectable style={{ lineHeight: 18 }}>
                    {ocrLines.join("\n")}
                    </Text>
                </View>) : null}
            </View>
        ) : (
            <View style={{ flex: 1 }}>
            <CameraView ref={cameraRef} style={styles.camera} facing={facing} />
            <View style={styles.captureBar}>
                <TouchableOpacity
                onPress={takePhoto}
                disabled={capturing}
                style={[styles.captureBtn, capturing && { opacity: 0.6 }]}
                >
                <Text style={styles.captureText}>{capturing ? "..." : "Capture"}</Text>
                </TouchableOpacity>
            </View>
            </View>
        )
        ) : (
        <View style={styles.form}>
            <CreatePartyForm onSubmit={handleSubmit} loading={loading} error={error} />
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
  preview: { flex: 1, justifyContent: "center" },
  previewImg: {     
    height: "75%",
    width: "75%",
    alignSelf: "center",
    borderRadius: 16,
    overflow: "hidden",
    paddingBottom: 25
  },
  previewActions: { padding: 12, flexDirection: "row", justifyContent: "space-between" },
  captureBar: { position: "absolute", bottom: 20, left: 0, right: 0, alignItems: "center" },
  captureBtn: { paddingVertical: 14, paddingHorizontal: 22, borderRadius: 999, backgroundColor: "black" },
  captureText: { color: "white", fontWeight: "600" },

});
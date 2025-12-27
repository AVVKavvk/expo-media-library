import {
  CameraType,
  CameraView,
  useCameraPermissions,
  useMicrophonePermissions,
} from "expo-camera";
import { useRef, useState } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [microphonePermission, requestMicrophonePermission] =
    useMicrophonePermissions();
  const [isRecording, setIsRecording] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  if (!cameraPermission || !microphonePermission) {
    return <View />;
  }

  if (!cameraPermission.granted || !microphonePermission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need camera and microphone permissions
        </Text>
        <Button
          onPress={requestCameraPermission}
          title="Grant Camera Permission"
        />
        <Button
          onPress={requestMicrophonePermission}
          title="Grant Microphone Permission"
        />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  const handleRecord = async () => {
    if (!cameraRef.current) return;

    if (isRecording) {
      // Stop recording
      cameraRef.current.stopRecording();
      setIsRecording(false);
    } else {
      // Start recording
      setIsRecording(true);
      try {
        const video = await cameraRef.current.recordAsync({
          maxDuration: 60,
        });
        console.log("Video saved to:", video.uri);
      } catch (error) {
        console.error("Recording failed:", error);
      } finally {
        setIsRecording(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing={facing} />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
          <Text style={styles.text}>Flip</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, isRecording && styles.recordButton]}
          onPress={handleRecord}
        >
          <Text style={styles.text}>{isRecording ? "Stop" : "Record"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 64,
    flexDirection: "row",
    backgroundColor: "transparent",
    width: "100%",
    paddingHorizontal: 64,
    gap: 20,
  },
  button: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 15,
    borderRadius: 10,
  },
  recordButton: {
    backgroundColor: "rgba(220,20,60,0.7)",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});

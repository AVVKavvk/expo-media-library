import * as MediaLibrary from "expo-media-library";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
export default function Index() {
  const [songs, setSongs] = useState([]);

  const getSongs = async () => {
    try {
      const obj = await MediaLibrary.requestPermissionsAsync();
      console.log(obj);
      if (obj.status === MediaLibrary.PermissionStatus.GRANTED) {
        const res = await MediaLibrary.getAssetsAsync({ mediaType: "photo" });
        console.log("res", res);
      } else {
        console.log("Error");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getSongs();
  }, []);
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
    </View>
  );
}

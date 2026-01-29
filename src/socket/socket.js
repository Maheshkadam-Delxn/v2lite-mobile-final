import { io } from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";

let socket;

export const connectSocket = async () => {
  const token = await AsyncStorage.getItem("userToken");

  socket = io("https://socket-server-jj8a.onrender.com", {
    transports: ["websocket"],
    auth: {
      token,
    },
  });

  return socket;
};

export const getSocket = () => socket;

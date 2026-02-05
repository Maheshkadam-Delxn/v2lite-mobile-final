import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketContextType {
    socket: Socket | null;
    isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({ socket: null, isConnected: false });

export const useSocket = () => useContext(SocketContext);

import AsyncStorage from '@react-native-async-storage/async-storage';

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        let socketInstance: Socket | null = null;

        const initSocket = async () => {
            const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'https://lite-express-socketio.onrender.com';
            const token = await AsyncStorage.getItem('userToken');

            console.log(`[${new Date().toISOString()}] 🔌 Socket Init. URL: ${socketUrl}, Token: ${!!token}`);

            if (socketInstance) {
                socketInstance.disconnect();
            }

            socketInstance = io(socketUrl, {
                auth: {
                    token: token || ''
                },
                withCredentials: true,
                transports: ['websocket'],
                autoConnect: true,
                reconnection: true,
                reconnectionAttempts: 10,
                reconnectionDelay: 5000,
            });

            socketInstance.on('connect', () => {
                console.log(`[${new Date().toISOString()}] ✅ Socket Connected:`, socketInstance?.id);
                setIsConnected(true);
            });

            socketInstance.on('disconnect', (reason) => {
                console.log(`[${new Date().toISOString()}] ❌ Socket Disconnected. Reason:`, reason);
                setIsConnected(false);
            });

            socketInstance.on('connect_error', (err) => {
                console.log(`[${new Date().toISOString()}] ⚠️ Socket Connection Error:`, err.message);
                // Try with "Bearer" if plain token fails? No, usually server handles it.
            });

            socketInstance.on('error', (err) => {
                console.log(`[${new Date().toISOString()}] 🔴 Socket General Error:`, err);
            });

            setSocket(socketInstance);
        };

        initSocket();

        // Check for token changes every 10 seconds or rely on re-mount
        const interval = setInterval(async () => {
            const currentToken = await AsyncStorage.getItem('userToken');

            // If we have a token now but the socket was initialized without one (auth.token check)
            if (!isConnected && currentToken && socketInstance) {
                // @ts-ignore - socket.auth can be object or function, we treat as object here
                const authObj = socketInstance.auth;
                if (authObj && typeof authObj === 'object' && !authObj.token) {
                    console.log(`[${new Date().toISOString()}] 🔄 Token found late, re-initializing socket...`);
                    initSocket();
                }
            }
        }, 10000);

        return () => {
            clearInterval(interval);
            if (socketInstance) {
                socketInstance.disconnect();
            }
        };
    }, []);

    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
};

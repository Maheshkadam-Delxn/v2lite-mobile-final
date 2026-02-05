import { useEffect, useState, useCallback } from 'react';
import { useSocket } from '@/context/SocketContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useProjectChat = (projectId: string | null) => {
    const { socket, isConnected } = useSocket();
    const [messages, setMessages] = useState<any[]>([]);
    const [roomId, setRoomId] = useState<string | null>(null);

    // Clear messages when project changes
    useEffect(() => {
        setMessages([]);
        setRoomId(null);
    }, [projectId]);

    // Fetch History Effect
    useEffect(() => {
        if (!projectId) return;

        const fetchHistory = async () => {
            try {
                const token = await AsyncStorage.getItem('userToken');
                // Use the Socket Server URL for chat history, not the main backend
                const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'https://lite-express-socketio.onrender.com';
                const apiUrl = `${socketUrl}/api/chat/project/${projectId}`;

                console.log(`[${new Date().toISOString()}] 📥 Fetching history from:`, apiUrl);

                const response = await fetch(apiUrl, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                console.log(`[${new Date().toISOString()}] 📥 History Response Status:`, response.status);

                if (response.ok) {
                    const history = await response.json();
                    console.log(`[${new Date().toISOString()}] 📥 Loaded ${history.length} messages`);

                    if (Array.isArray(history)) {
                        setMessages(prev => {
                            const existingIds = new Set(prev.map(m => m.id || m._id));
                            const newUnique = history.filter(h => !existingIds.has(h._id || h.id));
                            return [...newUnique, ...prev].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
                        });
                    }
                } else {
                    console.log(`[${new Date().toISOString()}] ❌ Fetch failed:`, await response.text());
                }
            } catch (err) {
                console.log(`[${new Date().toISOString()}] ❌ History fetch error:`, err);
            }
        };

        fetchHistory();
    }, [projectId]);

    // Socket Connection Effect
    useEffect(() => {
        console.log(`[${new Date().toISOString()}] 🎣 useProjectChat effect triggered. Socket: ${!!socket}, Connected: ${isConnected}, ProjectId: ${projectId}`);

        if (!socket || !isConnected || !projectId) return;

        // 1. Join the Project Room
        console.log(`[${new Date().toISOString()}] 🤝 Emitting 'join_project_chat' for Project: ${projectId}`);
        socket.emit('join_project_chat', { projectId });

        // 2. Listen for Success
        const handleRoomJoined = (data: { roomId: string, projectId: string }) => {
            console.log(`[${new Date().toISOString()}] ✅ Room Joined Event:`, data);
            setRoomId(data.roomId);
        };

        // 3. Listen for Incoming Messages
        const handleNewMessage = (msg: any) => {
            console.log(`[${new Date().toISOString()}] 📩 Incoming Message Data:`, JSON.stringify(msg));

            // Log detailed sender information
            console.log(`[${new Date().toISOString()}] 📩 Sender Details:`, {
                sender: msg.sender,
                senderType: typeof msg.sender,
                senderId: msg.senderId,
                senderIdType: typeof msg.senderId,
                senderObject: typeof msg.sender === 'object' ? msg.sender : null
            });

            setMessages((prev) => {
                const newId = msg._id || msg.id;
                const msgSender = (typeof msg.sender === 'object' ? msg.sender?._id || msg.sender?.id : msg.sender)
                    || (typeof msg.senderId === 'object' ? msg.senderId?._id || msg.senderId?.id : msg.senderId);

                console.log(`[${new Date().toISOString()}] 📩 Extracted Sender ID:`, msgSender);

                // Check for duplicates (existing server message with same ID)
                if (newId && prev.some(m => (m._id === newId || m.id === newId) && !m.optimistic)) {
                    console.log(`[${new Date().toISOString()}] ⏭️ Skipping duplicate server message: ${newId}`);
                    return prev;
                }

                // Identify if this official message matches any optimistic message we already have
                const optimisticMatchIndex = prev.findIndex(m =>
                    m.optimistic &&
                    m.content === msg.content &&
                    (m.sender === msgSender || m.senderId === msgSender)
                );

                if (optimisticMatchIndex !== -1) {
                    console.log(`[${new Date().toISOString()}] 🔄 Replacing optimistic message with official one`);
                    const updated = [...prev];
                    updated[optimisticMatchIndex] = msg;
                    return updated.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
                }

                // If it's a completely new message (not an optimistic match and not a duplicate server message)
                console.log(`[${new Date().toISOString()}] ✅ Adding new message to state`);
                return [...prev, msg].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
            });
        };

        socket.on('room_joined', handleRoomJoined);
        socket.on('receive_message', handleNewMessage);

        // Compatibility listeners in case backend event names differ
        socket.on('message', handleNewMessage);
        socket.on('chat_message', handleNewMessage);
        socket.on('joined', handleRoomJoined);

        // Catch-all for debugging
        socket.onAny((eventName, ...args) => {
            console.log(`[${new Date().toISOString()}] 🌐 Incoming Event: ${eventName}`, JSON.stringify(args));
        });

        return () => {
            socket.off('room_joined', handleRoomJoined);
            socket.off('receive_message', handleNewMessage);
            socket.off('message', handleNewMessage);
            socket.off('chat_message', handleNewMessage);
            socket.off('joined', handleRoomJoined);
            socket.offAny();
        };
    }, [socket, isConnected, projectId]);

    // Function to send a message
    const sendMessage = useCallback(async (content: string, type: 'text' | 'image' = 'text') => {
        if (!socket || !projectId) {
            console.warn("Cannot send message: No socket connection or projectId");
            return;
        }

        // Get user info for "sender" field (to identify "me" vs "others" locally)
        const userData = await AsyncStorage.getItem('userData');
        const user = userData ? JSON.parse(userData) : null;
        const senderId = user ? (user.id || user._id) : 'me';

        console.log(`[${new Date().toISOString()}] 👤 Current User Data:`, {
            userId: senderId,
            userName: user?.name,
            userRole: user?.role,
            userEmail: user?.email
        });

        // 🚀 PAYLOAD ALIGNMENT (from Guide)
        // send_message: { "projectId": "id", "content": "text", "type": "text" }
        const payload = {
            projectId,
            content,
            type
        };

        // Optimistic Update (We add sender info locally for UI)
        console.log(`[${new Date().toISOString()}] 📤 Sending Message:`, JSON.stringify(payload));
        console.log(`[${new Date().toISOString()}] 📤 Socket Connected:`, socket.connected, 'Socket ID:', socket.id);

        const optimisticMsg = {
            ...payload,
            sender: senderId,
            senderId: senderId, // Add both for compatibility
            id: `opt-${Date.now()}`,
            optimistic: true,
            createdAt: new Date().toISOString()
        };

        setMessages(prev => [...prev, optimisticMsg]);

        // Emit standard event
        socket.emit('send_message', payload);

        // Also emit 'message' as a fallback if the server listens for it
        socket.emit('message', payload);

        console.log(`[${new Date().toISOString()}] ✅ Message emitted to server`);

    }, [socket, projectId]);

    return { messages, sendMessage, roomId, isConnected };
};

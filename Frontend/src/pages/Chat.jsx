import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import UserSearch from "../components/UserSearch";
import ChatWindow from "../components/ChatWindow";
import socket from "../socket";

const Chat = () => {
  const { user, logout } = useAuth();
  const [selectedUser, setSelectedUser] = useState(null);
  const [messagesMap, setMessagesMap] = useState({});
  const [typingUsers, setTypingUsers] = useState({}); // ✅ fix: moved inside

  const handleReceiveMessage = useCallback(({ senderId, message, timestamp }) => {
    const safeTimestamp = timestamp || new Date().toISOString();

    setMessagesMap((prev) => ({
      ...prev,
      [senderId]: [
        ...(prev[senderId] || []),
        { text: message, fromSelf: false, timestamp: safeTimestamp },
      ],
    }));
  }, []);

  useEffect(() => {
    if (!user?.id) return;

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("join", user.id);
    socket.on("receive-message", handleReceiveMessage);

    // ✅ Typing handlers
    socket.on("typing", ({ senderId }) => {
      setTypingUsers((prev) => ({ ...prev, [senderId]: true }));
    });

    socket.on("stop-typing", ({ senderId }) => {
      setTypingUsers((prev) => {
        const updated = { ...prev };
        delete updated[senderId];
        return updated;
      });
    });

    return () => {
      socket.off("receive-message", handleReceiveMessage);
      socket.off("typing");
      socket.off("stop-typing");
    };
  }, [user, handleReceiveMessage]);

  const handleSendMessage = (text) => {
    if (!selectedUser) return;

    socket.emit("send-message", {
      senderId: user.id,
      receiverId: selectedUser.id,
      message: text,
    });

    setMessagesMap((prev) => ({
      ...prev,
      [selectedUser.id]: [
        ...(prev[selectedUser.id] || []),
        {
          text,
          fromSelf: true,
          timestamp: new Date().toISOString(),
        },
      ],
    }));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Welcome, {user?.username}</h1>
        <button
          onClick={logout}
          className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden border rounded-lg shadow-lg">
        <div className="w-2/3 bg-gray-800 p-4 flex flex-col">
          {selectedUser ? (
            <ChatWindow
              selectedUser={selectedUser}
              messages={messagesMap[selectedUser.id] || []}
              onSend={handleSendMessage}
              currentUserId={user.id}
              isTyping={typingUsers[selectedUser.id] || false} // ✅ passed
            />
          ) : (
            <p className="text-center text-gray-400 mt-20">
              👈 Select a user to start chatting
            </p>
          )}
        </div>

        <div className="w-1/3 bg-gray-700 p-4 border-l overflow-y-auto">
          <UserSearch onUserSelect={setSelectedUser} />
        </div>
      </div>
    </div>
  );
};

export default Chat;

import { useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import socket from "../socket";

const ChatWindow = ({ selectedUser, messages, onSend, isTyping, currentUserId }) => {
  const [text, setText] = useState("");
  const messagesEndRef = useRef(null);
  const typingTimeout = useRef(null);

  // ✅ Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ Handle sending message
  const handleSend = () => {
    if (!text.trim()) return;

    onSend(text.trim());
    setText("");

    // Stop typing when message sent
    socket.emit("stop-typing", {
      senderId: currentUserId,
      receiverId: selectedUser.id,
    });
  };

  // ✅ Emit typing and debounce stop-typing
  const handleTyping = (e) => {
  setText(e.target.value);
  console.log("✍️ Typing sent");
  socket.emit("typing", { senderId: currentUserId, receiverId: selectedUser.id });

  if (typingTimeout.current) {
    clearTimeout(typingTimeout.current);
  }

  typingTimeout.current = setTimeout(() => {
    console.log("🛑 Stop typing sent");
    socket.emit("stop-typing", { senderId: currentUserId, receiverId: selectedUser.id });
  }, 1000);
  };


  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="mb-2 font-semibold text-lg border-b pb-2">
        Chatting with {selectedUser.username}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-3">
        {messages.map((msg, idx) => {
          if (!msg.text || !msg.timestamp) {
            console.warn("❗ Invalid msg at idx:", idx, msg);
            return null;
          }

          return (
            <div key={idx} className={`flex ${msg.fromSelf ? "justify-end" : "justify-start"}`}>
              {!msg.fromSelf && (
                <div className="flex items-center justify-center w-8 h-8 bg-blue-500 rounded-full text-white text-sm font-bold mr-2">
                  {selectedUser.username.charAt(0).toUpperCase()}
                </div>
              )}
              <div
                className={`p-3 rounded-lg max-w-xs ${
                  msg.fromSelf ? "bg-blue-600 text-white" : "bg-gray-700 text-white"
                }`}
              >
                <div className="text-sm">{msg.text}</div>
                <div className="text-xs text-gray-300 mt-1 text-right">
                  {format(new Date(msg.timestamp), "hh:mm a")}
                </div>
              </div>
            </div>
          );
        })}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="text-sm text-gray-400 pl-2 animate-pulse">
            ✍️ {selectedUser.username} is typing...
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="mt-3 flex">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 p-2 rounded-l bg-gray-100 text-black"
          value={text}
          onChange={handleTyping}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          className="bg-green-600 px-4 py-2 rounded-r text-white hover:bg-green-700"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;

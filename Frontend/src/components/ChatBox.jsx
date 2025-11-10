const ChatBox = ({ selectedUser }) => {
  return (
    <div className="p-4 w-full max-w-2xl mx-auto">
      {selectedUser ? (
        <div className="bg-gray-800 p-4 rounded">
          <h2 className="text-xl font-bold mb-2">Chat with {selectedUser.username}</h2>
          {/* Messages and input will go here */}
          <p className="italic text-gray-400">[Message area coming soon]</p>
        </div>
      ) : (
        <p className="text-center text-gray-500">Select a user to start chatting</p>
      )}
    </div>
  );
};

export default ChatBox;

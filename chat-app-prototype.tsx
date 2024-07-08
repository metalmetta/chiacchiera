import React, { useState, useEffect, useRef } from 'react';
import { Send, ImagePlus } from 'lucide-react';

const ChatApp = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [currentUser, setCurrentUser] = useState('User1');
  const [selectedImage, setSelectedImage] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);

  const users = ['User1', 'User2'];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputMessage.trim() !== '' || selectedImage) {
      const newMessage = {
        id: Date.now(),
        text: inputMessage,
        user: currentUser,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        image: selectedImage
      };
      setMessages([...messages, newMessage]);
      setInputMessage('');
      setSelectedImage(null);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const switchUser = () => {
    setCurrentUser(currentUser === 'User1' ? 'User2' : 'User1');
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const openFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-purple-50">
      <div className="bg-purple-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Chat App</h1>
        <button onClick={switchUser} className="bg-purple-700 px-3 py-1 rounded">
          Switch to {currentUser === 'User1' ? 'User2' : 'User1'}
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-4 ${
              message.user === currentUser ? 'text-right' : 'text-left'
            }`}
          >
            <div
              className={`inline-block p-2 rounded-lg ${
                message.user === currentUser
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-300 text-black'
              }`}
            >
              {message.image && (
                <img src={message.image} alt="Attached" className="max-w-full h-auto rounded mb-2" />
              )}
              <p>{message.text}</p>
              <span className="text-xs opacity-75">{message.timestamp}</span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSendMessage} className="p-4 bg-white">
        <div className="flex items-center mb-2">
          <button
            type="button"
            onClick={openFileInput}
            className="bg-purple-500 text-white p-2 rounded-full mr-2 hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <ImagePlus size={20} />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageSelect}
            accept="image/*"
            className="hidden"
          />
          {selectedImage && (
            <div className="text-sm text-purple-600">Image selected</div>
          )}
        </div>
        <div className="flex">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 border rounded-l-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            ref={inputRef}
          />
          <button
            type="submit"
            className="bg-purple-500 text-white px-4 rounded-r-lg hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatApp;

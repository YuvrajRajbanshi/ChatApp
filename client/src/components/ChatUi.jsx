import React, { useState, useRef, useEffect } from "react";
import { IoSendOutline } from "react-icons/io5";
import { IoMdContacts } from "react-icons/io";
import { BsThreeDotsVertical } from "react-icons/bs";
import axios from "axios";

const ChatUi = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello there", sender: "yuvraj" },
    { id: 2, text: "Hi there!", sender: "You" },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (input.trim() === "" || isLoading) return;

    try {
      setIsLoading(true);
      setError(null);

      // Add user message
      const userMessage = {
        id: messages.length + 1,
        text: input,
        sender: "You",
      };
      setMessages((prev) => [...prev, userMessage]);
      setInput("");

      // Call API
      const res = await axios.post("http://localhost:5000/generate", {
        prompt: input,
      });

      // Add AI response
      const aiMessage = {
        id: messages.length + 2,
        text: res.data?.message || "I got your message!",
        sender: "yuvraj",
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error("API Error:", err);
      setError("Failed to get response. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="h-screen bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 flex items-center justify-center">
      <div className="w-full max-w-2xl h-[85vh] bg-white/70 backdrop-blur-lg rounded-3xl shadow-lg flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-md p-4 flex items-center justify-between border-b">
          <div className="flex items-center gap-3">
            <IoMdContacts size={28} className="text-blue-500" />
            <h2 className="text-lg font-semibold">
              Chat with <span className="text-pink-500">Vani</span>
            </h2>
          </div>
          <BsThreeDotsVertical
            size={22}
            className="text-gray-500 cursor-pointer"
          />
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex mb-4 ${
                message.sender === "You" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs md:max-w-md px-4 py-2 rounded-2xl shadow-md ${
                  message.sender === "You"
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-700 border border-gray-300"
                }`}
              >
                {message.text}
                <div className="text-xs mt-1 text-gray-400">
                  {new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          ))}

          {/* AI Typing Animation */}
          {isLoading && (
            <div className="flex justify-start mb-4">
              <div className="bg-white border border-gray-300 px-4 py-2 rounded-2xl shadow-md">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="text-red-500 text-sm text-center p-2">{error}</div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 bg-white border-t flex items-center">
          <form
            onSubmit={handleSubmit}
            className="w-full flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 p-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
              placeholder="Type a message..."
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:bg-blue-300 transition-colors"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <IoSendOutline size={20} />
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatUi;

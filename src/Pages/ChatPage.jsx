import { useState, useEffect, useRef } from "react";
import { AiOutlineSearch, AiOutlineSend } from "react-icons/ai";
import { FiImage, FiMoreVertical, FiMenu, FiX, FiBriefcase, FiHome, FiMessageCircle } from "react-icons/fi";
import { useChatStore } from "../stores/chatStore";
import { useUserStore } from "../stores/userStore";
import { useNavigate } from "react-router-dom";

export default function ChatPage() {
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Store state
  const { accessToken, user } = useUserStore();
  const {
    chats,
    currentChat,
    messages,
    loading,
    unreadCount,
    fetchChats,
    fetchMessages,
    sendWebSocketMessage,
    sendTypingIndicator,
    connectWebSocket,
    disconnectWebSocket,
    markAsRead,
  } = useChatStore();

  // Local state
  const [activeChat, setActiveChat] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState('all'); // ✅ NEW: 'all', 'product', 'direct'
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // ✅ Load chats on mount with filter
  useEffect(() => {
    if (accessToken) {
      fetchChats(filterType); // Pass filter type
    }
  }, [accessToken, filterType]);

  // ✅ FIXED: Connect to WebSocket and fetch messages when chat is selected
  useEffect(() => {
    if (activeChat && accessToken) {
      console.log('🔵 Loading chat:', activeChat.chat_id); // Debug log
      
      // Fetch messages for this chat
      fetchMessages(activeChat.chat_id); // ✅ FIXED: Removed accessToken param (not needed with interceptor)
      
      // Connect to WebSocket
      connectWebSocket(activeChat.chat_id, accessToken);
      
      // Mark as read
      markAsRead(activeChat.chat_id);
      
      return () => {
        disconnectWebSocket();
      };
    }
  }, [activeChat?.chat_id, accessToken]);

  // Auto-scroll to bottom when new messages arrive
  //useEffect(() => {
   // scrollToBottom();
  //}, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleChatSelect = (chat) => {
    console.log('📨 Selected chat:', chat); // Debug log
    setActiveChat(chat);
    setSidebarOpen(false);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!messageInput.trim()) return;
    
    // Send via WebSocket
    sendWebSocketMessage(messageInput);
    
    // Clear input
    setMessageInput("");
    
    // Stop typing indicator
    sendTypingIndicator(false);
  };

  const handleTyping = (e) => {
    setMessageInput(e.target.value);
    
    // Send typing indicator
    if (e.target.value.length > 0) {
      sendTypingIndicator(true);
      
      // Clear previous timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Stop typing after 2 seconds of inactivity
      typingTimeoutRef.current = setTimeout(() => {
        sendTypingIndicator(false);
      }, 2000);
    } else {
      sendTypingIndicator(false);
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // ✅ FIXED: Better chat filtering
  const filteredChats = chats.filter(chat => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesUser = 
        chat.other_user.first_name?.toLowerCase().includes(query) ||
        chat.other_user.surname?.toLowerCase().includes(query) ||
        chat.other_user.last_name?.toLowerCase().includes(query);
      
      const matchesListing = 
        chat.listing?.title?.toLowerCase().includes(query);
      
      return matchesUser || matchesListing;
    }
    return true;
  });

  // ✅ NEW: Get chat icon based on type
  const getChatIcon = (chat) => {
    if (chat.chat_type === 'product') {
      return chat.listing?.type === 'job' ? FiBriefcase : FiHome;
    }
    return FiMessageCircle;
  };

  return (
    <div className="flex h-screen max-w-6xl mx-auto py-10 md:px-4 pt-13 md:pt-22 gap-4">
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-opacity-50 z-40 md:z-10 md:hidden"
          style={{background:'#0000001f'}}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Chat Sidebar */}
      <aside className={`
        rounded-lg w-[300px] flex-col bg-white z-50 md:z-10
        ${sidebarOpen ? 'fixed left-0 top-0 h-full' : 'hidden'}
        md:flex md:relative
      `}>
        <div className="p-4 font-bold text-lg flex items-center justify-between">
          <span>Chats</span>
          {/* Close button for mobile */}
          <button 
            className="md:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Search */}
        <div className="px-4">
          <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2">
            <AiOutlineSearch className="text-gray-500" size={20} />
            <input
              type="text"
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent focus:outline-none w-full text-sm"
            />
          </div>
        </div>

        {/* ✅ NEW: Filter Tabs */}
        <div className="flex mt-4 border-b text-sm font-medium">
          <button 
            onClick={() => setFilterType('all')}
            className={`px-4 py-2 ${
              filterType === 'all'
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-600'
            }`}
          >
            All
          </button>
          <button 
            onClick={() => setFilterType('product')}
            className={`px-4 py-2 ${
              filterType === 'product'
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-600'
            }`}
          >
            Products
          </button>
          <button 
            onClick={() => setFilterType('direct')}
            className={`px-4 py-2 ${
              filterType === 'direct'
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-600'
            }`}
          >
            Direct
          </button>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto border-gray-100 border-1 mt-3 bg-white p-1 rounded-lg">
          {loading && chats.length === 0 ? (
            <div className="p-4 text-center text-gray-500">Loading...</div>
          ) : filteredChats.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              {searchQuery ? 'No chats found' : 'No chats yet'}
            </div>
          ) : (
            filteredChats.map((chat) => {
              const Icon = getChatIcon(chat);
              
              return (
                <div
                  key={chat.chat_id}
                  onClick={() => handleChatSelect(chat)}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-100 ${
                    activeChat?.chat_id === chat.chat_id ? "bg-gray-100" : ""
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-medium flex items-center gap-2">
                      {chat.other_user.first_name} {chat.other_user.surname || chat.other_user.last_name}
                      {/* ✅ NEW: Chat type indicator */}
                      {chat.chat_type === 'direct' && (
                        <FiMessageCircle className="w-3 h-3 text-purple-500" />
                      )}
                    </div>
                    {chat.last_message?.time_ago && (
                      <span className="text-xs text-gray-400">
                        {chat.last_message.time_ago}
                      </span>
                    )}
                  </div>
                  
                  {/* ✅ NEW: Show listing for product chats */}
                  {chat.chat_type === 'product' && chat.listing && (
                    <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                      <Icon className="w-3 h-3" />
                      <span className="truncate">{chat.listing.title}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500 truncate flex-1">
                      {chat.last_message?.content || 'No messages yet'}
                    </div>
                    {chat.unread_count > 0 && (
                      <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-0.5 ml-2">
                        {chat.unread_count}
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </aside>

      {/* Right Chat Section */}
      <main className="flex-1 flex flex-col p-1 md:p-4 border-gray-100 border-1">
        {!activeChat ? (
          <div className="flex flex-col items-center justify-center h-full text-center relative">
             <button 
                  className="md:hidden absolute top-4 left-4"
                  onClick={() => setSidebarOpen(true)}
                >
                  <FiMenu size={22} />
                </button>
            <img src="/empty-chat.png" alt="empty" className="w-64 mb-4" />
            <p className="text-gray-600 mb-2">You do not have any message</p>
            <button 
              onClick={() => navigate('/properties')}
              className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600"
            >
              Continue exploring
            </button>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <header className="flex items-center justify-between p-4 border-b border-gray-100 bg-white rounded-t-lg">
              <div className="flex gap-3 items-center">
                {/* Mobile menu button */}
                <button 
                  className="md:hidden"
                  onClick={() => setSidebarOpen(true)}
                >
                  <FiMenu size={22} />
                </button>
                
                {/* Avatar */}
                <div className="w-10 h-10 bg-[#2A3DD0] rounded-full flex items-center justify-center text-white font-bold">
                  {activeChat.other_user.first_name?.charAt(0)}
                  {(activeChat.other_user.surname || activeChat.other_user.last_name)?.charAt(0)}
                </div>
                
                <div>
                  <h2 className="font-semibold">
                    {activeChat.other_user.first_name} {activeChat.other_user.surname || activeChat.other_user.last_name}
                  </h2>
                  <p className="text-xs text-green-500">
                    {isTyping ? 'Typing...' : 'Online'}
                  </p>
                </div>
              </div>
              
              <FiMoreVertical className="cursor-pointer" />
            </header>

            {/* ✅ FIXED: Listing Info - Only show for product chats */}
            {currentChat?.chat_type === 'product' && currentChat?.listing && (
              <div className="bg-white p-2 rounded-lg my-2 flex gap-3">
                <img 
                  src={currentChat.listing.thumbnail || "/Frame.png"} 
                  alt="listing" 
                  className="w-20 h-20 object-cover rounded-lg" 
                />
                <div>
                  <p className="text-xs text-gray-500 mb-1">
                    You're chatting about this listing
                  </p>
                  <h3 className="font-semibold text-gray-800 text-base mb-1">
                    {currentChat.listing.title}
                  </h3>
                  {currentChat.listing.price && (
                    <p className="text-blue-600 font-semibold text-sm">
                      ₦{currentChat.listing.price}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* ✅ NEW: Direct Chat Info */}
            {currentChat?.chat_type === 'direct' && (
              <div className="bg-purple-50 p-3 rounded-lg my-2 flex items-center gap-2">
                <FiMessageCircle className="w-5 h-5 text-purple-600" />
                <p className="text-sm text-purple-700">Direct conversation</p>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto text-sm flex flex-col gap-2 border-t border-gray-100 bg-gray-50">
              {loading && messages.length === 0 ? (
                <div className="text-center text-gray-500">Loading messages...</div>
              ) : messages.length === 0 ? (
                <div className="text-center text-gray-500">
                  No messages yet. Start the conversation!
                </div>
              ) : (
                messages.map((msg, index) => (
                  <div
                    key={msg.id || index}
                    className={`flex ${msg.is_own_message ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] p-3 rounded-lg ${
                        msg.is_own_message
                          ? 'bg-blue-500 text-white'
                          : 'bg-white border border-gray-200'
                      }`}
                    >
                      <p className="break-words">{msg.content}</p>
                      <div className={`text-xs mt-1 ${
                        msg.is_own_message ? 'text-blue-100' : 'text-gray-400'
                      }`}>
                        {formatTime(msg.created_at)}
                        {msg.is_own_message && msg.is_read && ' ✓✓'}
                      </div>
                    </div>
                  </div>
                ))
              )}
              
              {/* Typing indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-200 p-3 rounded-lg">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <footer className="border-t border-gray-100 bg-white rounded-b-lg">
              <form onSubmit={handleSendMessage}>
                <div className="bg-gray-100 rounded-xl flex items-center gap-3 p-3 mt-1">
                  <FiImage 
                    size={22} 
                    className="text-gray-500 cursor-pointer hover:text-gray-700" 
                  />
                  <input
                    type="text"
                    placeholder="Type your message..."
                    value={messageInput}
                    onChange={handleTyping}
                    className="flex-1 bg-transparent px-3 py-2 text-sm focus:outline-none"
                  />
                  <button type="submit" disabled={!messageInput.trim()}>
                    <AiOutlineSend 
                      size={22} 
                      className={`cursor-pointer ${
                        messageInput.trim() 
                          ? 'text-orange-500 hover:text-orange-600' 
                          : 'text-gray-400'
                      }`}
                    />
                  </button>
                </div>
              </form>
            </footer>
          </>
        )}
      </main>
    </div>
  );
}
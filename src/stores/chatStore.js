/**
 * UPDATED CHAT STORE - Supporting Product & Direct Chats
 * File: stores/chatStore.jsx
 */

import { create } from 'zustand';
import api from '../utils/api';  // ✅ Import interceptor
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL;
const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8000';

export const useChatStore = create((set, get) => ({
  chats: [],
  currentChat: null,
  messages: [],
  unreadCount: 0,
  loading: false,
  socket: null,
  isTyping: false,

  // ============================================
  // START PRODUCT CHAT (About Job/Property)
  // ============================================
  startProductChat: async (listingType, listingId) => {
    set({ loading: true });
    
    try {
      const response = await api.post('/chat/product/start/', { 
        listing_type: listingType, 
        listing_id: listingId 
      });
      
      set({ 
        currentChat: response.data, 
        loading: false 
      });
      
      toast.success(
        response.data.created 
          ? `Started chat with ${response.data.recipient.first_name}` 
          : 'Opening existing chat'
      );
      
      return { 
        success: true, 
        chatId: response.data.chat_id,
        chatType: 'product',
        created: response.data.created,
      };
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Failed to start chat';
      toast.error(errorMsg);
      set({ loading: false });
      return { success: false, error: errorMsg };
    }
  },

  // ============================================
  // START DIRECT CHAT (User-to-User)
  // ============================================
  startDirectChat: async (recipientId) => {
    set({ loading: true });
    
    try {
      const response = await api.post('/chat/direct/start/', { 
        recipient_id: recipientId 
      });
      
      set({ 
        currentChat: response.data, 
        loading: false 
      });
      
      toast.success(
        response.data.created 
          ? `Started conversation with ${response.data.recipient.first_name}` 
          : 'Opening existing conversation'
      );
      
      return { 
        success: true, 
        chatId: response.data.chat_id,
        chatType: 'direct',
        created: response.data.created,
      };
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Failed to start chat';
      
      if (errorMsg === 'Cannot chat with yourself') {
        toast.error("You can't message yourself!");
      } else {
        toast.error(errorMsg);
      }
      
      set({ loading: false });
      return { success: false, error: errorMsg };
    }
  },

  // ============================================
  // FETCH ALL CHATS (With Type Filter)
  // ============================================
  fetchChats: async (filterType = 'all') => {
    set({ loading: true });
    
    try {
      const response = await api.get(`/chat/?type=${filterType}`);
      
      set({ 
        chats: response.data.chats, 
        loading: false 
      });
      
      // Calculate total unread
      const totalUnread = response.data.chats.reduce(
        (sum, chat) => sum + chat.unread_count, 
        0
      );
      set({ unreadCount: totalUnread });
      
      return { 
        success: true,
        totalCount: response.data.total_count,
        productChats: response.data.product_chats,
        directChats: response.data.direct_chats,
      };
    } catch (error) {
      console.error('Failed to fetch chats:', error);
      set({ loading: false });
      return { success: false };
    }
  },

  // ============================================
  // FETCH MESSAGES (Works for Both Types)
  // ============================================
  fetchMessages: async (chatId, page = 1) => {
    set({ loading: true });
    
    try {
      const response = await api.get(`/chat/${chatId}/messages/?page=${page}`);
      
      set({ 
        messages: response.data.messages,
        currentChat: {
          chat_id: response.data.chat_id,
          chat_type: response.data.chat_type,  // ✅ NEW
          other_user: response.data.other_user,
          listing: response.data.listing,  // null for direct chats
        },
        loading: false 
      });
      
      return { success: true };
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      set({ loading: false });
      return { success: false };
    }
  },

  // ============================================
  // SEND MESSAGE (Works for Both Types)
  // ============================================
  sendMessage: async (chatId, content) => {
    try {
      const response = await api.post(`/chat/${chatId}/send/`, { content });
      
      const messages = get().messages;
      const newMessage = {
        ...response.data,
        is_own_message: true,
      };
      set({ messages: [...messages, newMessage] });
      
      return { success: true };
    } catch (error) {
      toast.error('Failed to send message');
      return { success: false };
    }
  },

  // ============================================
  // MARK AS READ
  // ============================================
  markAsRead: async (chatId) => {
    try {
      await api.post(`/chat/${chatId}/read/`);
      
      const chats = get().chats.map(chat => {
        if (chat.chat_id === chatId) {
          return { ...chat, unread_count: 0 };
        }
        return chat;
      });
      
      set({ chats });
      
      const totalUnread = chats.reduce((sum, chat) => sum + chat.unread_count, 0);
      set({ unreadCount: totalUnread });
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  },

  // ============================================
  // FETCH UNREAD COUNT
  // ============================================
  fetchUnreadCount: async () => {
    try {
      const response = await api.get('/chat/unread/');
      set({ unreadCount: response.data.total_unread });
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  },

  // ============================================
  // WEBSOCKET MANAGEMENT
  // ============================================
  connectWebSocket: (chatId, accessToken) => {
    const existingSocket = get().socket;
    if (existingSocket) {
      existingSocket.close();
    }

    const socket = new WebSocket(
      `${WS_URL}/ws/chat/${chatId}/?token=${accessToken}`
    );
    
    socket.onopen = () => {
      console.log('✅ WebSocket connected to chat:', chatId);
    };
    
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === 'connection_established') {
        console.log('WebSocket connection established');
      } 
      else if (data.type === 'chat_message') {
        const messages = get().messages;
        const currentUser = get().currentChat?.other_user;
        
        const newMessage = {
          id: data.message_id,
          content: data.message,
          sender: data.sender,
          created_at: data.created_at,
          is_read: data.is_read,
          is_own_message: data.sender.id !== currentUser?.id,
        };
        
        set({ messages: [...messages, newMessage] });
        
        const chats = get().chats.map(chat => {
          if (chat.chat_id === chatId) {
            return {
              ...chat,
              last_message: {
                content: data.message,
                created_at: data.created_at,
              }
            };
          }
          return chat;
        });
        set({ chats });
      } 
      else if (data.type === 'typing') {
        set({ isTyping: data.is_typing });
      } 
      else if (data.type === 'messages_read') {
        const messages = get().messages.map(msg => ({
          ...msg,
          is_read: true,
        }));
        set({ messages });
      }
      else if (data.type === 'error') {
        console.error('WebSocket error:', data.message);
        toast.error(data.message);
      }
    };
    
    socket.onerror = (error) => {
      console.error('❌ WebSocket error:', error);
      toast.error('Connection error. Please refresh.');
    };
    
    socket.onclose = () => {
      console.log('🔌 WebSocket disconnected');
    };
    
    set({ socket });
    return socket;
  },

  disconnectWebSocket: () => {
    const socket = get().socket;
    if (socket) {
      socket.close();
      set({ socket: null });
    }
  },

  sendWebSocketMessage: (content) => {
    const socket = get().socket;
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        type: 'chat_message',
        message: content
      }));
    } else {
      console.error('WebSocket is not connected');
      toast.error('Connection lost. Please refresh.');
    }
  },

  sendTypingIndicator: (isTyping) => {
    const socket = get().socket;
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        type: 'typing',
        is_typing: isTyping
      }));
    }
  },

  markMessagesRead: () => {
    const socket = get().socket;
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        type: 'mark_read'
      }));
    }
  },

  addMessage: (message) => {
    const messages = get().messages;
    set({ messages: [...messages, message] });
  },

  clearMessages: () => {
    set({ messages: [], currentChat: null });
  },

  resetStore: () => {
    const socket = get().socket;
    if (socket) {
      socket.close();
    }
    
    set({
      chats: [],
      currentChat: null,
      messages: [],
      unreadCount: 0,
      loading: false,
      socket: null,
      isTyping: false,
    });
  },
}));
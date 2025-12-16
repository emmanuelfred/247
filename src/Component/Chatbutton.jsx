import { useState } from 'react';
import { BsChatDots } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import { useChatStore } from '../stores/chatStore';
import { useUserStore } from '../stores/userStore';
import toast from 'react-hot-toast';

/**
 * ChatButton Component
 * Add this to Job/Property detail pages
 * 
 * Usage:
 * <ChatButton listingType="job" listingId={jobId} ownerId={job.posted_by.id} />
 * <ChatButton listingType="property" listingId={propertyId} ownerId={property.posted_by.id} />
 */

export default function ChatButton({ listingType, listingId, ownerId }) {
  const navigate = useNavigate();
  const { startProductChat } = useChatStore();
  const { accessToken, user } = useUserStore();
  const [loading, setLoading] = useState(false);

  const handleStartChat = async () => {
    // Check if user is logged in
    if (!accessToken || !user) {
      toast.error('Please login to start a chat');
      navigate('/login');
      return;
    }

    // Prevent chatting with yourself
    if (user.id === ownerId) {
      toast.error('You cannot chat with yourself');
      return;
    }

    setLoading(true);

    try {
      const result = await startProductChat(listingType, listingId);
      
      if (result.success) {
        // Navigate to chat page with the chat ID
        navigate(`/chat/${result.chatId}`);
      } else {
        toast.error('Failed to start chat');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleStartChat}
      disabled={loading}
      className="flex flex-1 items-center justify-center gap-2 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
    >
      <BsChatDots size={20} />
      {loading ? 'Starting chat...' : `Chat Now`}
    </button>
  );
}

// Alternative compact version (for mobile or smaller spaces)
export function ChatButtonCompact({ listingType, listingId, ownerId }) {
  const navigate = useNavigate();
  const { startChat } = useChatStore();
  const { accessToken, user } = useUserStore();
  const [loading, setLoading] = useState(false);

  const handleStartChat = async () => {
    if (!accessToken || !user) {
      toast.error('Please login to start a chat');
      navigate('/login');
      return;
    }

    if (user.id === ownerId) {
      toast.error('You cannot chat with yourself');
      return;
    }

    setLoading(true);

    try {
      const result = await startChat(listingType, listingId, accessToken);
      
      if (result.success) {
        navigate(`/chat/${result.chatId}`);
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleStartChat}
      disabled={loading}
      className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
      title="Start chat"
    >
      <BsChatDots size={20} />
    </button>
  );
}
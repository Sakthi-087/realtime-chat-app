import React, { useEffect, useRef, memo, useCallback } from "react";
import { useChatStore } from "../store/useChatStore";
import MessageInput from "./MessageInput";
import ChatHeader from "./ChatHeader";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { formatMessageTime } from "../lib/util";
import { useAuthStore } from "../store/useAuthStore";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();

  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  // Memoized function to fetch messages
  const fetchMessages = useCallback(async () => {
    if (selectedUser?._id) {
      try {
        await getMessages(selectedUser._id);
        subscribeToMessages();
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    }
  }, [selectedUser?._id, getMessages, subscribeToMessages]);

  // Fetch messages and subscribe when selectedUser changes
  useEffect(() => {
    fetchMessages();
    return () => unsubscribeFromMessages(); // Cleanup on unmount
  }, [fetchMessages, unsubscribeFromMessages]);

  // Scroll to latest message, but not on initial render
  useEffect(() => {
    if (messages.length > 0) {
      messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <MemoizedChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <MemoizedChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${
              message.senderId === authUser._id ? "chat-start" : "chat-end"
            }`}
          >
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || "/avatar.png"
                      : selectedUser.profilePic || "/avatar.png"
                  }
                  alt={`${
                    message.senderId === authUser._id
                      ? "Your"
                      : selectedUser.username
                  } profile pic`}
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            <div className="chat-bubble flex flex-col break-words max-w-[75%]">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}

        {/* Invisible div for auto-scroll */}
        <div ref={messageEndRef} />
      </div>

      <MessageInput />
    </div>
  );
};

// Memoized ChatHeader for performance optimization
const MemoizedChatHeader = memo(ChatHeader);

export default ChatContainer;

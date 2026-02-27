import { messageRepository } from "@/lib/repositories/message.repository";
import type { CreateMessageRequest } from "@/lib/types/api";

export const messageService = {
  async getConversations(userId: string) {
    return messageRepository.findConversations(userId);
  },

  async getMessages(userId1: string, userId2: string) {
    await messageRepository.markAsRead(userId2, userId1);
    return messageRepository.findConversation(userId1, userId2);
  },

  async send(data: CreateMessageRequest) {
    return messageRepository.create(data);
  },

  async getUnreadCount(userId: string) {
    return messageRepository.countUnread(userId);
  },
};

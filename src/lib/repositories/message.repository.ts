import { prisma } from "@/lib/prisma";

export const messageRepository = {
  findConversation(userId1: string, userId2: string) {
    return prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId1, receiverId: userId2 },
          { senderId: userId2, receiverId: userId1 },
        ],
      },
      include: { sender: true, receiver: true },
      orderBy: { createdAt: "asc" },
    });
  },

  async findConversations(userId: string) {
    const messages = await prisma.message.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      include: { sender: true, receiver: true },
      orderBy: { createdAt: "desc" },
    });

    const conversationMap = new Map<string, {
      partnerId: string;
      partnerName: string;
      lastMessage: string;
      lastMessageAt: Date;
      unreadCount: number;
    }>();

    for (const msg of messages) {
      const partnerId = msg.senderId === userId ? msg.receiverId : msg.senderId;
      const partner = msg.senderId === userId ? msg.receiver : msg.sender;

      if (!conversationMap.has(partnerId)) {
        const unreadCount = await prisma.message.count({
          where: { senderId: partnerId, receiverId: userId, read: false },
        });
        conversationMap.set(partnerId, {
          partnerId,
          partnerName: partner.name,
          lastMessage: msg.content,
          lastMessageAt: msg.createdAt,
          unreadCount,
        });
      }
    }

    return Array.from(conversationMap.values());
  },

  create(data: { senderId: string; receiverId: string; content: string }) {
    return prisma.message.create({
      data,
      include: { sender: true, receiver: true },
    });
  },

  markAsRead(senderId: string, receiverId: string) {
    return prisma.message.updateMany({
      where: { senderId, receiverId, read: false },
      data: { read: true },
    });
  },

  countUnread(userId: string) {
    return prisma.message.count({
      where: { receiverId: userId, read: false },
    });
  },
};

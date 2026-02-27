import { z } from "zod/v4";

export const createMessageSchema = z.object({
  senderId: z.string().min(1),
  receiverId: z.string().min(1),
  content: z.string().min(1, "メッセージを入力してください"),
});

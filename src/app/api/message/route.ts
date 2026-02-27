import { NextRequest } from "next/server";
import { messageService } from "@/lib/services/message.service";
import { createMessageSchema } from "@/lib/validators/message.validator";
import { successResponse, errorResponse } from "@/lib/utils/response";
import { ValidationError } from "@/lib/errors";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    if (!userId) {
      return successResponse([]);
    }
    const conversations = await messageService.getConversations(userId);
    return successResponse(conversations);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = createMessageSchema.safeParse(body);
    if (!result.success) {
      throw new ValidationError(result.error.issues[0].message);
    }
    const message = await messageService.send(result.data);
    return successResponse(message, 201);
  } catch (error) {
    return errorResponse(error);
  }
}

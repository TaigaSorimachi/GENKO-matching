import { NextRequest } from "next/server";
import { messageService } from "@/lib/services/message.service";
import { successResponse, errorResponse } from "@/lib/utils/response";

type Params = { params: Promise<{ userId: string }> };

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { userId: partnerId } = await params;
    const { searchParams } = new URL(request.url);
    const currentUserId = searchParams.get("currentUserId");
    if (!currentUserId) {
      return successResponse([]);
    }
    const messages = await messageService.getMessages(currentUserId, partnerId);
    return successResponse(messages);
  } catch (error) {
    return errorResponse(error);
  }
}

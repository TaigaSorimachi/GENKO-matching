import { NextRequest } from "next/server";
import { matchService } from "@/lib/services/match.service";
import { successResponse, errorResponse } from "@/lib/utils/response";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    if (!userId) {
      return successResponse([]);
    }
    const applications = await matchService.getApplications(userId);
    return successResponse(applications);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, jobId } = await request.json();
    const match = await matchService.apply(userId, jobId);
    return successResponse(match, 201);
  } catch (error) {
    return errorResponse(error);
  }
}

import { NextRequest } from "next/server";
import { matchService } from "@/lib/services/match.service";
import { successResponse, errorResponse } from "@/lib/utils/response";
import type { MatchStatus } from "@/generated/prisma/client";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const { status } = await request.json();
    const match = await matchService.updateStatus(id, status as MatchStatus);
    return successResponse(match);
  } catch (error) {
    return errorResponse(error);
  }
}

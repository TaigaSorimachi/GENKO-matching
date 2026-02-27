import { NextRequest } from "next/server";
import { matchService } from "@/lib/services/match.service";
import { successResponse, errorResponse } from "@/lib/utils/response";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const applicants = await matchService.getApplicants(id);
    return successResponse(applicants);
  } catch (error) {
    return errorResponse(error);
  }
}

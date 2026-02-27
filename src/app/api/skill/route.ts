import { NextRequest } from "next/server";
import { skillRepository } from "@/lib/repositories/skill.repository";
import { successResponse, errorResponse } from "@/lib/utils/response";
import type { Industry } from "@/generated/prisma/client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const industry = searchParams.get("industry") as Industry | null;
    const skills = await skillRepository.findAll(industry ?? undefined);
    return successResponse(skills);
  } catch (error) {
    return errorResponse(error);
  }
}

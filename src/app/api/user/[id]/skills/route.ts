import { NextRequest } from "next/server";
import { userService } from "@/lib/services/user.service";
import { successResponse, errorResponse } from "@/lib/utils/response";

type Params = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const { skillId, level } = await request.json();
    const skill = await userService.addSkill(id, skillId, level ?? 1);
    return successResponse(skill, 201);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const { skillId, level } = await request.json();
    const skill = await userService.updateSkill(id, skillId, level);
    return successResponse(skill);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const { skillId } = await request.json();
    await userService.removeSkill(id, skillId);
    return successResponse({ success: true });
  } catch (error) {
    return errorResponse(error);
  }
}

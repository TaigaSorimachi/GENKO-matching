import { NextRequest } from "next/server";
import { userService } from "@/lib/services/user.service";
import { updateUserSchema } from "@/lib/validators/user.validator";
import { successResponse, errorResponse } from "@/lib/utils/response";
import { ValidationError } from "@/lib/errors";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const user = await userService.getById(id);
    return successResponse(user);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();
    const result = updateUserSchema.safeParse(body);
    if (!result.success) {
      throw new ValidationError(result.error.issues[0].message);
    }
    const user = await userService.update(id, result.data);
    return successResponse(user);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    await userService.delete(id);
    return successResponse({ success: true });
  } catch (error) {
    return errorResponse(error);
  }
}

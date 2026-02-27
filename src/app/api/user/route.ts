import { NextRequest } from "next/server";
import { userService } from "@/lib/services/user.service";
import { createUserSchema } from "@/lib/validators/user.validator";
import { successResponse, errorResponse } from "@/lib/utils/response";
import { ValidationError } from "@/lib/errors";

export async function GET() {
  try {
    const users = await userService.getAll();
    return successResponse(users);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = createUserSchema.safeParse(body);
    if (!result.success) {
      throw new ValidationError(result.error.issues[0].message);
    }
    const user = await userService.create(result.data);
    return successResponse(user, 201);
  } catch (error) {
    return errorResponse(error);
  }
}

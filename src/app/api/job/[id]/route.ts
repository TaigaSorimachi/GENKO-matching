import { NextRequest } from "next/server";
import { jobService } from "@/lib/services/job.service";
import { updateJobSchema } from "@/lib/validators/job.validator";
import { successResponse, errorResponse } from "@/lib/utils/response";
import { ValidationError } from "@/lib/errors";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const job = await jobService.getById(id);
    return successResponse(job);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();
    const result = updateJobSchema.safeParse(body);
    if (!result.success) {
      throw new ValidationError(result.error.issues[0].message);
    }
    const job = await jobService.update(id, result.data);
    return successResponse(job);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    await jobService.delete(id);
    return successResponse({ success: true });
  } catch (error) {
    return errorResponse(error);
  }
}

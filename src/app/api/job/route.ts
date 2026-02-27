import { NextRequest } from "next/server";
import { jobService } from "@/lib/services/job.service";
import { matchService } from "@/lib/services/match.service";
import { createJobSchema } from "@/lib/validators/job.validator";
import { successResponse, errorResponse } from "@/lib/utils/response";
import { ValidationError } from "@/lib/errors";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const companyId = searchParams.get("companyId");

    if (userId) {
      const jobs = await matchService.getJobsWithScores(userId, {
        shiftType: searchParams.get("shiftType") ?? undefined,
        industry: searchParams.get("industry") ?? undefined,
        salaryMin: searchParams.get("salaryMin") ? Number(searchParams.get("salaryMin")) : undefined,
        salaryMax: searchParams.get("salaryMax") ? Number(searchParams.get("salaryMax")) : undefined,
        location: searchParams.get("location") ?? undefined,
      });
      return successResponse(jobs);
    }

    const jobs = await jobService.getAll({
      companyId: companyId ?? undefined,
      status: searchParams.get("status") as "DRAFT" | "ACTIVE" | "CLOSED" | "EXPIRED" | undefined,
    });
    return successResponse(jobs);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = createJobSchema.safeParse(body);
    if (!result.success) {
      throw new ValidationError(result.error.issues[0].message);
    }
    const job = await jobService.create(result.data);
    return successResponse(job, 201);
  } catch (error) {
    return errorResponse(error);
  }
}

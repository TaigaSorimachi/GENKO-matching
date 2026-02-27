import { NextRequest } from "next/server";
import { dashboardService } from "@/lib/services/dashboard.service";
import { successResponse, errorResponse } from "@/lib/utils/response";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get("companyId");
    if (!companyId) {
      return successResponse({ totalApplications: 0, interviewScheduled: 0, hireRate: 0, activeJobs: 0 });
    }

    const [kpi, recentApplications] = await Promise.all([
      dashboardService.getKpi(companyId),
      dashboardService.getRecentApplications(companyId),
    ]);

    return successResponse({ ...kpi, recentApplications });
  } catch (error) {
    return errorResponse(error);
  }
}

import { z } from "zod/v4";

export const createJobSchema = z.object({
  companyId: z.string().min(1),
  title: z.string().min(1, "求人タイトルは必須です"),
  description: z.string().min(1, "求人の説明は必須です"),
  salaryMin: z.number().int().positive().optional(),
  salaryMax: z.number().int().positive().optional(),
  location: z.string().min(1, "勤務地は必須です"),
  lat: z.number().optional(),
  lng: z.number().optional(),
  shiftType: z.enum(["FULL_TIME", "PART_TIME", "SPOT", "CONTRACT"]),
  urgency: z.enum(["NORMAL", "URGENT", "EMERGENCY"]).optional(),
  skills: z.array(z.object({
    skillId: z.string(),
    minLevel: z.number().min(1).max(5),
  })).optional(),
}).refine(
  (data) => {
    if (data.salaryMin != null && data.salaryMax != null) {
      return data.salaryMin <= data.salaryMax;
    }
    return true;
  },
  { message: "最低給与は最高給与以下にしてください" }
);

export const updateJobSchema = z.object({
  title: z.string().min(1, "求人タイトルは必須です").optional(),
  description: z.string().min(1, "求人の説明は必須です").optional(),
  salaryMin: z.number().int().positive().nullable().optional(),
  salaryMax: z.number().int().positive().nullable().optional(),
  location: z.string().min(1, "勤務地は必須です").optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  shiftType: z.enum(["FULL_TIME", "PART_TIME", "SPOT", "CONTRACT"]).optional(),
  urgency: z.enum(["NORMAL", "URGENT", "EMERGENCY"]).optional(),
  status: z.enum(["DRAFT", "ACTIVE", "CLOSED", "EXPIRED"]).optional(),
  skills: z.array(z.object({
    skillId: z.string(),
    minLevel: z.number().min(1).max(5),
  })).optional(),
});

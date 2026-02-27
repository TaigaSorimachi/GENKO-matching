import { z } from "zod/v4";

export const createUserSchema = z.object({
  type: z.enum(["JOBSEEKER", "EMPLOYER"]),
  phone: z.string().min(1, "電話番号は必須です").regex(/^[\d-]+$/, "正しい電話番号を入力してください"),
  name: z.string().min(1, "名前は必須です"),
  location: z.string().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  language: z.string().optional(),
  companyId: z.string().optional(),
  industries: z.array(z.enum(["CONSTRUCTION", "MANUFACTURING", "TRANSPORT", "LOGISTICS", "SECURITY", "NURSING", "CLEANING", "OTHER"])).optional(),
  skills: z.array(z.object({
    skillId: z.string(),
    level: z.number().min(1).max(5),
  })).optional(),
});

export const updateUserSchema = z.object({
  name: z.string().min(1, "名前は必須です").optional(),
  phone: z.string().regex(/^[\d-]+$/, "正しい電話番号を入力してください").optional(),
  location: z.string().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  language: z.string().optional(),
});

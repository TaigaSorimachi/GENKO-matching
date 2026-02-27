import type {
  User,
  Company,
  Skill,
  UserSkill,
  Job,
  JobSkill,
  Match,
  Review,
  Message,
  UserType,
  Industry,
  ShiftType,
  JobUrgency,
  JobStatus,
  MatchStatus,
} from "@/generated/prisma/client";

// Re-export Prisma types
export type {
  User,
  Company,
  Skill,
  UserSkill,
  Job,
  JobSkill,
  Match,
  Review,
  Message,
};

// Re-export enums
export {
  UserType,
  Industry,
  ShiftType,
  JobUrgency,
  JobStatus,
  MatchStatus,
} from "@/generated/prisma/client";

// === User ===
export type CreateUserRequest = {
  type: UserType;
  phone: string;
  name: string;
  location?: string;
  lat?: number;
  lng?: number;
  language?: string;
  companyId?: string;
  industries?: Industry[];
  skills?: { skillId: string; level: number }[];
};

export type UpdateUserRequest = {
  name?: string;
  phone?: string;
  location?: string;
  lat?: number;
  lng?: number;
  language?: string;
};

// === Job ===
export type CreateJobRequest = {
  companyId: string;
  title: string;
  description: string;
  salaryMin?: number;
  salaryMax?: number;
  location: string;
  lat?: number;
  lng?: number;
  shiftType: ShiftType;
  urgency?: JobUrgency;
  skills?: { skillId: string; minLevel: number }[];
};

export type UpdateJobRequest = {
  title?: string;
  description?: string;
  salaryMin?: number | null;
  salaryMax?: number | null;
  location?: string;
  lat?: number;
  lng?: number;
  shiftType?: ShiftType;
  urgency?: JobUrgency;
  status?: JobStatus;
  skills?: { skillId: string; minLevel: number }[];
};

export type JobWithScore = Job & {
  company: Company;
  skills: (JobSkill & { skill: Skill })[];
  matchScore?: number;
};

// === Match ===
export type CreateMatchRequest = {
  userId: string;
  jobId: string;
};

export type UpdateMatchRequest = {
  status: MatchStatus;
};

export type MatchWithDetails = Match & {
  user: User & { skills: (UserSkill & { skill: Skill })[] };
  job: Job & { company: Company };
};

// === Message ===
export type MessageWithSender = Message & {
  sender: User;
  receiver: User;
};

export type CreateMessageRequest = {
  senderId: string;
  receiverId: string;
  content: string;
};

export type Conversation = {
  partnerId: string;
  partnerName: string;
  lastMessage: string;
  lastMessageAt: Date;
  unreadCount: number;
};

// === Dashboard ===
export type DashboardKpi = {
  totalApplications: number;
  interviewScheduled: number;
  hireRate: number;
  activeJobs: number;
};

// === API Response ===
export type ApiError = {
  error: {
    code: string;
    message: string;
  };
};

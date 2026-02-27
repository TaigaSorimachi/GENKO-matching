import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import "dotenv/config";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // Clean existing data
  await prisma.message.deleteMany();
  await prisma.review.deleteMany();
  await prisma.match.deleteMany();
  await prisma.jobSkill.deleteMany();
  await prisma.job.deleteMany();
  await prisma.userSkill.deleteMany();
  await prisma.user.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.company.deleteMany();

  // === Companies ===
  const company1 = await prisma.company.create({
    data: {
      name: "株式会社山田建設",
      industry: "CONSTRUCTION",
      size: 35,
      address: "東京都新宿区西新宿1-1-1",
      lat: 35.6938,
      lng: 139.7034,
      verified: true,
      trustScore: 85,
    },
  });

  const company2 = await prisma.company.create({
    data: {
      name: "東京ロジスティクス株式会社",
      industry: "LOGISTICS",
      size: 120,
      address: "東京都品川区東品川2-3-4",
      lat: 35.6226,
      lng: 139.7488,
      verified: true,
      trustScore: 90,
    },
  });

  // === Skills ===
  const skills = await Promise.all([
    prisma.skill.create({ data: { name: "溶接(TIG)", category: "溶接", industry: "CONSTRUCTION" } }),
    prisma.skill.create({ data: { name: "溶接(MIG)", category: "溶接", industry: "CONSTRUCTION" } }),
    prisma.skill.create({ data: { name: "溶接(アーク)", category: "溶接", industry: "MANUFACTURING" } }),
    prisma.skill.create({ data: { name: "足場組立", category: "建設作業", industry: "CONSTRUCTION" } }),
    prisma.skill.create({ data: { name: "玉掛け", category: "建設作業", industry: "CONSTRUCTION" } }),
    prisma.skill.create({ data: { name: "クレーン運転", category: "重機操作", industry: "CONSTRUCTION" } }),
    prisma.skill.create({ data: { name: "フォークリフト(リーチ)", category: "重機操作", industry: "LOGISTICS" } }),
    prisma.skill.create({ data: { name: "フォークリフト(カウンター)", category: "重機操作", industry: "LOGISTICS" } }),
    prisma.skill.create({ data: { name: "大型トラック運転", category: "運転", industry: "TRANSPORT" } }),
    prisma.skill.create({ data: { name: "普通自動車免許", category: "運転", industry: "TRANSPORT" } }),
    prisma.skill.create({ data: { name: "電気工事士(第二種)", category: "電気", industry: "CONSTRUCTION" } }),
    prisma.skill.create({ data: { name: "電気工事士(第一種)", category: "電気", industry: "CONSTRUCTION" } }),
    prisma.skill.create({ data: { name: "危険物取扱者(乙4)", category: "安全管理", industry: "MANUFACTURING" } }),
    prisma.skill.create({ data: { name: "介護福祉士", category: "介護", industry: "NURSING" } }),
    prisma.skill.create({ data: { name: "施設警備業務検定", category: "警備", industry: "SECURITY" } }),
    prisma.skill.create({ data: { name: "ビル清掃技能士", category: "清掃", industry: "CLEANING" } }),
  ]);

  // === Users (Jobseekers) ===
  const jobseeker1 = await prisma.user.create({
    data: {
      type: "JOBSEEKER",
      phone: "090-1234-5678",
      name: "田中 太郎",
      location: "東京都新宿区",
      lat: 35.6938,
      lng: 139.7034,
      language: "ja",
      trustScore: 75,
    },
  });

  const jobseeker2 = await prisma.user.create({
    data: {
      type: "JOBSEEKER",
      phone: "090-2345-6789",
      name: "佐藤 花子",
      location: "東京都品川区",
      lat: 35.6226,
      lng: 139.7488,
      language: "ja",
      trustScore: 60,
    },
  });

  const jobseeker3 = await prisma.user.create({
    data: {
      type: "JOBSEEKER",
      phone: "090-3456-7890",
      name: "グエン・ヴァン・ミン",
      location: "東京都江東区",
      lat: 35.6729,
      lng: 139.8172,
      language: "vi",
      trustScore: 50,
    },
  });

  // === Users (Employers) ===
  const employer1 = await prisma.user.create({
    data: {
      type: "EMPLOYER",
      phone: "03-1234-5678",
      name: "山田 一郎",
      location: "東京都新宿区",
      companyId: company1.id,
      language: "ja",
      trustScore: 85,
    },
  });

  const employer2 = await prisma.user.create({
    data: {
      type: "EMPLOYER",
      phone: "03-2345-6789",
      name: "鈴木 次郎",
      location: "東京都品川区",
      companyId: company2.id,
      language: "ja",
      trustScore: 90,
    },
  });

  // === User Skills ===
  await Promise.all([
    // 田中: 溶接TIG Lv4, 足場 Lv3, フォークリフト Lv5, 玉掛け Lv2
    prisma.userSkill.create({ data: { userId: jobseeker1.id, skillId: skills[0].id, level: 4, xpPoints: 400 } }),
    prisma.userSkill.create({ data: { userId: jobseeker1.id, skillId: skills[3].id, level: 3, xpPoints: 250 } }),
    prisma.userSkill.create({ data: { userId: jobseeker1.id, skillId: skills[6].id, level: 5, xpPoints: 600 } }),
    prisma.userSkill.create({ data: { userId: jobseeker1.id, skillId: skills[4].id, level: 2, xpPoints: 150 } }),
    // 佐藤: フォークリフト Lv3, 普通免許 Lv4, 危険物 Lv2
    prisma.userSkill.create({ data: { userId: jobseeker2.id, skillId: skills[7].id, level: 3, xpPoints: 250 } }),
    prisma.userSkill.create({ data: { userId: jobseeker2.id, skillId: skills[9].id, level: 4, xpPoints: 350 } }),
    prisma.userSkill.create({ data: { userId: jobseeker2.id, skillId: skills[12].id, level: 2, xpPoints: 100 } }),
    // グエン: 溶接アーク Lv3, 足場 Lv2
    prisma.userSkill.create({ data: { userId: jobseeker3.id, skillId: skills[2].id, level: 3, xpPoints: 200 } }),
    prisma.userSkill.create({ data: { userId: jobseeker3.id, skillId: skills[3].id, level: 2, xpPoints: 100 } }),
  ]);

  // === Jobs ===
  const job1 = await prisma.job.create({
    data: {
      companyId: company1.id,
      title: "溶接工（TIG溶接）急募",
      description: "新宿区の建設現場でTIG溶接作業を行っていただきます。経験3年以上の方を優遇。安全装備完備、昼食支給あり。",
      salaryMin: 15000,
      salaryMax: 20000,
      location: "東京都新宿区西新宿3丁目",
      lat: 35.6876,
      lng: 139.6917,
      shiftType: "FULL_TIME",
      urgency: "URGENT",
      status: "ACTIVE",
      skills: {
        create: [
          { skillId: skills[0].id, minLevel: 3 },
          { skillId: skills[4].id, minLevel: 1 },
        ],
      },
    },
  });

  const job2 = await prisma.job.create({
    data: {
      companyId: company1.id,
      title: "足場組立作業員",
      description: "ビル建設現場での足場組立・解体作業。チームで作業するため協調性が大切です。",
      salaryMin: 12000,
      salaryMax: 16000,
      location: "東京都渋谷区",
      lat: 35.6580,
      lng: 139.7016,
      shiftType: "FULL_TIME",
      status: "ACTIVE",
      skills: {
        create: [
          { skillId: skills[3].id, minLevel: 2 },
        ],
      },
    },
  });

  const job3 = await prisma.job.create({
    data: {
      companyId: company2.id,
      title: "倉庫作業スタッフ（フォークリフト）",
      description: "品川区の物流倉庫でのフォークリフト作業。リーチフォークの経験者優遇。週5日勤務。",
      salaryMin: 13000,
      salaryMax: 17000,
      location: "東京都品川区東品川",
      lat: 35.6196,
      lng: 139.7488,
      shiftType: "FULL_TIME",
      status: "ACTIVE",
      skills: {
        create: [
          { skillId: skills[6].id, minLevel: 2 },
        ],
      },
    },
  });

  const job4 = await prisma.job.create({
    data: {
      companyId: company2.id,
      title: "配送ドライバー（大型）",
      description: "関東圏内の配送業務。大型トラックでの長距離配送あり。ルート配送のため、未経験でも安心。",
      salaryMin: 14000,
      salaryMax: 22000,
      location: "東京都品川区",
      lat: 35.6226,
      lng: 139.7488,
      shiftType: "FULL_TIME",
      status: "ACTIVE",
      skills: {
        create: [
          { skillId: skills[8].id, minLevel: 3 },
          { skillId: skills[9].id, minLevel: 2 },
        ],
      },
    },
  });

  const job5 = await prisma.job.create({
    data: {
      companyId: company1.id,
      title: "電気工事士",
      description: "オフィスビルの電気配線工事。第二種電気工事士資格必須。経験者優遇。",
      salaryMin: 16000,
      salaryMax: 24000,
      location: "東京都千代田区",
      lat: 35.6940,
      lng: 139.7536,
      shiftType: "FULL_TIME",
      status: "ACTIVE",
      skills: {
        create: [
          { skillId: skills[10].id, minLevel: 3 },
        ],
      },
    },
  });

  await prisma.job.create({
    data: {
      companyId: company2.id,
      title: "【スポット】倉庫内軽作業",
      description: "明日から3日間、品川倉庫でのピッキング・梱包作業。未経験OK。",
      salaryMin: 10000,
      salaryMax: 12000,
      location: "東京都品川区東品川",
      lat: 35.6196,
      lng: 139.7488,
      shiftType: "SPOT",
      urgency: "EMERGENCY",
      status: "ACTIVE",
    },
  });

  await prisma.job.create({
    data: {
      companyId: company1.id,
      title: "建設現場の安全管理補佐",
      description: "建設現場での安全管理補佐業務。朝礼の実施、安全パトロール、書類管理など。",
      salaryMin: 13000,
      salaryMax: 18000,
      location: "東京都新宿区",
      lat: 35.6938,
      lng: 139.7034,
      shiftType: "FULL_TIME",
      status: "ACTIVE",
      skills: {
        create: [
          { skillId: skills[4].id, minLevel: 2 },
        ],
      },
    },
  });

  await prisma.job.create({
    data: {
      companyId: company2.id,
      title: "構内作業（パート）",
      description: "午前中のみの短時間勤務。倉庫内での仕分け作業。主婦・シニア歓迎。",
      salaryMin: 5000,
      salaryMax: 7000,
      location: "東京都品川区",
      lat: 35.6226,
      lng: 139.7488,
      shiftType: "PART_TIME",
      status: "ACTIVE",
    },
  });

  await prisma.job.create({
    data: {
      companyId: company1.id,
      title: "クレーンオペレーター",
      description: "タワークレーンの操作業務。クレーン運転免許必須。高所作業あり。",
      salaryMin: 18000,
      salaryMax: 28000,
      location: "東京都江東区豊洲",
      lat: 35.6531,
      lng: 139.7953,
      shiftType: "FULL_TIME",
      status: "ACTIVE",
      skills: {
        create: [
          { skillId: skills[5].id, minLevel: 3 },
        ],
      },
    },
  });

  await prisma.job.create({
    data: {
      companyId: company1.id,
      title: "溶接工（MIG溶接）",
      description: "製造工場でのMIG溶接作業。自動車部品の溶接経験者優遇。",
      salaryMin: 14000,
      salaryMax: 19000,
      location: "東京都大田区",
      lat: 35.5614,
      lng: 139.7160,
      shiftType: "FULL_TIME",
      status: "DRAFT",
      skills: {
        create: [
          { skillId: skills[1].id, minLevel: 2 },
        ],
      },
    },
  });

  // === Matches (Applications) ===
  const match1 = await prisma.match.create({
    data: {
      userId: jobseeker1.id,
      jobId: job1.id,
      aiScore: 85.5,
      status: "INTERVIEW",
      appliedAt: new Date("2026-02-20"),
    },
  });

  await prisma.match.create({
    data: {
      userId: jobseeker1.id,
      jobId: job3.id,
      aiScore: 72.3,
      status: "APPLIED",
      appliedAt: new Date("2026-02-25"),
    },
  });

  await prisma.match.create({
    data: {
      userId: jobseeker2.id,
      jobId: job3.id,
      aiScore: 68.0,
      status: "SCREENING",
      appliedAt: new Date("2026-02-22"),
    },
  });

  await prisma.match.create({
    data: {
      userId: jobseeker2.id,
      jobId: job4.id,
      aiScore: 55.5,
      status: "APPLIED",
      appliedAt: new Date("2026-02-26"),
    },
  });

  await prisma.match.create({
    data: {
      userId: jobseeker3.id,
      jobId: job2.id,
      aiScore: 62.1,
      status: "APPLIED",
      appliedAt: new Date("2026-02-27"),
    },
  });

  // === Messages ===
  await prisma.message.createMany({
    data: [
      {
        senderId: employer1.id,
        receiverId: jobseeker1.id,
        content: "田中さん、ご応募ありがとうございます。来週月曜日に面接いかがでしょうか？",
        createdAt: new Date("2026-02-21T10:00:00"),
        read: true,
      },
      {
        senderId: jobseeker1.id,
        receiverId: employer1.id,
        content: "ご連絡ありがとうございます。月曜日の午前中であれば伺えます。",
        createdAt: new Date("2026-02-21T11:30:00"),
        read: true,
      },
      {
        senderId: employer1.id,
        receiverId: jobseeker1.id,
        content: "では月曜10時に新宿オフィスにお越しください。住所は後ほどお送りします。",
        createdAt: new Date("2026-02-21T12:00:00"),
        read: false,
      },
      {
        senderId: employer2.id,
        receiverId: jobseeker2.id,
        content: "佐藤さん、フォークリフト経験があるとのことで、ぜひ詳しくお話を伺いたいです。",
        createdAt: new Date("2026-02-23T09:00:00"),
        read: true,
      },
      {
        senderId: jobseeker2.id,
        receiverId: employer2.id,
        content: "ありがとうございます！リーチフォークは3年間操作しておりました。",
        createdAt: new Date("2026-02-23T10:00:00"),
        read: false,
      },
    ],
  });

  console.log("Seed data created successfully!");
  console.log(`Companies: ${company1.name}, ${company2.name}`);
  console.log(`Jobseekers: ${jobseeker1.name}, ${jobseeker2.name}, ${jobseeker3.name}`);
  console.log(`Employers: ${employer1.name}, ${employer2.name}`);
  console.log(`Skills: ${skills.length} skills`);
  console.log(`Jobs: 10 jobs`);
  console.log(`Matches: 5 applications`);
  console.log(`Messages: 5 messages`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });

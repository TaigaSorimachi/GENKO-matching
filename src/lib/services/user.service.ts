import { userRepository } from "@/lib/repositories/user.repository";
import { NotFoundError } from "@/lib/errors";
import type { CreateUserRequest, UpdateUserRequest } from "@/lib/types/api";

export const userService = {
  async getAll() {
    return userRepository.findAll();
  },

  async getById(id: string) {
    const user = await userRepository.findById(id);
    if (!user) throw new NotFoundError("ユーザーが見つかりませんでした");
    return user;
  },

  async create(data: CreateUserRequest) {
    const user = await userRepository.create({
      type: data.type,
      phone: data.phone,
      name: data.name,
      location: data.location,
      lat: data.lat,
      lng: data.lng,
      language: data.language,
      companyId: data.companyId,
    });

    if (data.skills?.length) {
      for (const skill of data.skills) {
        await userRepository.addSkill(user.id, skill.skillId, skill.level);
      }
    }

    return userRepository.findById(user.id);
  },

  async update(id: string, data: UpdateUserRequest) {
    await this.getById(id);
    return userRepository.update(id, data);
  },

  async delete(id: string) {
    await this.getById(id);
    return userRepository.delete(id);
  },

  async addSkill(userId: string, skillId: string, level: number) {
    await this.getById(userId);
    return userRepository.addSkill(userId, skillId, level);
  },

  async updateSkill(userId: string, skillId: string, level: number) {
    return userRepository.updateSkill(userId, skillId, level);
  },

  async removeSkill(userId: string, skillId: string) {
    return userRepository.removeSkill(userId, skillId);
  },
};

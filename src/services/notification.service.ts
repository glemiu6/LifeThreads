import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

export class NotificationService {
  static async getAllByUser(userId: number) {
    return await prisma.notification.findMany({
      where: { userId },
      orderBy: { created_at: 'desc' },
    });
  }

  static async updateReadStatus(id: number, is_read: boolean) {
    return await prisma.notification.update({
      where: { id },
      data: { is_read },
    });
  }
}

import { ConflictException, Injectable } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import { PrismaService } from '../prisma.service';
import { CreateUsersDto } from '../dto/create-users.dto';
import { User } from '@/entities/user.entity';
import { CreateUserDto } from '@/dto/create-user.dto';

@Injectable()
export class UsersService {
  private readonly userSelect = {
    id: true,
    username: true,
    email: true,
    first_name: true,
    last_name: true,
    phone: true,
    address: true,
    company: true,
    country: true,
    avatar: true,
    createdAt: true,
    updateAt: true,
  };

  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      select: this.userSelect,
    });

    return users as unknown as User[];
  }

  async findById(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { ...this.userSelect },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user as unknown as User;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: this.userSelect,
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user as unknown as User;
  }

  async create(dto: CreateUsersDto): Promise<User> {
    const existingUser = await this.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const createdUser = await this.prisma.user.create({
      data: dto,
      select: this.userSelect,
    });

    return createdUser as unknown as User;
  }

  async createProfile(userId: string, email: string): Promise<User> {
    // Создаем минимальный профиль
    return this.prisma.user.create({
      data: {
        id: userId, // используем тот же ID что и в auth
        email: email,
        username: `user_${userId.slice(0, 8)}`,
        first_name: '',
        last_name: '',
        phone: '',
      },
      select: this.userSelect,
    });
  }

  async createBatch(count: number): Promise<{ count: number }> {
    try {
      const users = Array.from({ length: count }, () => ({
        username: faker.internet.username(),
        email: faker.internet.email(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        phone: faker.phone.number(),
        address: faker.location.streetAddress(),
        company: faker.company.name(),
        country: faker.location.country(),
        avatar: faker.image.avatar(),
      }));

      const result = await this.prisma.user.createMany({
        data: users,
        skipDuplicates: true,
      });

      console.log('Created users:', result.count);
      return { count: result.count };
    } catch (error) {
      console.error('Error creating batch users:', error);
      throw error;
    }
  }

  async update(
    id: string,
    updateUserDto: Partial<CreateUserDto>,
  ): Promise<User> {
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
      select: this.userSelect,
    });

    return updatedUser as unknown as User;
  }

  async deleteAll(): Promise<{ count: number }> {
    const result = await this.prisma.user.deleteMany();
    return { count: result.count };
  }

  async deleteById(id: string): Promise<User> {
    const deletedUser = await this.prisma.user.delete({
      where: { id },
      select: { ...this.userSelect },
    });

    return deletedUser as unknown as User;
  }
}

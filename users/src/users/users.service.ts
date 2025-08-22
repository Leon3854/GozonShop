import { ConflictException, Injectable } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import { PrismaService } from '../prisma.service';
import { CreateUsersDto } from '../dto/create-users.dto';
import { User, UserCreateInput } from '@/types/users.types';

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
    return this.prisma.user.findMany({
      select: this.userSelect,
    }) as Promise<User[]>;
  }

  async findById(id: number): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: this.userSelect,
    });
    return user as User;
  }

  // Для поиска по email
  async findByEmail(email: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: this.userSelect,
    });
    return user as User;
  }

  async create(dto: CreateUsersDto): Promise<User> {
    const existingUser = await this.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const createdUser = await this.prisma.user.create({
      data: dto as UserCreateInput,
      select: this.userSelect,
    });
    return createdUser as User;
  }

  // users.service.ts
  async createBatch(count: number): Promise<{ count: number }> {
    try {
      const users: UserCreateInput[] = Array.from({ length: count }, () => ({
        username: faker.internet.username(), // Исправлено на username()
        email: faker.internet.email(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        phone: faker.phone.number(),
        imei: faker.string.uuid(),
        address: faker.location.streetAddress(),
        company: faker.company.name(),
        country: faker.location.country(),
        avatar: faker.image.avatar(),
        password: 'temp_password',
      }));

      const result = await this.prisma.user.createMany({
        data: users,
        skipDuplicates: true, // Пропускать дубликаты
      });

      console.log('Created users:', result.count);
      return { count: result.count };
    } catch (error) {
      console.error('Error creating batch users:', error);
      throw error;
    }
  }

  async deleteAll(): Promise<{ count: number }> {
    const result = await this.prisma.user.deleteMany();
    return { count: result.count };
  }

  async deleteById(id: number): Promise<User> {
    const deletedUser = await this.prisma.user.delete({
      where: { id },
      select: this.userSelect,
    });
    return deletedUser as User;
  }
}

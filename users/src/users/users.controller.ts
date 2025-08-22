import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUsersDto } from '../dto/create-users.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.usersService.findById(+id);
  }

  @Post()
  async create(@Body() dto: CreateUsersDto) {
    return this.usersService.create(dto);
  }

  @Post('batch/:count')
  createBatch(@Param('count', ParseIntPipe) count: number) {
    return this.usersService.createBatch(count);
  }

  @Delete()
  deleteAll() {
    return this.usersService.deleteAll();
  }

  @Delete(':id')
  async deleteById(@Param('id') id: string) {
    return await this.usersService.deleteById(+id);
  }
}

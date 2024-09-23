import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(createUserDto: CreateUserDto) {
    return await this.usersRepository.create({
      ...createUserDto,
      password: await bcrypt.hash(createUserDto?.password, 10),
    });
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersRepository.findOne({ email });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const isValidAccount = await bcrypt.compare(password, user?.password);

    if (!isValidAccount) {
      throw new UnauthorizedException('Password is incorrect');
    }

    return user;
  }

  async findOne(_id: string) {
    return await this.usersRepository.findOne({ _id });
  }
}

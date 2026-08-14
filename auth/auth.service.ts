import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/user.entity';
import { AuthLoginDto, AuthTokenDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService
  ) {}

  async hashPassword(plain: string): Promise<string> {
    return bcrypt.hash(plain, 10);
  }

  async verifyPassword(plain: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(plain, hashed);
  }

  async login(authLoginDto: AuthLoginDto): Promise<AuthTokenDto> {
    const user = await this.userRepository.findOne({ where: { account: authLoginDto.account } });

    if (!user) {
      throw new HttpException('Invalid account or password', HttpStatus.UNAUTHORIZED);
    }

    const isActive =
      user.isactive != null && user.isactive.toString() !== '0';
    if (!isActive) {
      throw new HttpException('User is not active', HttpStatus.UNAUTHORIZED);
    }

    const isPasswordValid = await this.verifyPassword(authLoginDto.password, user.pwd);
    if (!isPasswordValid) {
      throw new HttpException('Invalid account or password', HttpStatus.UNAUTHORIZED);
    }

    const access_token = this.jwtService.sign({ sub: user.account });
    return { access_token, token_type: 'Bearer' };
  }

  async getCurrentUser(account: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { account } });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }
}

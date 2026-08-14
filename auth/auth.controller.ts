import { Body, Controller, Post, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginDto, AuthTokenDto } from './auth.dto';
import { Public } from './auth.public';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('token')
  async login(@Body() loginDto: AuthLoginDto): Promise<AuthTokenDto> {
    return this.authService.login(loginDto);
  }

  @Public()
  @Post('hashpwd/:password')
  async hashpwd(@Param('password') password: string) {
    const hashed = await this.authService.hashPassword(password);
    return { hashed_password: hashed };
  }
}

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string) {
    // 1. Fetch user by user_name column
    const user = await this.usersService.findByUsername(username);
    if (!user) return null;

    // 2. Compare hashed password
    const valid = await bcrypt.compare(pass, user.password);
    if (valid) {
      // Exclude password from returned user object
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    // 3. Map JWT payload to schema properties (user_id & user_name)
    const payload = { 
      sub: user.user_id, 
      username: user.user_name 
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.user_id,
        username: user.user_name,
      },
    };
  }

  async logout(userId: number) {
    return { ok: true, message: 'Logged out successfully' };
  }

  async refreshTokens(refreshToken: string) {
    try {
      // Verify token directly using NestJS JwtService instance
      const decoded: any = this.jwtService.verify(refreshToken);
      const user = await this.usersService.findById(decoded.sub);

      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const payload = { sub: user.user_id, username: user.user_name };
      const accessToken = this.jwtService.sign(payload);

      return { access_token: accessToken };
    } catch (err) {
      throw new UnauthorizedException('Could not refresh tokens');
    }
  }
}
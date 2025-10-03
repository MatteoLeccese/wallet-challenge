import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { CurrentUserData } from '../interfaces/current-user.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET ?? 'your_jwt_secret_key',
    });
  }

  validate(payload: JwtPayload): CurrentUserData {
    return {
      userId: payload.sub,
      document: payload.document,
      phone: payload.phone,
      email: payload.email,
    };
  }
}

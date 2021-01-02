import * as moment from 'moment';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { ConfigService } from '../../config/config.service';
import { MessagingService } from '../../messaging/messaging.service';
import { AuthenticatedUser, DecodedToken } from '../authorization.types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(readonly messagingService: MessagingService, readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('publicKey')
    });
  }

  async validate(token: DecodedToken) {
    const tokenExpiration = moment.unix(token.exp);
    const user: AuthenticatedUser = await this.messagingService.sendAsync('users.user.find-by', { id: token.sub });
    return !moment(user.tokenExpiration).diff(tokenExpiration) && moment().isBefore(tokenExpiration) ? token : false;
  }
}

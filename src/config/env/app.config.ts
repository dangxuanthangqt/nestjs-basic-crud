import { registerAs } from '@nestjs/config';
import { PinoConfig } from 'src/shared/constants/logger-pino.constant';

export default registerAs('app', () => ({
  port: process.env.PORT,
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
  accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
  refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
  secretApiKey: process.env.SECRET_API_KEY,
  logPretty: process.env.LOG_PRETTY,
  logLevel: process.env.LOG_LEVEL ?? PinoConfig.LOG_LEVEL_INFO,
}));

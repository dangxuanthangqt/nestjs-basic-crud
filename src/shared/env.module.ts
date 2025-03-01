import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import appConfig from "src/config/env/app.config";
import databaseConfig from "src/config/env/database.config";
import {
  classValidateEnv,
  // zodValidateEnv,
} from "src/config/env/env.validation";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig],
      // validate: zodValidateEnv,
      validate: classValidateEnv,
    }),
  ],
})
export class EnvModule {}

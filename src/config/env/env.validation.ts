import { plainToInstance } from "class-transformer";
import {
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  validateSync,
} from "class-validator";
import { z } from "zod";

export const envSchema = z.object({
  //   PORT: z.coerce.number(),
  PORT: z.preprocess(
    (val) => (typeof val === "string" ? Number(val) : val),
    z.number(),
  ),
  DATABASE_URL: z.string().url(),
});

class EnvSchema {
  @IsNumber()
  @Min(0)
  @Max(65535)
  PORT: number;

  @IsString()
  DATABASE_URL: string;

  @IsString()
  ACCESS_TOKEN_SECRET: string;

  @IsString()
  ACCESS_TOKEN_EXPIRES_IN: string;

  @IsString()
  REFRESH_TOKEN_SECRET: string;

  @IsString()
  REFRESH_TOKEN_EXPIRES_IN: string;

  @IsString()
  SECRET_API_KEY: string;

  @IsOptional()
  @IsString()
  LOG_PRETTY: string;

  @IsOptional()
  @IsString()
  LOG_LEVEL: string;
}

export const zodValidateEnv = (env: Record<string, unknown>) => {
  const parsedEnv = envSchema.safeParse(env);

  if (!parsedEnv.success) {
    console.error(
      "❌ Environment configuration errors:",
      parsedEnv.error.format(),
    );

    throw new Error("Config validation error");
  }

  return parsedEnv.data;
};

export function classValidateEnv(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvSchema, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}

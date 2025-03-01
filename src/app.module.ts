import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./routes/auth/auth.module";
import { PostsModule } from "./routes/posts/posts.module";
import { SharedModule } from "./shared/shared.module";

@Module({
  imports: [SharedModule, PostsModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Body, Controller, Get, Post } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IEnvConfig } from 'src/interface/env.interface';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly configService: ConfigService<IEnvConfig>,
  ) {}

  @Get()
  getPosts() {
    console.log(this.configService.get('app.port', { infer: true }));
    return this.postsService.getPosts();
  }

  @Post()
  createPost(@Body() post: { title: string; content: string }) {
    return this.postsService.createPost(post);
  }
}

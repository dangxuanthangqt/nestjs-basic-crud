import { Body, Controller, Get, Post } from '@nestjs/common';

import { User } from '@prisma/client';
import {
  AuthorizationType,
  CombinedAuthorizationCondition,
} from 'src/shared/constants/auth.constant';
import ActiveUser from 'src/shared/decorators/active-user.decorator';
import { AuthorizationHeader } from 'src/shared/decorators/authorization-header.decorator';
import { PostRequestDto, PostsResponseDto } from 'src/shared/dto/post.dto';
import { PostsService } from './posts.service';

@Controller('posts')
@AuthorizationHeader(
  [AuthorizationType.API_KEY, AuthorizationType.BEARER],
  CombinedAuthorizationCondition.AND,
)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  async getPosts(@ActiveUser('userId') userId: User['id']) {
    const result = await this.postsService.getPosts(userId);

    // response directly array of posts
    // return plainToInstance(PostResponseDto, result);

    return new PostsResponseDto({
      posts: result,
    });
  }

  @Post()
  createPost(
    @Body() post: PostRequestDto,
    @ActiveUser('userId') userId: User['id'],
  ) {
    return this.postsService.createPost(post, userId);
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from "@nestjs/common";

import { Post as PostModel, User as UserModel } from "@prisma/client";
import {
  AuthorizationType,
  CombinedAuthorizationCondition,
} from "src/shared/constants/auth.constant";
import ActiveUser from "src/shared/decorators/active-user.decorator";
import { AuthorizationHeader } from "src/shared/decorators/authorization-header.decorator";
import {
  PostRequestDto,
  PostResponseDto,
  PostsResponseDto,
  UpdatePostRequestDto,
} from "src/shared/dto/post.dto";
import { PostsService } from "./posts.service";

@Controller("posts")
@AuthorizationHeader(
  [AuthorizationType.API_KEY, AuthorizationType.BEARER],
  CombinedAuthorizationCondition.AND,
)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  async getPosts(@ActiveUser("userId") userId: UserModel["id"]) {
    const result = await this.postsService.getPosts(userId);

    // response directly array of posts
    // return plainToInstance(PostResponseDto, result);

    return new PostsResponseDto({
      posts: result,
    });
  }

  @Get(":id")
  async getPost(@Param("id", ParseIntPipe) postId: PostModel["id"]) {
    const result = await this.postsService.getPost(postId);

    // response directly array of posts
    // return plainToInstance(PostResponseDto, result);

    return new PostResponseDto(result);
  }

  @Post()
  createPost(
    @Body() post: PostRequestDto,
    @ActiveUser("userId") userId: UserModel["id"],
  ) {
    return this.postsService.createPost(post, userId);
  }

  @AuthorizationHeader([AuthorizationType.BEARER])
  @Put(":id")
  updatePost(
    @Body() body: UpdatePostRequestDto,
    @Param("id", ParseIntPipe) postId: PostModel["id"],
    @ActiveUser("userId") authorId: UserModel["id"],
  ) {
    return this.postsService.updatePost({
      postId,
      authorId,
      data: body,
    });
  }

  @AuthorizationHeader([AuthorizationType.BEARER]) // Only Bearer
  @Delete(":id")
  async deletePost(
    @Param("id", ParseIntPipe) postId: PostModel["id"],
    @ActiveUser("userId") authorId: UserModel["id"],
  ) {
    return this.postsService.deletePost(postId, authorId);
  }
}

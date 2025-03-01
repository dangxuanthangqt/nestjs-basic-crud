import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { Post } from "@prisma/client";
import { UpdatePostRequestDto } from "src/shared/dto/post.dto";
import { PrismaService } from "src/shared/services/prisma.service";

@Injectable()
export class PostsService {
  constructor(private readonly prismaService: PrismaService) {}

  private readonly logger = new Logger(PostsService.name);

  getPosts(authorId: Post["authorId"]) {
    this.logger.debug("Getting posts requested by authorId: " + authorId);

    return this.prismaService.post.findMany({
      where: {
        authorId,
      },
      select: {
        id: true,
        content: true,
        title: true,
        author: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  async getPost(id: Post["id"]) {
    this.logger.debug("Getting post requested by id: " + id);

    const post = await this.prismaService.post.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        content: true,
        title: true,
        author: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!post) {
      throw new NotFoundException("Post not found.");
    }

    return post;
  }

  createPost(
    data: { title: string; content: string },
    authorId: Post["authorId"],
  ) {
    this.logger.debug("Creating post requested by authorId: " + authorId);

    return this.prismaService.post.create({
      data: {
        title: data.title,
        content: data.content,
        authorId,
      },
    });
  }

  updatePost({
    postId,
    authorId,
    data,
  }: {
    postId: Post["id"];
    authorId: Post["authorId"];
    data: UpdatePostRequestDto;
  }) {
    this.logger.debug("Updating post requested by id: " + postId);

    return this.prismaService.post.update({
      where: {
        id: postId,
        authorId,
      },
      data,
    });
  }

  async deletePost(postId: Post["id"], authorId: Post["authorId"]) {
    this.logger.debug("Deleting post requested by id: " + postId);

    await this.prismaService.post.delete({
      where: {
        id: postId,
        authorId,
      },
    });

    return {
      message: "Post deleted successfully.",
    };
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { Post } from '@prisma/client';
import { UpdatePostRequestDto } from 'src/shared/dto/post.dto';
import { PrismaService } from 'src/shared/services/prisma.service';

@Injectable()
export class PostsService {
  constructor(private readonly prismaService: PrismaService) {}

  private readonly logger = new Logger(PostsService.name);

  getPosts(authorId: Post['authorId']) {
    this.logger.debug('Getting posts requested by authorId: ' + authorId);

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

  createPost(
    data: { title: string; content: string },
    authorId: Post['authorId'],
  ) {
    this.logger.debug('Creating post requested by authorId: ' + authorId);

    return this.prismaService.post.create({
      data: {
        title: data.title,
        content: data.content,
        authorId,
      },
    });
  }

  updatePost(id: Post['id'], data: UpdatePostRequestDto) {
    this.logger.debug('Updating post requested by id: ' + id);
    console.log('data', data);

    return this.prismaService.post.update({
      where: {
        id,
      },
      data,
    });
  }
}

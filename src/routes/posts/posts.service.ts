import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';

@Injectable()
export class PostsService {
  constructor(private readonly prismaService: PrismaService) {}

  getPosts() {
    return this.prismaService.post.findMany();
  }

  createPost(data: { title: string; content: string }) {
    return this.prismaService.post.create({
      data: {
        title: data.title,
        content: data.content,
        authorId: 1,
      },
    });
  }
}

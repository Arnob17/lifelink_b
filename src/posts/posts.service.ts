import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { PostsQueryDto } from './dto/posts-query.dto';

const authorSelect = { id: true, name: true } as const;

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  findPublic(query: PostsQueryDto) {
    const take = Math.min(query.take ?? 40, 100);
    const skip = query.skip ?? 0;
    return this.prisma.feedPost.findMany({
      take,
      skip,
      orderBy: { createdAt: 'desc' },
      include: { author: { select: authorSelect } },
    });
  }

  async create(authorId: string, dto: CreatePostDto) {
    const title = dto.title?.trim();
    const content = dto.content.trim();
    return this.prisma.feedPost.create({
      data: {
        authorId,
        title: title && title.length > 0 ? title : null,
        content,
      },
      include: { author: { select: authorSelect } },
    });
  }

  async remove(id: string, userId: string, role: string) {
    const post = await this.prisma.feedPost.findUnique({ where: { id } });
    if (!post) throw new NotFoundException('Post not found');
    if (post.authorId !== userId && role !== Role.ADMIN) {
      throw new ForbiddenException('You can only delete your own posts');
    }
    await this.prisma.feedPost.delete({ where: { id } });
    return { deleted: true, id };
  }
}

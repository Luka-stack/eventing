import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { RegisterPayload } from './payloads/register.payload';
import { LoginPayload } from './payloads/login.payload';
import { CreatePostPayload } from './payloads/create-post.payload';
import { CreateCommentPayload } from './payloads/create-comment.payload';
import { SocketEmitter } from './socket/socket-emitter';
import { plainToInstance } from 'class-transformer';
import { GroupsDto } from './dtos/groups.dto';
import { event } from './utils/events';
import { CommentAdded, CreatingPost, PostCreated } from './common/events';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly socketEmitter: SocketEmitter,
  ) {}

  async register(paylaod: RegisterPayload) {
    try {
      const user = await this.prisma.user.create({
        data: paylaod,
      });

      return user;
    } catch (err) {
      this.logger.error(err);
      throw new BadRequestException('User already exists');
    }
  }

  async login(payload: LoginPayload) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email: payload.email,
          password: payload.password,
        },
      });

      if (!user) {
        throw new BadRequestException('Invalid credentials');
      }

      return user;
    } catch (err) {
      this.logger.error(err);
      throw new BadRequestException('Invalid credentials');
    }
  }

  async getGroups(userId: string) {
    const groups = await this.prisma.group.findMany({
      include: {
        subscribers: {
          where: {
            userId,
          },
        },
      },
    });

    return plainToInstance(GroupsDto, groups);
  }

  async createPost(userId: string, payload: CreatePostPayload) {
    const groups = payload.groups.map((name) => ({ name }));
    const queueId = Date.now().toString();

    setTimeout(async () => {
      const post = await this.prisma.post.create({
        data: {
          title: payload.title,
          content: payload.content,
          description: payload.description,
          thumbnail: payload.thumbnail,
          author: {
            connect: {
              id: userId,
            },
          },
          groups: {
            connect: groups,
          },
        },
      });

      const toNotifyUsers = await this.prisma.userGroupNotifications.findMany({
        where: {
          groupId: {
            in: payload.groups,
          },
        },
      });

      const usersIds = toNotifyUsers
        .filter((u) => u.userId !== userId)
        .map((u) => u.userId);

      usersIds.push(userId);

      this.socketEmitter.publish(
        event<PostCreated>('PostCreated', { post, queueId }),
      );
    }, 5000);

    this.socketEmitter.publish(
      event<CreatingPost>('CreatingPost', { title: payload.title, queueId }),
      [userId],
    );
  }

  async createComment(userId: string, payload: CreateCommentPayload) {
    try {
      const created = await this.prisma.comment.create({
        data: {
          content: payload.content,
          post: {
            connect: {
              id: payload.postId,
            },
          },
          author: {
            connect: {
              id: userId,
            },
          },
        },
        include: {
          post: true,
          author: true,
        },
      });

      const { post, ...comment } = created;

      this.socketEmitter.publish(
        event<CommentAdded>('CommentAdded', {
          postId: post.id,
          postTitle: post.title,
          comment,
        }),
        [post.authorId],
      );

      return comment;
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException('Comment could not be created');
    }
  }

  getPosts() {
    return this.prisma.post.findMany({
      include: {
        author: true,
        groups: true,
      },
    });
  }

  async getPost(id: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        author: true,
        comments: {
          include: {
            author: true,
          },
        },
        groups: true,
      },
    });

    if (!post) {
      throw new BadRequestException('Post not found');
    }

    return post;
  }

  async unsubscribeFromGroup(userId: string, groupId: string) {
    await this.prisma.userGroupNotifications.delete({
      where: {
        userId_groupId: {
          userId,
          groupId,
        },
      },
    });
  }

  async subscribeToGroup(userId: string, groupId: string) {
    await this.prisma.userGroupNotifications.create({
      data: {
        groupId,
        userId,
      },
    });
  }
}

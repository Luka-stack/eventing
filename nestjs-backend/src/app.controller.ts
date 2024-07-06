import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  Param,
  Post,
} from '@nestjs/common';

import { AppService } from './app.service';
import { LoginPayload } from './payloads/login.payload';
import { RegisterPayload } from './payloads/register.payload';
import { CreatePostPayload } from './payloads/create-post.payload';
import { CreateCommentPayload } from './payloads/create-comment.payload';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/register')
  register(@Body() payload: RegisterPayload) {
    return this.appService.register(payload);
  }

  @Post('/login')
  @HttpCode(200)
  login(@Body() payload: LoginPayload) {
    return this.appService.login(payload);
  }

  @Post('/posts')
  @HttpCode(204)
  createLongPost(
    @Body() payload: CreatePostPayload,
    @Headers() headers: Record<string, string>,
  ) {
    return this.appService.createPost(headers['userid'], payload);
  }

  @Post('/comments')
  createComment(
    @Body() payload: CreateCommentPayload,
    @Headers() headers: Record<string, string>,
  ) {
    return this.appService.createComment(headers['userid'], payload);
  }

  @Post('/groups/:id/subscribe')
  @HttpCode(204)
  subscribeToGroup(
    @Param('id') id: string,
    @Headers() headers: Record<string, string>,
  ) {
    return this.appService.subscribeToGroup(headers['userid'], id);
  }

  @Post('/groups/:id/unsubscribe')
  @HttpCode(204)
  unsubscribeFromGroup(
    @Param('id') id: string,
    @Headers() headers: Record<string, string>,
  ) {
    return this.appService.unsubscribeFromGroup(headers['userid'], id);
  }

  @Get('/posts')
  getPosts() {
    return this.appService.getPosts();
  }

  @Get('/posts/:id')
  getPost(@Param('id') id: string) {
    return this.appService.getPost(id);
  }

  @Get('/groups')
  getGroups(@Headers() headers: Record<string, string>) {
    console.log(headers['userid']);

    return this.appService.getGroups(headers['userid']);
  }
}

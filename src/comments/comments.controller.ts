import { Controller, Get, HttpCode } from '@nestjs/common';

@Controller('api/comments')
export class CommentsController {
  constructor() {}

  @Get(':id')
  @HttpCode(404)
  async getCommentsById() {
    return;
  }
}

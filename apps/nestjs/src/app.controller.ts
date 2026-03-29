import { Controller, Get, Res } from '@nestjs/common';
import { type Response } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(@Res() res: Response) {
    // Set response header to HTML content type
    res.type('text/html');
    res.send(this.appService.getHello());
  }
}

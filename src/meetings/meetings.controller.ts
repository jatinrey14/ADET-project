import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { MeetingsService } from './meetings.service';

@Controller('meetings')
export class MeetingsController {
  constructor(private readonly meetingsService: MeetingsService) {}

  @Get()
  findAll() {
    return this.meetingsService.findAll();
  }

  @Post()
  create(@Body() body: { meeting_date: string; client_id: number }) {
    return this.meetingsService.create(body.meeting_date, body.client_id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.meetingsService.remove(+id);
  }
}
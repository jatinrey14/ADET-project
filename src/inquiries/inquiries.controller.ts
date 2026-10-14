import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { InquiriesService } from './inquiries.service';

@Controller('inquiries')
export class InquiriesController {
  constructor(private readonly inquiriesService: InquiriesService) {}

  @Get()
  findAll() {
    return this.inquiriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inquiriesService.findOne(+id);
  }

  @Post()
  create(@Body() body: { inquiries_name: string; inquiries_contact: string }) {
    return this.inquiriesService.create(body.inquiries_name, body.inquiries_contact);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() body: { inquiries_name: string; inquiries_contact: string },
  ) {
    return this.inquiriesService.update(+id, body.inquiries_name, body.inquiries_contact);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.inquiriesService.remove(+id);
  }
}
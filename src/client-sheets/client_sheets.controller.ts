import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { ClientSheetsService } from './client_sheets.service';

@Controller('client-sheets')
export class ClientSheetsController {
  constructor(private readonly clientSheetsService: ClientSheetsService) {}

  @Get()
  findAll() {
    return this.clientSheetsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clientSheetsService.findOne(+id);
  }

  @Post()
  create(
    @Body()
    body: {
      client_name: string;
      client_phone_number: string;
      client_email: string;
      client_venue: string;
      client_guests: number;
      inquiries_id: number;
      user_id: number;
    },
  ) {
    return this.clientSheetsService.create(body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clientSheetsService.remove(+id);
  }
}
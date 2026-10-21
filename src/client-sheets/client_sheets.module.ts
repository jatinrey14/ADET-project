import { Module } from '@nestjs/common';
import { ClientSheetsService } from './client_sheets.service';
import { ClientSheetsController } from './client_sheets.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ClientSheetsController],
  providers: [ClientSheetsService],
})
export class ClientSheetsModule {}
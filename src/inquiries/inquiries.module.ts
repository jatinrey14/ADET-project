import { Module } from '@nestjs/common';
import { InquiriesService } from './inquiries.service';
import { InquiriesController } from './inquiries.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [InquiriesController],
  providers: [InquiriesService],
})
export class InquiriesModule {}
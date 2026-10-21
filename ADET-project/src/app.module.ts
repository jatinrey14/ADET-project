import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { InquiriesModule } from './inquiries/inquiries.module';
import { SuppliersModule } from './suppliers/suppliers.module';
import { ClientSheetsModule } from './client-sheets/client_sheets.module';
import { MeetingsModule } from './meetings/meetings.module';

@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    InquiriesModule,
    SuppliersModule,
    ClientSheetsModule,
    MeetingsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
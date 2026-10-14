import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

@Injectable()
export class MeetingsService {
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getPool();

  async findAll() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT * FROM meetings',
    );
    return rows;
  }

  async create(meeting_date: string, client_id: number) {
    const [result] = await this.pool().execute<ResultSetHeader>(
      'INSERT INTO meetings (meeting_date, client_id) VALUES (?, ?)',
      [meeting_date, client_id],
    );
    return {
      meeting_id: result.insertId,
      meeting_date,
      client_id,
      message: 'Meeting scheduled successfully',
    };
  }

  async remove(id: number) {
    const [res] = await this.pool().execute<ResultSetHeader>(
      'DELETE FROM meetings WHERE meeting_id = ?',
      [id],
    );
    if (res.affectedRows === 0) throw new NotFoundException('Meeting not found');
    return { message: 'Meeting deleted successfully' };
  }
}
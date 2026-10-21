import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

@Injectable()
export class ClientSheetsService {
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getPool();

  async findAll() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT * FROM client_sheets',
    );
    return rows;
  }

  async findOne(id: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT * FROM client_sheets WHERE client_id = ?',
      [id],
    );
    if (!rows[0]) throw new NotFoundException(`Client sheet with ID ${id} not found`);
    return rows[0];
  }

  async create(data: {
    client_name: string;
    client_phone_number: string;
    client_email: string;
    client_venue: string;
    client_guests: number;
    inquiries_id: number;
    user_id: number;
  }) {
    const [result] = await this.pool().execute<ResultSetHeader>(
      `INSERT INTO client_sheets 
      (client_name, client_phone_number, client_email, client_venue, client_guests, inquiries_id, user_id) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        data.client_name,
        data.client_phone_number,
        data.client_email,
        data.client_venue,
        data.client_guests,
        data.inquiries_id,
        data.user_id,
      ],
    );
    return {
      client_id: result.insertId,
      ...data,
      message: 'Client sheet created successfully',
    };
  }

  async remove(id: number) {
    const [res] = await this.pool().execute<ResultSetHeader>(
      'DELETE FROM client_sheets WHERE client_id = ?',
      [id],
    );
    if (res.affectedRows === 0) throw new NotFoundException('Client sheet not found');
    return { message: 'Client sheet deleted successfully' };
  }
}
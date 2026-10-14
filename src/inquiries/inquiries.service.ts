import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

@Injectable()
export class InquiriesService {
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getPool();

  // GET: Retrieve all inquiries
  async findAll() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT * FROM inquiries',
    );
    return rows;
  }

  // GET: Retrieve a single inquiry by ID
  async findOne(id: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT * FROM inquiries WHERE inquiries_id = ?',
      [id],
    );
    if (!rows[0]) throw new NotFoundException(`Inquiry with ID ${id} not found`);
    return rows[0];
  }

  // POST: Create a new inquiry
  async create(name: string, contact: string) {
    const [result] = await this.pool().execute<ResultSetHeader>(
      'INSERT INTO inquiries (inquiries_name, inquiries_contact) VALUES (?, ?)',
      [name, contact],
    );
    return {
      inquiries_id: result.insertId,
      inquiries_name: name,
      inquiries_contact: contact,
      message: 'Inquiry created successfully',
    };
  }

  // PUT: Update an inquiry
  async update(id: number, name: string, contact: string) {
    await this.findOne(id); // Ensure it exists first
    await this.pool().execute(
      'UPDATE inquiries SET inquiries_name = ?, inquiries_contact = ? WHERE inquiries_id = ?',
      [name, contact, id],
    );
    return this.findOne(id);
  }

  // DELETE: Delete an inquiry
  async remove(id: number) {
    const [res] = await this.pool().execute<ResultSetHeader>(
      'DELETE FROM inquiries WHERE inquiries_id = ?',
      [id],
    );
    if (res.affectedRows === 0) throw new NotFoundException(`Inquiry not found`);
    return { message: 'Inquiry deleted successfully' };
  }
}
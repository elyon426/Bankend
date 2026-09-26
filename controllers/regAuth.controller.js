
import {sql} from '../db/db.js';
import regAuth from '../Services/regAuth.service.js';

export async function registerUser(req, res) {
  try {
    // 1. Validate
    const result = regAuth(req.body);

    if (!result.valid) {
      return res.status(400).json({ error: result.message });
    }

    const { nationalID, firstName, lastName, email, phoneNo, DateOfBirth } = result.data;

    // 2. Check if customer already exists
    const existing = await sql`
      SELECT id FROM customers WHERE national_id = ${nationalID}
    `;

    if (existing.length > 0) {
      return res.status(409).json({
        error: 'Customer with this National ID already exists',
      });
    }

    // 3. Insert new customer (neon tagged template — NO $1 placeholders)
    const inserted = await sql`
      INSERT INTO customers (national_id, first_name, last_name, email, phone_no, date_of_birth)
      VALUES (${nationalID}, ${firstName}, ${lastName}, ${email}, ${phoneNo}, ${DateOfBirth})
      RETURNING id, national_id, first_name, last_name, email, phone_no, date_of_birth
    `;

    return res.status(201).json({
      message: 'Customer registered successfully',
      customer: inserted[0],
    });

  } catch (err) {
    console.error('Registration Error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
const bcrypt = require('bcrypt');
const { pool } = require('./config/database');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'config.env') });

const createAdmin = async () => {
  try {
    const email = 'shanthisilk@saree.com';
    const password = 'shantisilks123';
    const name = 'Admin User';

    // Check if admin already exists
    const existingAdmin = await pool.query(
      'SELECT id FROM admins WHERE email = $1',
      [email]
    );

    if (existingAdmin.rows.length > 0) {
      console.log('Admin user already exists!');
      return;
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create admin
    const result = await pool.query(
      'INSERT INTO admins (email, password, name, role) VALUES ($1, $2, $3, $4) RETURNING id, email, name',
      [email, hashedPassword, name, 'admin']
    );

    console.log('Admin user created successfully!');
    console.log('Email:', result.rows[0].email);
    console.log('Password:', password);
    console.log('Name:', result.rows[0].name);
    console.log('\nYou can now login to the admin panel with these credentials.');

  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    process.exit(0);
  }
};

createAdmin();

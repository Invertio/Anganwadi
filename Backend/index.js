const express = require('express');
const app = express();
const port = 3000;
const pool = require('./connection')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors= require('cors');
const crypto = require('crypto');

const JWT_SECRET = 'drlgvjiruervburhdnwndvfuhdsjkndvufsio5856r84gvefscdgtyvhb';

app.use(express.json())
app.use(cors())
app.get('/', (req, res) => {
    res.send('Hello World!');
});

const superAdminCheck = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  
  if (!token) {
    return res.status(401).send('No token provided');
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    
    // Check if user has superadmin role
    if (decoded.role !== 'Super-Admin') {
      return res.status(403).send('Super Admin access required');
    }
    
    req.user = decoded;
    next();
  } catch (err) {
    console.error(err);
    res.status(401).send('Invalid token');
  }
};



app.get('/api/admins', superAdminCheck, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, name, email, role, access 
      FROM users
      WHERE role = 'admin'  
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Update admin access (superadmin only)
app.put('/api/admins/:id/access', superAdminCheck, async (req, res) => {
  try {
    const userId = req.params.id;
    const { access } = req.body;

    console.log(access);

    // Validate access array
    if (!Array.isArray(access)) {
      return res.status(400).send('Access must be an array');
    }

    const validAccessTypes = ['accesscontrol', 'anganwadi', 'district', 'state', 'student_registration'];
    if (access.some(item => !validAccessTypes.includes(item))) {
      return res.status(400).send('Invalid access type');
    }

    const query = `
      UPDATE users 
      SET access = $1 
      WHERE id = $2 
      RETURNING id, name, email, role, access
    `;
    const values = [access, userId];
    
    const result = await pool.query(query, values);
    
    if (result.rowCount === 0) {
      return res.status(404).send('Admin not found');
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Update admin role (superadmin only)
app.put('/api/admins/:id/role', superAdminCheck, async (req, res) => {
  try {
    const userId = req.params.id;
    const { role } = req.body;

    const validRoles = ['admin', 'viewer'];
    if (!validRoles.includes(role)) {
      return res.status(400).send('Invalid role');
    }

    const query = `
      UPDATE users 
      SET role = $1 
      WHERE id = $2 
      RETURNING id, name, email, role, access
    `;
    const values = [role, userId];
    
    const result = await pool.query(query, values);
    
    if (result.rowCount === 0) {
      return res.status(404).send('Admin not found');
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});


app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password, access , role} = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `
      INSERT INTO users (name, email, password, access ,role)
      VALUES ($1, $2, $3, $4 , $5)
    `;
    const values = [name, email, hashedPassword, access , role];

    await pool.query(query, values);
    res.status(201).send('User registered successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Something went wrong');
  }
});



app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const query = `SELECT * FROM users WHERE email = $1`;
    const values = [email];

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(401).send('Invalid email or password');
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send('Invalid email or password');
    }

    // JWT token with 1 hour expiry
    const token = jwt.sign(
      { userId: user.id, email: user.email, access: user.access , role: user.role },
      JWT_SECRET,
      { expiresIn: '2h' }
    );

    return res.status(200).json({
      message: 'Login successful',
      token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        access: user.access,
        role: user.role
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).send('Something went wrong');
  }
});





app.post('/api/register-students', async (req, res) => {
  const {
    name,
    father_name,
    mother_name,
    age,
    gender,
    weight,
    dob,
    area,
    pincode,
    class: studentClass,
  } = req.body;

  if (
    !name ||
    !father_name ||
    !mother_name ||
    !age ||
    !gender ||
    !dob ||
    !area ||
    !pincode ||
    !studentClass
  ) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    const insertQuery = `
      INSERT INTO students (
        name, father_name, mother_name, age, gender, weight, dob, area, pincode, class, hash
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, '') RETURNING student_id;
    `;

    const result = await pool.query(insertQuery, [
      name,
      father_name,
      mother_name,
      age,
      gender,
      weight || null,
      dob,
      area,
      pincode,
      studentClass,
    ]);

    const studentId = result.rows[0].student_id;

    const hash = crypto
      .createHash('sha256')
      .update(`${area}${pincode}${studentId}`)
      .digest('hex');


    await pool.query(
      `UPDATE students SET hash = $1 WHERE student_id = $2`,
      [hash, studentId]
    );

    const fullData = await pool.query(
      `SELECT * FROM students WHERE student_id = $1`,
      [studentId]
    );

    res.status(201).json(fullData.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});


app.get('/api/student/:hex', async (req, res) => {
  const { hex } = req.params;
  try {
    const result = await pool.query(
      `SELECT * FROM students WHERE hash = $1`,
      [hex]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }
    //remove hash
    const { hash, ...studentWithoutHash } = result.rows[0];

    res.status(200).json(studentWithoutHash);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});





app.get('/api/students', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM students');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});



app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
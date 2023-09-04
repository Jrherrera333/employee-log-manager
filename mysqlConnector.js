import mysql from 'mysql2';

// Create a connection pool
const connection = mysql.createConnection({
  host: 'localhost',         // Your MySQL server's hostname
  user: 'root',      // Your MySQL username
  password: 'rafy07',
  database: 'employee_log_manager'   // Your MySQL database name
});

// Try to connect to the database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to MySQL!');
//   startApp();
});

export { connection };
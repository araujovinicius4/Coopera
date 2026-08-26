import 'dotenv/config';

export const config = {
  port: Number(process.env.PORT || 3001),
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  jwtSecret: process.env.JWT_SECRET || 'dev-only-change-me',
  mysql: {
    host: process.env.MYSQL_HOST || 'localhost',
    port: Number(process.env.MYSQL_PORT || 3306),
    user: process.env.MYSQL_USER || 'coopera',
    password: process.env.MYSQL_PASSWORD || 'coopera',
    database: process.env.MYSQL_DATABASE || 'coopera',
    multipleStatements: true
  }
};

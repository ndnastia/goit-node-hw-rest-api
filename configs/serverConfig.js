const serverConfig = {
    mongoUrl: process.env.DB_HOST ?? 'mongodb://localhost:27017',
    appName: process.env.PROJECT_NAME ?? 'Default name',
    port: process.env.PORT ? +process.env.PORT : 3000,
    jwtSecret: process.env.JWT_SECRET ?? 'secret-phrase',
    jwtExpires: process.env.JWT_EXPIRES ?? '1d',
    mailgunUser: process.env.EMAIL_USERNAME ?? '',
    mailgunPasswd: process.env.EMAIL_PASSWORD ?? '',
    emailFrom: process.env.EMAIL_FROM ?? 'admin@example.com',
  };
  
  module.exports = {serverConfig};
  
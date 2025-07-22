# Database Setup Guide

## 1. Install MySQL
- macOS: `brew install mysql`
- Ubuntu: `sudo apt-get install mysql-server`
- Windows: Download from https://dev.mysql.com/downloads/

## 2. Start MySQL Service
- macOS: `brew services start mysql`
- Ubuntu: `sudo systemctl start mysql`
- Windows: Start MySQL service from Services

## 3. Create Database
```sql
mysql -u root -p < database/schema.sql
```

## 4. Create User (Optional)
```sql
CREATE USER 'wellness_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON wellness_saas.* TO 'wellness_user'@'localhost';
FLUSH PRIVILEGES;
```

## 5. Update .env
Update DATABASE_URL in your .env file:
```
DATABASE_URL=mysql://wellness_user:your_password@localhost:3306/wellness_saas
```

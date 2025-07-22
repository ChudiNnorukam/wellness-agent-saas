const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class SetupManager {
  constructor() {
    this.projectRoot = path.dirname(__dirname);
    this.logsDir = path.join(this.projectRoot, 'logs');
    this.configDir = path.join(this.projectRoot, 'config');
  }

  async runSetup() {
    console.log('🚀 Setting up Real Business Integration System...\n');

    try {
      // 1. Install dependencies
      console.log('📦 Installing dependencies...');
      execSync('npm install', { cwd: this.projectRoot, stdio: 'inherit' });
      console.log('✅ Dependencies installed\n');

      // 2. Create necessary directories
      console.log('📁 Creating directories...');
      this.createDirectories();
      console.log('✅ Directories created\n');

      // 3. Create environment file
      console.log('⚙️  Setting up environment configuration...');
      this.createEnvironmentFile();
      console.log('✅ Environment file created\n');

      // 4. Create database setup script
      console.log('🗄️  Setting up database configuration...');
      this.createDatabaseSetup();
      console.log('✅ Database setup created\n');

      // 5. Create Google Analytics setup guide
      console.log('📊 Setting up Google Analytics integration...');
      this.createAnalyticsSetup();
      console.log('✅ Analytics setup guide created\n');

      console.log('🎉 Setup completed successfully!');
      console.log('\n📋 Next Steps:');
      console.log('1. Copy config/env.example to .env and fill in your credentials');
      console.log('2. Set up your MySQL database using database/schema.sql');
      console.log('3. Configure Google Analytics service account');
      console.log('4. Add your Stripe API keys to .env');
      console.log('5. Run: npm run sales (to test the sales optimizer)');

    } catch (error) {
      console.error('❌ Setup failed:', error.message);
      process.exit(1);
    }
  }

  createDirectories() {
    const dirs = [
      this.logsDir,
      this.configDir,
      path.join(this.projectRoot, 'database'),
      path.join(this.projectRoot, 'data')
    ];

    dirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`  Created: ${dir}`);
      }
    });
  }

  createEnvironmentFile() {
    const envPath = path.join(this.projectRoot, '.env');
    const envExamplePath = path.join(this.configDir, 'env.example');

    if (!fs.existsSync(envPath)) {
      fs.copyFileSync(envExamplePath, envPath);
      console.log(`  Created: ${envPath}`);
    } else {
      console.log(`  Environment file already exists: ${envPath}`);
    }
  }

  createDatabaseSetup() {
    const dbSetupPath = path.join(this.projectRoot, 'database', 'setup.md');
    const dbSetupContent = `# Database Setup Guide

## 1. Install MySQL
- macOS: \`brew install mysql\`
- Ubuntu: \`sudo apt-get install mysql-server\`
- Windows: Download from https://dev.mysql.com/downloads/

## 2. Start MySQL Service
- macOS: \`brew services start mysql\`
- Ubuntu: \`sudo systemctl start mysql\`
- Windows: Start MySQL service from Services

## 3. Create Database
\`\`\`sql
mysql -u root -p < database/schema.sql
\`\`\`

## 4. Create User (Optional)
\`\`\`sql
CREATE USER 'wellness_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON wellness_saas.* TO 'wellness_user'@'localhost';
FLUSH PRIVILEGES;
\`\`\`

## 5. Update .env
Update DATABASE_URL in your .env file:
\`\`\`
DATABASE_URL=mysql://wellness_user:your_password@localhost:3306/wellness_saas
\`\`\`
`;

    fs.writeFileSync(dbSetupPath, dbSetupContent);
    console.log(`  Created: ${dbSetupPath}`);
  }

  createAnalyticsSetup() {
    const analyticsSetupPath = path.join(this.projectRoot, 'config', 'analytics-setup.md');
    const analyticsSetupContent = `# Google Analytics Setup Guide

## 1. Create Google Cloud Project
1. Go to https://console.cloud.google.com/
2. Create a new project or select existing one
3. Enable Google Analytics API

## 2. Create Service Account
1. Go to IAM & Admin > Service Accounts
2. Click "Create Service Account"
3. Name it "wellness-analytics"
4. Grant "Analytics Read Only" role
5. Create and download JSON key file

## 3. Get Analytics View ID
1. Go to Google Analytics
2. Navigate to Admin > View Settings
3. Copy the View ID (format: 123456789)

## 4. Update .env
\`\`\`
GOOGLE_ANALYTICS_VIEW_ID=123456789
GOOGLE_APPLICATION_CREDENTIALS=path/to/your-service-account.json
\`\`\`

## 5. Test Connection
Run: \`npm run sales\` to test the analytics integration
`;

    fs.writeFileSync(analyticsSetupPath, analyticsSetupContent);
    console.log(`  Created: ${analyticsSetupPath}`);
  }
}

// Run setup
if (require.main === module) {
  const setup = new SetupManager();
  setup.runSetup().catch(console.error);
}

module.exports = { SetupManager }; 
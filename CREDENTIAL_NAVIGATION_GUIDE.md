# 🔑 Credential Navigation Guide

The AI Agents system now includes intelligent credential navigation that will open the exact pages where you need to find API keys and credentials. This saves you time and reduces errors by eliminating the need to navigate complex dashboards manually.

## 🚀 Quick Start

### 1. Navigate to a Specific Credential

```bash
# Navigate to Stripe publishable key
npm run quick-nav stripe publishable_key

# Navigate to Supabase anon key
npm run quick-nav supabase anon_key

# Navigate to MySQL host
npm run quick-nav mysql host

# Navigate to OpenAI API key
npm run quick-nav openai api_key
```

### 2. Full Guided Setup

```bash
# Run the complete guided setup
npm run setup-creds
```

### 3. Setup Specific Service

```bash
# Setup just Stripe credentials
npm run navigate stripe

# Setup just Supabase credentials
npm run navigate supabase
```

## 📋 Supported Services

The system supports navigation for the following services:

### 🔴 Stripe
- **publishable_key**: Publishable Key (starts with pk_test_ or pk_live_)
- **secret_key**: Secret Key (starts with sk_test_ or sk_live_)
- **webhook_secret**: Webhook Endpoint Secret (starts with whsec_)

### 🔵 Supabase
- **project_url**: Project URL (ends with .supabase.co)
- **anon_key**: Anon/Public Key (JWT token)
- **service_role_key**: Service Role Key (JWT token)

### 🟢 MySQL Database
- **host**: Database Host (e.g., your-db.mysql.database.azure.com)
- **port**: Database Port (usually 3306)
- **username**: Database Username
- **password**: Database Password

### 🟡 OpenAI
- **api_key**: API Key (starts with sk-)

### 🟠 Vercel
- **project_id**: Project ID
- **deployment_url**: Deployment URL

### 🟣 Google Cloud
- **project_id**: Project ID
- **service_account_key**: Service Account Key (JSON)

## 🎯 How It Works

### 1. **Automatic Browser Navigation**
The agent opens your browser to the exact page where you need to find the credential.

### 2. **Step-by-Step Instructions**
Clear, numbered instructions appear in your terminal showing exactly what to do.

### 3. **Credential Validation**
The system validates the format of your credentials to ensure they're correct.

### 4. **Environment File Generation**
Automatically generates a `.env` file with all your credentials properly formatted.

## 📖 Detailed Usage

### Quick Navigation Examples

```bash
# Stripe credentials
npm run quick-nav stripe publishable_key
npm run quick-nav stripe secret_key
npm run quick-nav stripe webhook_secret

# Supabase credentials
npm run quick-nav supabase project_url
npm run quick-nav supabase anon_key
npm run quick-nav supabase service_role_key

# MySQL credentials
npm run quick-nav mysql host
npm run quick-nav mysql port
npm run quick-nav mysql username
npm run quick-nav mysql password

# OpenAI credentials
npm run quick-nav openai api_key

# Vercel credentials
npm run quick-nav vercel project_id
npm run quick-nav vercel deployment_url

# Google Cloud credentials
npm run quick-nav google project_id
npm run quick-nav google service_account_key
```

### Full Setup Process

1. **Start the guided setup**:
   ```bash
   npm run setup-creds
   ```

2. **Follow the prompts**:
   - The system will check if you're logged into each service
   - It will open the exact pages for each credential
   - You'll get step-by-step instructions for each credential

3. **Enter your credentials**:
   - Copy the credential values from the browser
   - Enter them when prompted
   - The system validates the format automatically

4. **Complete setup**:
   - Your `.env` file is generated automatically
   - All credentials are validated
   - You're ready to start your AI agents

## 🔍 Credential Validation

The system automatically validates credential formats:

### Stripe
- **Publishable Key**: `pk_test_...` or `pk_live_...`
- **Secret Key**: `sk_test_...` or `sk_live_...`
- **Webhook Secret**: `whsec_...`

### Supabase
- **Project URL**: `https://your-project.supabase.co`
- **API Keys**: JWT token format (`eyJ...`)

### MySQL
- **Host**: Valid hostname format
- **Port**: Numeric port (1-65535)
- **Username**: Alphanumeric with underscores
- **Password**: Any non-empty string

### OpenAI
- **API Key**: `sk-...` format

## 🛠️ Advanced Usage

### Validate Existing Credentials

```bash
# Validate credentials in your .env file
npm run setup-creds validate
```

### Generate Environment Template

```bash
# Generate a template .env file
npm run setup-creds template
```

### Setup Specific Service

```bash
# Setup only Stripe
npm run navigate stripe

# Setup only Supabase
npm run navigate supabase

# Setup only MySQL
npm run navigate mysql
```

## 🔧 Troubleshooting

### Common Issues

1. **"Unknown service" error**
   - Check the service name spelling
   - Use `npm run quick-nav` to see available services

2. **"Unknown credential type" error**
   - Check the credential type spelling
   - Use `npm run quick-nav <service>` to see available credentials

3. **Browser doesn't open**
   - Make sure you have a default browser set
   - Try running the command again

4. **Login required**
   - The system will detect if you need to log in
   - Log in to the service dashboard first
   - Then run the navigation command again

### Manual Navigation

If the automatic navigation doesn't work, you can manually navigate using the URLs provided:

```bash
# Get instructions for a specific credential
npm run quick-nav stripe publishable_key
```

The output will show you the exact URL and step-by-step instructions.

## 📊 Integration with AI Agents

The CredentialNavigationAgent is integrated into your AI agent system:

- **Automatic monitoring**: Checks login status during agent cycles
- **Performance tracking**: Logs navigation attempts and success rates
- **Database integration**: Stores navigation history and credential validation results
- **Error handling**: Graceful fallbacks if navigation fails

## 🔐 Security Best Practices

1. **Never share credentials**: The system only opens pages, it doesn't store your actual credentials
2. **Use environment variables**: All credentials are stored in `.env` files
3. **Validate formats**: The system validates credential formats to prevent errors
4. **Secure storage**: Keep your `.env` file secure and never commit it to version control

## 📝 Environment File Structure

The system generates a `.env` file with this structure:

```env
# Database Configuration
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=ai_agents_db
MYSQL_CONNECTION_LIMIT=10

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# OpenAI Configuration
OPENAI_API_KEY=sk-...

# Vercel Configuration
VERCEL_PROJECT_ID=your_project_id
VERCEL_DEPLOYMENT_URL=https://your-project.vercel.app

# Google Cloud Configuration
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_SERVICE_ACCOUNT_KEY={"type": "service_account", ...}
```

## 🎉 Benefits

- **Time Saving**: No more searching through complex dashboards
- **Error Reduction**: Automatic format validation prevents typos
- **Consistency**: Standardized setup process across all services
- **Documentation**: Built-in instructions for each credential
- **Integration**: Seamless integration with your AI agent system

## 🚀 Next Steps

After setting up your credentials:

1. **Start your AI agents**: `npm start`
2. **Monitor performance**: Check the database for agent performance metrics
3. **Scale up**: Add more services as needed
4. **Customize**: Modify the navigation paths for your specific needs

The credential navigation system makes setting up your AI agents faster and more reliable than ever before! 
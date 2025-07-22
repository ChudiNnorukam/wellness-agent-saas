# Google Analytics Setup Guide

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
```
GOOGLE_ANALYTICS_VIEW_ID=123456789
GOOGLE_APPLICATION_CREDENTIALS=path/to/your-service-account.json
```

## 5. Test Connection
Run: `npm run sales` to test the analytics integration

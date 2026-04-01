// setup.js

const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');

// .env template
const envTemplate = `# API Keys
OPENAI_API_KEY=

OPEN_ROUTER_API_KEY=
OPENROUTER_API_KEY=

# Backend URLs
NEXT_PUBLIC_API_URL=/api
NEXT_PUBLIC_BACKEND_URL=

# Apollo API Keys
APOLLO_API_KEY=
APOLLO_SEARCH_API_KEY=

# Google Service Account Credential Path
GOOGLE_SERVICE_ACCOUNT_CRED=./credentials.json

# Optional Auth (Uncomment if needed)
# NEXTAUTH_SECRET=
# NEXTAUTH_URL=
# NEXT_PUBLIC_AUTH_URL=
# NEXT_PUBLIC_BASE_URL=
`;

// Create .env if it doesn't exist
if (!fs.existsSync(envPath)) {
  fs.writeFileSync(envPath, envTemplate);
  console.log('✅ .env file created with placeholders.');
} else {
  console.log('ℹ️ .env file already exists. Skipping creation.');
}

console.log('\n👉 Replace placeholder values in .env before running the app.');

// setup.js

const fs = require("fs");
const path = require("path");

const envPath = path.join(__dirname, ".env");

// .env template
const envTemplate = `# API Keys


# NEXT_PUBLIC_BASE_URL=
`;

// Create .env if it doesn't exist
if (!fs.existsSync(envPath)) {
  fs.writeFileSync(envPath, envTemplate);
  console.log("✅ .env file created with placeholders.");
} else {
  console.log("ℹ️ .env file already exists. Skipping creation.");
}

console.log("\n👉 Replace placeholder values in .env before running the app.");

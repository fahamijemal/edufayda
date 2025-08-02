🎓 EduFayda - Verified Learning Management System
Fayda Hackathon 2024 - Phase 1 Virtual
Timeline: July 26–31, 2025

👥 Team
Fahami Jemal Harun — Full Stack Developer

📘 Overview
EduFayda addresses the inefficiencies in Ethiopia’s education system caused by:

Manual and error-prone student verification

Document fraud

Geographic and administrative barriers

✅ Solution Highlights
A secure LMS powered by VeriFayda (Ethiopia's National Digital ID), offering:

OIDC-based identity verification

Course and student management

Instructor tools and analytics

Mobile-first, responsive design

🔐 VeriFayda Value
Verified Access: Only real students get credentials

Inclusive: Remote regions can easily participate

Secure & Compliant: Government-ready infrastructure

🛠️ Tech Stack
Area	Tools
Frontend	Next.js, TypeScript, Tailwind CSS, shadcn/ui, Radix UI
Backend/API	Next.js API Routes, Prisma ORM, PostgreSQL
Auth	VeriFayda OIDC, PKCE, JWT (via jose), better-auth
Security	Arcjet, Email OTP, CSRF/XSS protection
Deployment	Vercel / Railway, pnpm, Turbopack, Docker
Email	Resend

🔧 Environment Setup
Create .env.local in your project root and include the following:

env
Copy
Edit
# Database
DATABASE_URL=your_database_url_here

# Better Auth
BETTER_AUTH_SECRET=your_better_auth_secret
BETTER_AUTH_URL=http://localhost:3000

# VeriFayda Integration
VERIFAYDA_CLIENT_ID=your_client_id
VERIFAYDA_REDIRECT_URI=http://localhost:3000/callback
VERIFAYDA_AUTHORIZATION_ENDPOINT=https://esignet.ida.fayda.et/authorize
VERIFAYDA_TOKEN_ENDPOINT=https://esignet.ida.fayda.et/v1/esignet/oauth/v2/token
VERIFAYDA_USERINFO_ENDPOINT=https://esignet.ida.fayda.et/v1/esignet/oidc/userinfo
VERIFAYDA_CLIENT_ASSERTION_TYPE=urn:ietf:params:oauth:client-assertion-type:jwt-bearer
VERIFAYDA_PRIVATE_KEY_BASE64=your_base64_encoded_private_key

# Client-side
NEXT_PUBLIC_VERIFAYDA_CLIENT_ID=your_client_id
NEXT_PUBLIC_VERIFAYDA_REDIRECT_URI=http://localhost:3000/callback
NEXT_PUBLIC_VERIFAYDA_AUTHORIZATION_ENDPOINT=https://esignet.ida.fayda.et/authorize

# Misc
RESEND_API_KEY=your_resend_key
ARCJET_KEY=your_arcjet_key
EXPIRATION_TIME=15
ALGORITHM=RS256
🧪 Testing Instructions
VeriFayda Test Credentials
Test FIN: 6140798523917519

Test OTP: 111111

Local Run
bash
Copy
Edit
# Install dependencies
pnpm install

# Generate Prisma client
pnpm dlx prisma generate

# Start dev server
pnpm dev
Visit http://localhost:3000/login and test VeriFayda login with the test credentials above.

🧱 Features In Progress
 VeriFayda OIDC integration

 Course management

 Auth flow

 UI setup

 Real-time analytics

🏆 Why EduFayda?
Tackles real problems with tech-backed solutions

Uses national ID for verified, secure education

Designed for impact, inclusiveness, and scale

🔗 GitHub: github.com/fahamijemal/edufayda
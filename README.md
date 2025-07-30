# 🎓 EduFayda - Verified Learning Management System

> **🚀 Fayda Hackathon 2024 - Phase 1 Virtual**  
> **⏰ Development Timeline: 6 Days (July 26-31, 2024)**  
> **🏆 Goal: Advance to In-Person Finale (August 1-3, 2024)**

## 👥 Contributors
- **Fahami Jemal Harun** - Full Stack Developer
- **fahamijemal1@gmail.com** - 
## 📖 Project Synopsis

### 🎯 Problem Statement
Educational institutions in Ethiopia face significant challenges with student identity verification and enrollment processes:
- **Manual verification processes** are time-consuming and prone to errors
- **Document fraud** undermines the integrity of educational credentials
- **Lack of standardized identity verification** creates barriers for students from remote areas
- **Administrative overhead** increases costs and delays for institutions
- **Limited access to quality education** due to complex enrollment procedures

### 💡 Planned Solution
**EduFayda** is a modern Learning Management System that will leverage **VeriFayda (Ethiopian National Digital ID)** to create a trusted, verified educational ecosystem. Our solution will provide:

#### **Core Features (To Be Built):**
- **🔐 VeriFayda OIDC Integration**: Government-backed identity verification for all users
- **📚 Course Management**: Complete LMS functionality with course creation and management
- **👨‍🎓 Student Portal**: Personalized learning dashboard with progress tracking
- **👨‍🏫 Instructor Tools**: Modern teaching tools and student management
- **📊 Analytics Dashboard**: Real-time insights into learning progress and outcomes
- **📱 Mobile-First Design**: Accessible from any device, anywhere

#### **Key Innovations:**
- **Instant Verification**: Students enroll using their national digital ID
- **Zero Document Fraud**: Eliminates fake certificates and identity theft
- **Inclusive Access**: Serves rural and underserved populations through digital identity
- **Automated Compliance**: Meets all regulatory requirements automatically

### 🎯 Expected Outcome
- **For Students**: 
  - Instant enrollment with verified identity
  - Secure, tamper-proof academic records
  - Access to quality education regardless of location
  
- **For Educational Institutions**:
  - 90% reduction in enrollment processing time
  - Elimination of document fraud
  - Automated compliance reporting
  - Reduced administrative costs
  
- **For Society**:
  - Increased access to verified, quality education
  - Trust in digital educational credentials
  - Foundation for national skills development tracking

### 🏛️ Fayda's Role in Our Project
**VeriFayda will be the cornerstone of EduFayda's value proposition:**

#### **1. Trust Foundation**
- Every user verified through Ethiopia's national digital identity system
- Creates an ecosystem of trust between students, educators, and institutions
- Enables secure, government-backed educational credentials

#### **2. Fraud Prevention**
- Eliminates fake student registrations and certificate fraud
- Ensures only legitimate students can access courses and earn credentials
- Protects institutional reputation and credential integrity

#### **3. Inclusive Education**
- Students from any region can instantly verify their identity
- Removes geographic barriers to quality education
- Enables rural students to access urban educational opportunities

#### **4. Regulatory Compliance**
- Automatically meets government requirements for student verification
- Provides audit trails for regulatory reporting
- Ensures data privacy and security standards

#### **5. Future-Ready Infrastructure**
- Foundation for national education data interoperability
- Enables cross-institutional credit transfer
- Supports government education policy implementation

**EduFayda will transform VeriFayda from an identity tool into an education enabler, making quality education accessible, secure, and verifiable for all Ethiopians.**

## 🛠️ Tech Stack

### **Frontend & UI**
- **Next.js 15.4.1** - React framework with App Router for optimal performance
- **TypeScript** - Type-safe development for reliability
- **Tailwind CSS** - Utility-first CSS for rapid, responsive design
- **shadcn/ui** - Modern, accessible component library
- **Radix UI** - Primitive components for complex interactions

### **Backend & API**
- **Next.js API Routes** - Serverless backend functionality
- **better-auth** - Comprehensive authentication framework
- **Prisma ORM** - Type-safe database operations
- **PostgreSQL** - Robust, scalable database
- **jose** - JWT handling for secure OIDC implementation

### **VeriFayda Integration**
- **OpenID Connect (OIDC)** - Standard protocol implementation
- **PKCE (SHA-256)** - Secure authorization code exchange
- **Client Assertion JWT** - Advanced client authentication
- **Claims-based Authorization** - Granular permission control
- **Real-time Token Validation** - Continuous security verification

### **Security & Performance**
- **Arcjet** - Advanced rate limiting and bot protection
- **Email OTP** - Fallback authentication method
- **Session Management** - Secure user state handling
- **CSRF Protection** - Cross-site request forgery prevention
- **XSS Prevention** - Cross-site scripting protection

### **Development & Deployment**
- **pnpm** - Fast, efficient package management
- **Turbopack** - Next-generation bundler for development
- **ESLint & Prettier** - Code quality and formatting
- **Vercel/Railway** - Modern deployment platforms
- **Resend** - Reliable transactional email service


## 🧪 Testing & Demo Setup

### **VeriFayda Staging Environment**
- **Test FIN**: `6140798523917519`
- **Test OTP**: `111111`
- **Demo URL**: Will be available at `https://edufayda.vercel.app`
- **Local Development**: `http://localhost:3000`

### **Environment Configuration**

Create a `.env.local` file in your project root with the following configuration:

```env
# VeriFayda OIDC Configuration - IDA.fayda.et Staging
VERIFAYDA_CLIENT_ID=your_client_id_here
VERIFAYDA_REDIRECT_URI=http://localhost:3000/callback
VERIFAYDA_AUTHORIZATION_ENDPOINT=https://esignet.ida.fayda.et/authorize
VERIFAYDA_TOKEN_ENDPOINT=https://esignet.ida.fayda.et/v1/esignet/oauth/v2/token
VERIFAYDA_USERINFO_ENDPOINT=https://esignet.ida.fayda.et/v1/esignet/oidc/userinfo
VERIFAYDA_CLIENT_ASSERTION_TYPE=urn:ietf:params:oauth:client-assertion-type:jwt-bearer

# Client-side environment variables (NEXT_PUBLIC_ prefix)
NEXT_PUBLIC_VERIFAYDA_CLIENT_ID=your_client_id_here
NEXT_PUBLIC_VERIFAYDA_REDIRECT_URI=http://localhost:3000/callback
NEXT_PUBLIC_VERIFAYDA_AUTHORIZATION_ENDPOINT=https://esignet.ida.fayda.et/authorize

# JWT Configuration
EXPIRATION_TIME=15
ALGORITHM=RS256

# Other required variables (add your actual values)
DATABASE_URL=your_database_url_here
BETTER_AUTH_SECRET=your_secret_here
BETTER_AUTH_URL=http://localhost:3000
RESEND_API_KEY=your_resend_api_key_here
ARCJET_KEY=your_arcjet_key_here
VERIFAYDA_PRIVATE_KEY_BASE64=your_private_key_base64_here

```
use this for simplicity 
//better auth 
BETTER_AUTH_SECRET=m0wmosCoslxI1Z0RaCGgSUbqpLyO8OCv
BETTER_AUTH_URL=http://localhost:3000 #Base URL of your app

//neon db
DATABASE_URL="postgresql://neondb_owner:npg_b2SAMKLBOzi0@ep-still-sunset-a2u2lqo5-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"


//Resend
RESEND_API_KEY=re_Tq1UiAVC_85uPHkMx51HsPvJifjcphUzP

//arcject
ARCJET_KEY=ajkey_01k0vbwxqjfxrrh77ye6vyqcw5

**Note**: The staging environment uses the IDA.fayda.et endpoints for testing. Use the test FIN `6140798523917519` and OTP `111111` for authentication testing.

### **Planned Demo Features**
1. **Instant VeriFayda Login**: Seamless national ID authentication
2. **Course Creation**: Admin can create and manage courses
3. **Student Enrollment**: Verified students can instantly enroll
4. **Progress Tracking**: Real-time learning analytics
5. **Mobile Experience**: Responsive design across all devices

## 📊 Current Status

### **✅ Completed (Day 1)**
- [x] Repository setup and project initialization
- [x] Tech stack selection and dependency setup
- [x] VeriFayda OIDC research and documentation review
- [x] Database schema planning
- [x] Owlevents app download and registration
- [x] Telegram channel joined
- [x] Registration form completed

### **🔄 In Progress**
- [ ] VeriFayda OIDC integration with staging credentials
- [ ] Basic authentication flow implementation
- [ ] UI component library setup

### **📋 Upcoming**
- [ ] Core LMS functionality
- [ ] Advanced features and analytics
- [ ] Testing and deployment
- [ ] Demo preparation for finalist selection

## 🏆 Competitive Advantages

**Why EduFayda will advance to the In-Person Finale:**

- **🎯 Perfect Problem-Solution Fit**: Addresses real Ethiopian education challenges
- **🔐 Advanced VeriFayda Integration**: Goes beyond basic authentication to create verified educational ecosystem
- **⚡ Modern Tech Stack**: Uses cutting-edge technologies for optimal performance
- **🌍 Social Impact**: Enables inclusive education for all Ethiopians
- **📈 Scalable Solution**: Can serve millions of students nationwide
- **💼 Commercial Viability**: Clear path to market and revenue generation

## 🌟 Vision

By July 31st, EduFayda will demonstrate how VeriFayda can transform education in Ethiopia. We're not just building an LMS – we're creating the foundation for a trusted national education ecosystem where every student's journey is secure, verified, and accessible.

---

**🚀 Building the Future of Verified Education - Fayda Hackathon 2024**  
**🎯 Target: Advance to In-Person Finale at AFLEX Campus**  
**⏰ Follow our progress: [GitHub Repository](https://github.com/fahamijemal/edufayda)** 
<<<<<<< HEAD

## 🚀 Installation and Deployment

### Prerequisites
- **Node.js 20+** and **pnpm** package manager
- **PostgreSQL** database (local or cloud-hosted)
- **VeriFayda staging credentials** (provided by hackathon organizers)

### Installing Dependencies
```bash
# Clone the repository
git clone https://github.com/fahamijemal/edufayda.git
cd edufayda

# Install all project dependencies
pnpm install

# Generate Prisma client for database operations
pnpm dlx prisma generate
```

### Running the App Locally

#### 1. Environment Setup
Create a `.env` file in your project root with the required configuration:

```env
# Database Connection
DATABASE_URL="your-postgresql-database-url"

# Authentication Configuration
BETTER_AUTH_SECRET=your-secret-key-here
BETTER_AUTH_URL=http://localhost:3000

# VeriFayda OIDC Integration
VERIFAYDA_CLIENT_ID=crXYIYg2cJiNTaw5t-peoPzCRo-3JATNfBd5A86U8t0
VERIFAYDA_REDIRECT_URI=http://localhost:3000/callback
VERIFAYDA_AUTHORIZATION_ENDPOINT=https://esignet.ida.fayda.et/authorize
VERIFAYDA_TOKEN_ENDPOINT=https://esignet.ida.fayda.et/v1/esignet/oauth/v2/token
VERIFAYDA_USERINFO_ENDPOINT=https://esignet.ida.fayda.et/v1/esignet/oidc/userinfo
VERIFAYDA_CLIENT_ASSERTION_TYPE=urn:ietf:params:oauth:client-assertion-type:jwt-bearer
VERIFAYDA_PRIVATE_KEY_BASE64=your-private-key-base64

# Client-side Environment Variables
NEXT_PUBLIC_VERIFAYDA_CLIENT_ID=crXYIYg2cJiNTaw5t-peoPzCRo-3JATNfBd5A86U8t0
NEXT_PUBLIC_VERIFAYDA_REDIRECT_URI=http://localhost:3000/callback
NEXT_PUBLIC_VERIFAYDA_AUTHORIZATION_ENDPOINT=https://esignet.ida.fayda.et/authorize

# Additional Services
RESEND_API_KEY=your-resend-api-key
ARCJET_KEY=your-arcjet-key

# JWT Configuration
EXPIRATION_TIME=15
ALGORITHM=RS256
```

#### 2. Database Setup
```bash
# Apply database schema to your PostgreSQL database
pnpm dlx prisma db push

# (Optional) Seed the database with initial data
pnpm dlx prisma db seed
```

#### 3. Start Development Server
```bash
# Start the development server with Turbopack
pnpm dev

# The application will be available at http://localhost:3000
```

### Deploying the App Using Docker

#### Docker Deployment Setup
The application includes both `Dockerfile` and `docker-compose.yml` for containerized deployment.

#### Using Docker Compose (Recommended)
```bash
# Build and start all services
docker-compose up --build

# Run in detached mode (background)
docker-compose up -d --build

# Stop all services
docker-compose down
```

#### Using Docker Only
```bash
# Build the Docker image
docker build -t edufayda .

# Run the container with environment variables
docker run -p 3000:3000 --env-file .env edufayda
```

#### Docker Configuration Details
- **Dockerfile**: Multi-stage build optimized for production
- **docker-compose.yml**: Includes app service with environment variable support
- **Port**: Application runs on port 3000
- **Environment**: All necessary environment variables are passed through

### Testing VeriFayda Authentication

#### Staging Environment Testing
1. Navigate to `http://localhost:3000/login`
2. Click "Sign in with VeriFayda"
3. Use the provided test credentials:
   - **Test FIN**: `6140798523917519`
   - **Test OTP**: `111111`
4. Complete the OIDC authentication flow
5. Verify successful authentication and user data retrieval

#### Alternative Authentication
- Email OTP authentication is available as a fallback method
- Users can register and authenticate using email verification

### Production Deployment Notes

#### Environment Variables for Production
- Update `BETTER_AUTH_URL` to your production domain
- Change `VERIFAYDA_REDIRECT_URI` to your production callback URL
- Use secure, randomly generated secrets for all key values
- Ensure database URL points to your production database


# Phase 2 Testing Guide: Database and Authentication Setup

## 📋 Manual Setup Checklist

### 1. Database Setup Options

#### Option A: Local PostgreSQL with Docker (Recommended)
```bash
# Start PostgreSQL database
cd infra
docker-compose up -d

# Verify database is running
docker ps
```

#### Option B: Cloud Database (Supabase, Railway, etc.)
- Create a PostgreSQL database
- Update `law-gen/.env` with your connection string:
```env
DATABASE_URL="postgresql://username:password@host:port/database"
```

#### Option C: Local PostgreSQL Installation
- Install PostgreSQL locally
- Create database: `createdb lawgendb`
- Create user: `createuser lawgenuser -P`
- Grant permissions

### 2. Environment Configuration
Edit `law-gen/.env` to match your database:
```env
DATABASE_URL="postgresql://lawgenuser:password@localhost:5432/lawgendb"
NEXTAUTH_SECRET="your-generated-secret-here"
JWT_SECRET="your-generated-secret-here"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Database Initialization
```bash
cd law-gen

# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed with test data
npx prisma db seed
```

### 4. Start Development Server
```bash
npm run dev
```

## 🧪 Testing Steps

### 1. API Endpoint Testing

#### Test User Registration
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User",
    "role": "STUDENT"
  }'
```

#### Test Email Verification
```bash
# Check console logs for verification token, then:
curl -X POST http://localhost:3000/api/auth/verify \
  -H "Content-Type: application/json" \
  -d '{
    "token": "verification-token-from-logs"
  }'
```

#### Test Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@test.com",
    "password": "password123"
  }'
```

#### Test Password Reset
```bash
# Request reset
curl -X POST http://localhost:3000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@test.com"
  }'

# Reset with token (check console logs)
curl -X POST http://localhost:3000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token": "reset-token-from-logs",
    "password": "newpassword123"
  }'
```

### 2. Browser-Based Testing

#### Test Authentication Flow
1. Visit `http://localhost:3000/auth`
2. Try registering a new user
3. Check console for verification email logs
4. Verify email using the token from logs
5. Login with test credentials
6. Verify session persists on page refresh

#### Test Role-Based Access
1. Login as different users:
   - Student: `student@test.com` / `password123`
   - School Admin: `school@test.com` / `password123`
   - College Admin: `college@test.com` / `password123`
   - Lawyer: `lawyer@test.com` / `password123`
   - Super Admin: `admin@test.com` / `password123`

2. Test protected routes (middleware should redirect unauthenticated users)

### 3. Database Verification
```bash
# Open Prisma Studio to inspect data
npx prisma studio

# Check seeded users exist
npx prisma db execute --file <(echo "SELECT email, role FROM \"User\";")
```

## ✅ Verification Checklist

### Setup Verification
- [ ] `npx prisma generate` runs without errors
- [ ] `npx prisma db push` creates all tables
- [ ] `npx prisma db seed` creates 5 test users
- [ ] `npm run dev` starts server on port 3000
- [ ] No console errors on server startup

### API Verification
- [ ] POST `/api/auth/register` returns success for valid data
- [ ] POST `/api/auth/verify` verifies email tokens
- [ ] POST `/api/auth/login` returns JWT token for valid credentials
- [ ] POST `/api/auth/forgot-password` sends reset email (console log)
- [ ] POST `/api/auth/reset-password` updates password with valid token

### Authentication Verification
- [ ] NextAuth session persists across page refreshes
- [ ] `useAuth` hook returns correct user data
- [ ] Protected routes redirect unauthenticated users
- [ ] Role-based middleware allows appropriate access

### Database Verification
- [ ] All Prisma models created (User, Student, School, etc.)
- [ ] Test users created with correct roles
- [ ] Relationships work (User -> Student, etc.)
- [ ] Sessions table tracks active sessions

## 🚨 Common Issues & Solutions

### Database Connection Issues
**Error:** `P1001: Can't reach database server`
- **Solution:** Ensure Docker container is running: `docker ps`
- **Solution:** Check DATABASE_URL in `.env` matches docker-compose.yml
- **Solution:** Wait 30 seconds after starting Docker for DB to initialize

**Error:** `P1000: Authentication failed`
- **Solution:** Verify DATABASE_URL credentials match docker-compose.yml
- **Solution:** Check if database exists: `docker exec -it lawgen-postgres psql -U lawgenuser -d lawgendb`

### NextAuth Issues
**Error:** `NEXTAUTH_SECRET must be set`
- **Solution:** Ensure NEXTAUTH_SECRET is set in `.env`

**Error:** `Session not persisting`
- **Solution:** Check NEXTAUTH_URL matches your dev server URL
- **Solution:** Clear browser cookies and try again

### Prisma Issues
**Error:** `Prisma client not generated`
- **Solution:** Run `npx prisma generate` after schema changes

**Error:** `Migration failed`
- **Solution:** Reset database: `npx prisma migrate reset --force`

### API Issues
**Error:** `CORS error`
- **Solution:** Ensure requests include proper headers
- **Solution:** Check Next.js CORS configuration

**Error:** `Validation error`
- **Solution:** Check request body matches Zod schema in API routes

## 🧪 Quick Test Commands

```bash
# Health check - should return HTML
curl http://localhost:3000

# Test registration
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"quicktest@example.com","password":"test123","name":"Quick Test","role":"STUDENT"}'

# Test login with seeded user
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"student@test.com","password":"password123"}'

# Check database users
npx prisma db execute --file <(echo "SELECT email, role, \"isVerified\" FROM \"User\";")
```

## 📊 Testing Results Template

After testing, update this template:

### Setup Results
- Database: [✅/❌] Connected successfully
- Prisma: [✅/❌] Generated client successfully
- Seeding: [✅/❌] Created test users
- Server: [✅/❌] Started on port 3000

### API Results
- Registration: [✅/❌] Working
- Verification: [✅/❌] Working
- Login: [✅/❌] Working
- Password Reset: [✅/❌] Working

### Frontend Results
- Session Management: [✅/❌] Working
- Route Protection: [✅/❌] Working
- Role-Based Access: [✅/❌] Working

### Issues Found
- [List any issues and solutions]

## 🎯 Next Steps

Once testing is complete and all checks pass:
1. Update TODO.md to mark Phase 2 as complete
2. Move to Phase 3: Core UI Components and Layouts
3. Consider adding real email service (SendGrid, Resend, etc.)

---

**Phase 2 is complete when all verification checks pass!** 🚀

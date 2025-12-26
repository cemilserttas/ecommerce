@echo off
set DATABASE_URL=postgresql://neondb_owner:npg_KSJjb1Ik3ing@ep-holy-resonance-aen7p5ro-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require
set NEXTAUTH_SECRET=ecommerce-super-secret-key-2024
set NEXTAUTH_URL=http://localhost:3000
npx prisma %*

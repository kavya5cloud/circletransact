# 🏢 Circle Office Transaction Tracker

A comprehensive transaction management system with role-based access control and professional reporting.

## 🚀 Quick Start

### 1. Database Setup

The application uses SQLite for local development. Your data is stored in:
```
db/custom.db
```

### 2. Initialize Database

Run the database initialization script:
```bash
./scripts/init-db.sh
```

Or manually initialize:
```bash
# Set environment variables
export DATABASE_URL="file:$(pwd)/db/custom.db"

# Push database schema
npx prisma db push

# Generate Prisma client
npx prisma generate
```

### 3. Start Development Server

```bash
npm run dev
```

The application will be available at: http://localhost:3000

## 📊 Database Information

- **Type**: SQLite
- **Location**: `./db/custom.db`
- **Persistence**: Data persists between server restarts
- **Backup**: Copy `db/custom.db` for backups
- **Portability**: Single file database - easy to move

## 🗄️ Database Schema

The database includes:
- **Users**: Authentication and role management
- **Transactions**: Financial transaction records
- **Permissions**: Module-based access control
- **User Permissions**: Link users to specific modules

## 🔧 Environment Variables

Create a `.env.local` file for local development:
```env
DATABASE_URL="file:./db/custom.db"
NODE_ENV="development"
JWT_SECRET="your-jwt-secret-key-here"
```

## 💾 Data Persistence

✅ **Local Storage**: All data stored in SQLite file  
✅ **Development Ready**: Database persists between restarts  
✅ **Production Ready**: Configure with production database  
✅ **Backup Friendly**: Single file for easy backups  
✅ **Portable**: Move database file between environments  

## 🛠️ Development Commands

```bash
# Initialize database
npm run db:push

# Generate Prisma client
npm run db:generate

# Start development server
npm run dev

# Check database health
curl http://localhost:3000/api/db

# Initialize database with defaults
curl -X POST http://localhost:3000/api/db
```

## 🔍 Troubleshooting

### Database Connection Issues
1. Check if `db/` directory exists
2. Verify `DATABASE_URL` in `.env` file
3. Run `npm run db:push` to create tables
4. Check `dev.log` for error messages

### Common Issues
- **"Database locked"**: Stop the dev server and restart
- **"Table not found"**: Run database initialization
- **"Permission denied"**: Check file permissions on `db/` directory

## 📱 Local Development Benefits

- **Fast Development**: No network latency
- **Offline Capability**: Work without internet
- **Easy Debugging**: Direct database access
- **Data Control**: Complete ownership of data
- **Quick Setup**: No external database required

## 🚀 Production Deployment

For production, update the `DATABASE_URL` environment variable:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/circleoffice"
```

---

**Circle Office** - Professional Transaction Management System  
© 2024 Circle Office. All rights reserved.
#!/bin/bash

echo "🗄️  Initializing Circle Office Database..."

# Check if database directory exists
if [ ! -d "db" ]; then
    echo "Creating database directory..."
    mkdir -p db
fi

# Set environment variables
export DATABASE_URL="file:$(pwd)/db/custom.db"
export NODE_ENV="development"

echo "📊 Database URL: $DATABASE_URL"
echo "🔧 Environment: $NODE_ENV"

# Initialize Prisma
echo "🚀 Running Prisma DB push..."
npx prisma db push

# Generate Prisma client
echo "⚡ Generating Prisma client..."
npx prisma generate

# Initialize database with default data
echo "💾 Initializing database with default permissions..."
curl -X POST http://localhost:3000/api/db -H "Content-Type: application/json" 2>/dev/null || echo "⚠️  Note: Make sure the dev server is running to initialize database"

echo "✅ Database initialization complete!"
echo ""
echo "🎯 Circle Office Transaction Tracker is ready to use:"
echo "   • Local Development: http://localhost:3000"
echo "   • Database: SQLite at $DATABASE_URL"
echo "   • Logs: Check dev.log for any issues"
echo ""
echo "💡 Tips:"
echo "   • Run 'npm run dev' to start the development server"
echo "   • Your data is stored locally in the SQLite database"
echo "   • Database will persist between server restarts"
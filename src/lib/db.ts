import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
};

export const db = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = db;
}

// Database initialization function
export async function initializeDatabase() {
  try {
    // Test database connection
    await db.$connect();
    
    // Create default permissions if they don't exist
    const defaultPermissions = [
      { name: 'dashboard', module: 'dashboard', description: 'Access to dashboard' },
      { name: 'transactions', module: 'transactions', description: 'Access to transactions' },
      { name: 'reports', module: 'reports', description: 'Access to reports' },
      { name: 'admin', module: 'admin', description: 'Access to admin panel' }
    ];

    for (const permission of defaultPermissions) {
      await db.permission.upsert({
        where: { name: permission.name },
        update: { description: permission.description, module: permission.module },
        create: { name: permission.name, description: permission.description, module: permission.module }
      });
    }

    console.log('Database initialized successfully');
    return true;
  } catch (error) {
    console.error('Database initialization failed:', error);
    return false;
  }
}

// Database health check
export async function checkDatabaseHealth() {
  try {
    await db.$queryRaw`SELECT 1`;
    return { status: 'healthy', timestamp: new Date().toISOString() };
  } catch (error) {
    console.error('Database health check failed:', error);
    return { status: 'unhealthy', error: error.message, timestamp: new Date().toISOString() };
  }
}
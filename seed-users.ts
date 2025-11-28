import { db } from './src/lib/db';
import bcrypt from 'bcryptjs';

async function createAdminUser() {
  try {
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    const admin = await db.user.upsert({
      where: { email: 'admin@example.com' },
      update: {},
      create: {
        email: 'admin@example.com',
        password: hashedPassword,
        name: 'Admin User',
        role: 'ADMIN',
        isActive: true,
        canDownload: true
      }
    });

    console.log('Admin user created/updated:', admin);
    
    // Create a test viewer user
    const viewerPassword = await bcrypt.hash('viewer123', 12);
    
    const viewer = await db.user.upsert({
      where: { email: 'viewer@example.com' },
      update: {},
      create: {
        email: 'viewer@example.com',
        password: viewerPassword,
        name: 'Viewer User',
        role: 'VIEWER',
        isActive: true,
        canDownload: false
      }
    });

    console.log('Viewer user created/updated:', viewer);
    
  } catch (error) {
    console.error('Error creating seed users:', error);
  } finally {
    await db.$disconnect();
  }
}

createAdminUser();
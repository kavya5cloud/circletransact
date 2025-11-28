import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'ADMIN' | 'VIEWER';
  isActive: boolean;
  canDownload: boolean;
  permissions: string[];
}

export interface AuthToken {
  userId: string;
  email: string;
  role: 'ADMIN' | 'VIEWER';
  permissions: string[];
}

export function verifyToken(token: string): AuthToken | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthToken;
  } catch (error) {
    return null;
  }
}

export function getTokenFromRequest(request: Request): string | null {
  const authHeader = request.headers.get('Authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return null;
}

export function hasPermission(userPermissions: string[], requiredPermission: string): boolean {
  return userPermissions.includes(requiredPermission) || userPermissions.includes('all');
}

export function isAdmin(userRole: string): boolean {
  return userRole === 'ADMIN';
}

export function canDownloadReports(user: User): boolean {
  return user.canDownload || isAdmin(user.role);
}
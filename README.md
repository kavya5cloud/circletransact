# Company Transaction Tracker

A comprehensive transaction management system with role-based access control and reporting features built with Next.js 15, TypeScript, and Tailwind CSS.

## Features

### 🔐 User Roles & Permissions
- **Admin**: Full access to all features including user management
- **Viewer**: Read-only access to transactions and reports (if permitted)

### 📊 Dashboard
- Real-time statistics (daily, weekly, monthly totals)
- Recent transactions overview
- Responsive design with sidebar navigation

### 💳 Transaction Management
- Add, edit, and delete transactions
- Filter by date range, category, payment method
- Search functionality
- Support for multiple payment methods (Cash, Online, Other)

### 📋 Reports
- Generate PDF reports with company branding
- Filtered reports by date and categories
- Download functionality for authorized users

### 👥 Admin Panel
- User management (create, edit, deactivate users)
- Role assignment and permissions
- Activity tracking

### 🎨 UI/UX
- Modern, clean interface similar to Notion/Google Analytics
- Dark/Light mode toggle
- Fully responsive design
- Mobile-friendly navigation

## Tech Stack

- **Frontend**: Next.js 15 with App Router
- **Backend**: Next.js API routes
- **Database**: SQLite with Prisma ORM
- **Styling**: Tailwind CSS with shadcn/ui components
- **Authentication**: JWT-based authentication
- **PDF Generation**: jsPDF
- **State Management**: React Context API

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd company-transaction-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Set up the database:
```bash
npm run db:push
```

4. Create seed users:
```bash
npx tsx seed-users.ts
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Default Users

### Admin User
- **Email**: admin@example.com
- **Password**: admin123
- **Permissions**: Full access to all features

### Viewer User
- **Email**: viewer@example.com
- **Password**: viewer123
- **Permissions**: View-only access

## API Routes

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/logout` - User logout

### Transactions
- `GET /api/transactions` - Get transactions (with filtering)
- `POST /api/transactions` - Create new transaction
- `PUT /api/transactions/[id]` - Update transaction
- `DELETE /api/transactions/[id]` - Delete transaction

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

### Reports
- `POST /api/reports/generate` - Generate PDF report

### Admin
- `GET /api/admin/users` - Get all users
- `POST /api/admin/users` - Create new user
- `PUT /api/admin/users/[id]` - Update user
- `DELETE /api/admin/users/[id]` - Delete user
- `PATCH /api/admin/users/[id]/toggle-active` - Toggle user active status

## Database Schema

### Users
- `id` - Unique identifier
- `email` - User email (unique)
- `name` - User name (optional)
- `password` - Hashed password
- `role` - User role (ADMIN/VIEWER)
- `isActive` - Account status
- `canDownload` - Permission to download reports

### Transactions
- `id` - Unique identifier
- `date` - Transaction date
- `amount` - Transaction amount
- `category` - Transaction category
- `description` - Transaction description
- `paymentMethod` - Payment method (CASH/ONLINE/OTHER)
- `partyName` - Name of the transaction party
- `invoiceImage` - URL to invoice image (optional)
- `userId` - Foreign key to user

## Features Breakdown

### Authentication System
- JWT-based authentication with secure password hashing
- Role-based access control
- Session management with localStorage
- Protected routes and API endpoints

### Transaction Management
- Full CRUD operations for transactions
- Advanced filtering and search
- Data validation and error handling
- Responsive data tables

### Reporting System
- PDF generation with company branding
- Customizable date ranges and filters
- Summary statistics
- Professional formatting

### Admin Panel
- User management interface
- Role and permission management
- Account activation/deactivation
- Bulk operations support

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Role-based access control
- Input validation and sanitization
- SQL injection prevention with Prisma
- XSS protection with proper escaping

## Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:push` - Push schema changes to database
- `npm run db:generate` - Generate Prisma client
- `npm run db:migrate` - Run database migrations
- `npm run db:reset` - Reset database

### Project Structure
```
src/
├── app/                 # Next.js app router pages
│   ├── api/            # API routes
│   ├── admin/          # Admin panel
│   ├── dashboard/      # Dashboard
│   ├── reports/        # Reports page
│   ├── transactions/   # Transaction management
│   └── login/          # Authentication pages
├── components/         # Reusable UI components
│   ├── ui/            # shadcn/ui components
│   └── ...            # Custom components
├── contexts/          # React contexts
├── lib/              # Utility functions
└── hooks/            # Custom React hooks
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.
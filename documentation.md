# StockMaster

<div align="center">

![StockMaster Banner](https://via.placeholder.com/800x200/4F46E5/ffffff?text=StockMaster+-+Modern+Inventory+Management)

**A Modern Inventory Management System**

*Digitize and streamline all stock-related operations with real-time tracking and centralized control*

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-Latest-green.svg)](https://nodejs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14+-black.svg)](https://nextjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16+-blue.svg)](https://www.postgresql.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

[🚀 Live Demo](#) • [📖 Documentation](DOCUMENTATION.md) • [🐛 Report Bug](#) • [✨ Request Feature](#)

</div>

---

## 🎯 Overview

**StockMaster** by Team Gear 5 is a comprehensive, modular Inventory Management System (IMS) built to replace fragmented manual tracking with a unified digital solution. Developed during a hackathon, this system provides enterprise-grade inventory control for warehouses, manufacturers, and distribution centers.

### Why StockMaster?

Traditional inventory management suffers from:
- ❌ Manual paper-based registers prone to errors
- ❌ Disconnected Excel spreadsheets without real-time sync
- ❌ No visibility into stock movements across locations
- ❌ Time-consuming reconciliation processes
- ❌ Lack of automated alerts and insights

**StockMaster solves these problems by providing:**
- ✅ **Centralized Platform** – Single source of truth for all inventory data
- ✅ **Real-Time Updates** – Instant stock level changes across operations
- ✅ **Multi-Warehouse Support** – Manage multiple locations seamlessly
- ✅ **Complete Audit Trail** – Track every movement through comprehensive ledger
- ✅ **Smart Alerts** – Proactive notifications for low stock and critical events
- ✅ **Visual Analytics** – Interactive dashboards and insightful reports

---

## 📋 Table of Contents

- [✨ Key Features](#-key-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [🚀 Quick Start](#-quick-start)
- [📖 Documentation](#-documentation)
- [🏗️ Architecture](#️-architecture)
- [🔌 API Reference](#-api-reference)
- [📸 Screenshots](#-screenshots)
- [🗺️ Roadmap](#️-roadmap)
- [👥 Team](#-team)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## ✨ Key Features

### 🎯 Core Functionality

<table>
<tr>
<td width="50%">

#### 📦 Product Management
- Create products with SKU, category, and UOM
- Track stock across multiple locations
- Set reordering rules and thresholds
- Organize with product categories

</td>
<td width="50%">

#### 📥 Receipt Processing
- Record vendor deliveries
- Add supplier information
- Automatic stock updates
- Status tracking (Draft → Confirmed → Done)

</td>
</tr>
<tr>
<td width="50%">

#### 📤 Delivery Orders
- Process customer shipments
- Pick and pack workflows
- Automatic stock deductions
- Reference tracking

</td>
<td width="50%">

#### 🔄 Internal Transfers
- Move stock between warehouses
- Transfer between locations/racks
- Complete movement history
- Ledger logging for every transfer

</td>
</tr>
<tr>
<td width="50%">

#### ⚖️ Stock Adjustments
- Reconcile physical vs. recorded stock
- Document adjustment reasons
- Automatic updates with audit trail
- Batch adjustment support

</td>
<td width="50%">

#### 📊 Comprehensive Dashboard
- Real-time KPI monitoring
- Recent activity feed
- Item distribution histogram
- Visual analytics and charts

</td>
</tr>
</table>

### 🌟 Advanced Features

- 🔔 **Smart Alerts** – Low stock notifications and automated warnings
- 🏢 **Multi-Warehouse** – Manage unlimited locations from one system
- 🔍 **Advanced Search** – SKU lookup and intelligent filtering
- 📈 **Visual Analytics** – Charts, graphs, and distribution histograms
- 📱 **Responsive Design** – Optimized for desktop, tablet, and mobile
- 🔐 **Role-Based Access** – Manager and Staff permission levels
- 📜 **Complete Audit Trail** – Every transaction logged in ledger
- 🚀 **Real-Time Sync** – Instant updates across all operations

---

## 🛠️ Tech Stack

### Frontend
![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

### Backend
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)

### Database
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

### Tools & Libraries
- **Authentication:** JWT with OTP-based password reset
- **ORM:** Prisma for type-safe database access
- **API:** RESTful architecture
- **Styling:** Tailwind CSS utility-first framework

---

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have:
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** package manager
- **PostgreSQL** (v14 or higher) - [Download](https://www.postgresql.org/download/)
- **Git** - [Download](https://git-scm.com/)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/teamgear5/stockmaster.git
cd stockmaster

# 2. Install root dependencies
npm install

# 3. Install frontend dependencies
cd frontend
npm install
cd ..

# 4. Set up environment variables
cp .env.example .env
# Edit .env with your database credentials

# 5. Initialize the database
npx prisma migrate dev --name init
npx prisma generate

# 6. (Optional) Seed with sample data
npm run seed
```

### Configuration

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/stockmaster"

# Authentication
JWT_SECRET="your-super-secret-jwt-key-change-this"
JWT_EXPIRES_IN="7d"

# Server
PORT=3000
NODE_ENV=development

# Email (for OTP)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
```

### Running the Application

```bash
# Terminal 1: Start the backend server
npm run dev

# Terminal 2: Start the frontend (in a new terminal)
cd frontend
npm run dev
```

**Access the application:**
- 🌐 Frontend: http://localhost:3000
- 🔌 Backend API: http://localhost:3000/api/v1
- 📊 API Documentation: http://localhost:3000/api/docs (coming soon)

### Docker Setup (Alternative)

```bash
# Build and run with Docker Compose
docker-compose up -d

# Run migrations
docker-compose exec app npx prisma migrate dev

# Stop containers
docker-compose down
```

---

# StockMaster

... (markdown truncated for brevity in this canvas)

## 📖 Documentation

### 📚 Complete Documentation

For comprehensive documentation including API references, database schema, workflows, and architecture diagrams, see:

**➡️ [FULL DOCUMENTATION](https://docs.google.com/document/d/1_HbrVhHvwr8g4P11MiZ0lYKgxAyB8D8JEhhrywyIG9s/edit?usp=sharing)**

### Quick Links

| Documentation Section                                                                                                       | Description                           |
| --------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| [🏗️ System Architecture](https://docs.google.com/document/d/1_HbrVhHvwr8g4P11MiZ0lYKgxAyB8D8JEhhrywyIG9s/edit?usp=sharing) | Three-tier architecture breakdown     |
| [🗄️ Database Schema](https://docs.google.com/document/d/1_HbrVhHvwr8g4P11MiZ0lYKgxAyB8D8JEhhrywyIG9s/edit?usp=sharing)     | Complete data model and relationships |
| [🔌 API Reference](https://docs.google.com/document/d/1_HbrVhHvwr8g4P11MiZ0lYKgxAyB8D8JEhhrywyIG9s/edit?usp=sharing)        | All endpoints with examples           |
| [📊 Dashboard Guide](https://docs.google.com/document/d/1_HbrVhHvwr8g4P11MiZ0lYKgxAyB8D8JEhhrywyIG9s/edit?usp=sharing)      | Dashboard features and KPIs           |
| [🔄 Workflow Examples](https://docs.google.com/document/d/1_HbrVhHvwr8g4P11MiZ0lYKgxAyB8D8JEhhrywyIG9s/edit?usp=sharing)    | Real-world usage scenarios            |
| [🚀 Deployment Guide](https://docs.google.com/document/d/1_HbrVhHvwr8g4P11MiZ0lYKgxAyB8D8JEhhrywyIG9s/edit?usp=sharing)     | Production deployment steps           |

... (rest of file continues)

---

## 🏗️ Architecture

StockMaster follows a modern **three-tier architecture** for scalability and maintainability:

```
┌─────────────────────────────────────────┐
│         CLIENT LAYER                     │
│         Next.js Frontend                 │
│  ┌────────────────────────────────┐    │
│  │  • UI Components               │    │
│  │  • State Management            │    │
│  │  • Client-side Routing         │    │
│  │  • Real-time Updates           │    │
│  └────────────────────────────────┘    │
└──────────────┬──────────────────────────┘
               │ HTTP/REST API
               ▼
┌─────────────────────────────────────────┐
│      APPLICATION LAYER                   │
│      Node.js + Express.js                │
│  ┌────────────────────────────────┐    │
│  │  • Authentication & JWT        │    │
│  │  • Business Logic              │    │
│  │  • Input Validation            │    │
│  │  • Error Handling              │    │
│  └────────────────────────────────┘    │
└──────────────┬──────────────────────────┘
               │ Prisma ORM
               ▼
┌─────────────────────────────────────────┐
│         DATA LAYER                       │
│         PostgreSQL Database              │
│  ┌────────────────────────────────┐    │
│  │  • Normalized Schema           │    │
│  │  • Foreign Key Constraints     │    │
│  │  • Indexed Queries             │    │
│  │  • Transaction Support         │    │
│  └────────────────────────────────┘    │
└─────────────────────────────────────────┘
```

**Key Design Principles:**
- **Separation of Concerns** – Each layer has distinct responsibilities
- **Type Safety** – Prisma provides end-to-end type safety
- **Scalability** – Horizontal scaling support for high traffic
- **Security** – JWT authentication, input validation, SQL injection prevention

[📖 View Detailed Architecture →](DOCUMENTATION.md#system-architecture)

---

## 🔌 API Reference

### Base URL
```
http://localhost:3000/api/v1
```

### Quick Reference

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/auth/signup` | POST | Register new user |
| `/auth/login` | POST | Authenticate user |
| `/products` | GET | List all products |
| `/products` | POST | Create new product |
| `/receipts` | POST | Create receipt |
| `/receipts/:id/confirm` | PUT | Confirm receipt |
| `/deliveries` | POST | Create delivery |
| `/transfers` | POST | Create transfer |
| `/dashboard/stats` | GET | Get KPIs |
| `/dashboard/activities` | GET | Recent activities |

### Example Request

```bash
# Create a new product
curl -X POST http://localhost:3000/api/v1/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Steel Rods",
    "sku": "STL-001",
    "uom": "kg",
    "categoryId": "category_uuid"
  }'
```

[📖 View Complete API Documentation →](DOCUMENTATION.md#api-documentation)

---

## 📸 Screenshots

> **Note:** Add your actual screenshots here after deployment

<div align="center">

### Dashboard Overview
![Dashboard](https://via.placeholder.com/800x450/4F46E5/ffffff?text=Dashboard+Screenshot)

### Product Management
![Products](https://via.placeholder.com/800x450/10B981/ffffff?text=Product+Management)

### Receipt Processing
![Receipts](https://via.placeholder.com/800x450/F59E0B/ffffff?text=Receipt+Processing)

### Analytics & Reports
![Analytics](https://via.placeholder.com/800x450/EF4444/ffffff?text=Analytics+Dashboard)

</div>

---

## 🗺️ Roadmap

### ✅ Phase 1: MVP (Completed)
- [x] User authentication with JWT
- [x] Product management (CRUD)
- [x] Receipt processing
- [x] Delivery management
- [x] Internal transfers
- [x] Stock adjustments
- [x] Dashboard with KPIs
- [x] Multi-warehouse support

### 🚧 Phase 2: Enhanced Features (In Progress)
- [ ] Barcode/QR code scanning
- [ ] Email notifications system
- [ ] Advanced reporting (PDF/Excel export)
- [ ] Batch operations
- [ ] Mobile responsive optimization
- [ ] Real-time notifications

### 📋 Phase 3: Enterprise Features (Q2 2025)
- [ ] Mobile app (React Native)
- [ ] Multi-tenant architecture
- [ ] Advanced role permissions
- [ ] Third-party integrations (QuickBooks, SAP)
- [ ] Predictive analytics
- [ ] Automated reordering

### 🚀 Phase 4: AI & Automation (Future)
- [ ] AI-powered demand forecasting
- [ ] Computer vision for counting
- [ ] Chatbot for queries
- [ ] Machine learning anomaly detection
- [ ] IoT device integration

[View Detailed Roadmap →](DOCUMENTATION.md#roadmap)

---

## 👥 Team

<div align="center">

### Team Gear 5 - Hackathon 2024

</div>

<table align="center">
<tr>
<td align="center" width="33%">
<img src="https://via.placeholder.com/150" width="100px;" alt="Krushna"/><br />
<sub><b>Krushna S. Mohod</b></sub><br />
<sub>Team Lead & Full Stack</sub><br />
<a href="https://github.com/krushnamohod">GitHub</a> • <a href="https://linkedin.com/in/krushnamohod">LinkedIn</a>
</td>
<td align="center" width="33%">
<img src="https://via.placeholder.com/150" width="100px;" alt="Priyanshu"/><br />
<sub><b>Priyanshu S. Thakare</b></sub><br />
<sub>Frontend Developer</sub><br />
<a href="https://github.com/priyanshu">GitHub</a> • <a href="https://linkedin.com/in/priyanshu">LinkedIn</a>
</td>
<td align="center" width="33%">
<img src="https://via.placeholder.com/150" width="100px;" alt="Lokesh"/><br />
<sub><b>Lokesh A. Chaudhary</b></sub><br />
<sub>Backend Developer</sub><br />
<a href="https://github.com/lokesh">GitHub</a> • <a href="https://linkedin.com/in/lokesh">LinkedIn</a>
</td>
</tr>
</table>

### Contributions

- **Krushna S. Mohod** – Led project architecture, database design, and core feature implementation
- **Priyanshu S. Thakare** – Designed UI/UX, implemented responsive components and dashboard
- **Lokesh A. Chaudhary** – Developed RESTful APIs, authentication system, and business logic

*All team members actively participated in feature development, debugging, code reviews, and testing.*

---

## 🤝 Contributing

We welcome contributions from the community! Whether it's bug fixes, new features, or documentation improvements, your help is appreciated.

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open a Pull Request**

### Contribution Guidelines

- ✅ Follow existing code style and conventions
- ✅ Write clear, descriptive commit messages
- ✅ Add tests for new features
- ✅ Update documentation as needed
- ✅ Ensure all tests pass before submitting
- ✅ Keep PRs focused on a single feature/fix

### Development Setup

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run linter
npm run lint

# Format code
npm run format
```

### Code of Conduct

This project follows the [Contributor Covenant](https://www.contributor-covenant.org/) Code of Conduct. Please be respectful and constructive in all interactions.

---

## 🐛 Known Issues

- Performance optimization needed for warehouses with 10,000+ products
- Database relation queries could be optimized for better performance
- Mobile app version is in development

**Report issues:** [GitHub Issues](https://github.com/teamgear5/stockmaster/issues)

---

## 🔒 Security

If you discover a security vulnerability, please email krushna@example.com directly. Do not open a public issue.

**Security measures implemented:**
- JWT-based authentication
- Password hashing with bcrypt
- SQL injection prevention via Prisma ORM
- Input validation and sanitization
- CORS protection
- Rate limiting on API endpoints

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 Team Gear 5

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files...
```

---

## 🙏 Acknowledgments

Special thanks to:

- 🎓 **Hackathon Organizers** – For providing the platform and opportunity
- 👨‍🏫 **Mentors** – For guidance and technical support
- 💻 **Open Source Community** – For amazing tools and libraries
- 📚 **Documentation Teams** – Next.js, Prisma, Express.js, PostgreSQL
- 🌟 **Contributors** – Everyone who has contributed to this project

### Technologies & Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Express.js Guide](https://expressjs.com/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

---

## 📞 Support & Contact

Need help or have questions?

- 📧 **Email:** teamgear5@example.com
- 💬 **Slack:** [Join our workspace](#)
- 🐛 **Issues:** [GitHub Issues](https://github.com/teamgear5/stockmaster/issues)
- 💡 **Discussions:** [GitHub Discussions](https://github.com/teamgear5/stockmaster/discussions)

---

## 🌟 Star History

If you find StockMaster useful, please consider giving it a star! ⭐

[![Star History Chart](https://api.star-history.com/svg?repos=teamgear5/stockmaster&type=Date)](https://star-history.com/#teamgear5/stockmaster&Date)

---

## 📊 Project Stats

![GitHub repo size](https://img.shields.io/github/repo-size/teamgear5/stockmaster)
![GitHub stars](https://img.shields.io/github/stars/teamgear5/stockmaster?style=social)
![GitHub forks](https://img.shields.io/github/forks/teamgear5/stockmaster?style=social)
![GitHub issues](https://img.shields.io/github/issues/teamgear5/stockmaster)
![GitHub pull requests](https://img.shields.io/github/issues-pr/teamgear5/stockmaster)

---

<div align="center">

### Made with ❤️ by Team Gear 5

**StockMaster** - *Streamline Your Inventory, Simplify Your Business*

[⬆ Back to Top](#stockmaster)

</div>
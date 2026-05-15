# Enterprise Agro ERP – Quick Context

## 1. Project Overview
- **ERP for:** Agro Chemical, Fertilizer, Seed, Pesticide, Distribution
- **Goals:** Real-time stock, batch traceability, accurate accounting, dealer due control, production costing, analytics

## 2. Core Modules & Dependencies
- Auth → Master Data → Inventory → Sales → Finance → Reporting
- Manufacturing → Inventory & QC → Finance
- CRM → Master Data
- HRM → Master Data
- Notification → All modules

## 3. Technology Stack
- **Backend:** Laravel + PostgreSQL + Redis
- **Frontend:** React + Vite + Tailwind + ShadCN UI
- **Mobile:** Flutter, offline-first, GPS & push notifications
- **API:** RESTful, versioned, JWT auth, validation, audit
- **Queue:** Laravel Queue + Horizon

## 4. Architecture & Code Rules
- Modular monolith, service & repository layers, DDD, clean architecture, event-driven workflow
- **Controllers:** thin, only request/response
- **Service:** all business logic, transaction handling
- **Inventory:** ledger-based, FEFO/FIFO, no negative stock
- **Finance:** double-entry accounting, posted voucher immutable
- **Posting Engine:** auto accounting, batch, inventory, reversal, audit trail
- **UI/UX:** responsive, reusable components, dark mode, accessibility

## 5. Development Phases
1. **Core:** Master Data, Inventory, Finance
2. **Production & Distribution:** Manufacturing, QC, Sales, CRM
3. **Mobile:** offline sync, GPS, push notifications
4. **Advanced:** Reporting & Analytics, UI/UX enhancements, BI-ready DB
5. **QA & Deployment:** unit, integration, E2E, stress, regression, CI/CD

## 6. Transaction & QA
- Atomic transactions, rollback if any step fails, concurrency-safe
- **QA:** unit, integration, E2E, stress, regression, mobile offline validation

## 7. Missing Features / Improvements
- Advanced reporting & predictive analytics
- Multi-currency, VAT/GST, export-import duty handling
- Mobile offline-first sync, conflict resolution
- BI-ready database, archival policies, indexing & query optimization

## 8. Master Document Reference
- Keep full Master Document file available for detailed workflows, ERD, API, UI/UX, coding rules

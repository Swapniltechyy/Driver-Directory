# Architectural & Product Decisions Log (decisions.md)

| Decision ID | Date | Decision | Reasoning | Alternatives Considered | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **DEC-001** | 2026-09-29 | **Scope Restriction: Driver Directory Only** | User explicitly instructed to build ONLY the public Driver Directory page. Admin sidebar, dashboard, and login are excluded. | Building full admin portal in initial phase. | **APPROVED** |
| **DEC-002** | 2026-09-29 | **Standalone Vanilla JS + CSS System** | Ensures maximum speed, zero build step failures, clean semantic DOM structure, exact visual pixel-matching with design reference, and easy future migration to Next.js/Vite. | Next.js / React build setup (adds unnecessary build dependency risk for single directory page). | **APPROVED** |
| **DEC-003** | 2026-09-29 | **Font Awesome 6 & Google Fonts Integration** | Provides official vector icons (car, location-dot, phone, whatsapp, users) and clean typography (`Plus Jakarta Sans`) without heavy asset overhead. | Native browser fonts and emoji icons. | **APPROVED** |
| **DEC-004** | 2026-09-29 | **Strict AND-Based Category Matching** | Ensures selecting `Owner` + `Driver` shows ONLY contacts who are both an Owner and a Driver, fulfilling exact operational requirements. | OR-based category matching. | **APPROVED** |
| **DEC-005** | 2026-09-29 | **Relational Schema for Categories & Locations** | Contacts belong to 1 City, 1 Area/Stand, and can have multiple Categories via a junction table `contact_categories`. Prevents contact duplication. | Flat single-table structure or comma-separated category strings. | **PROPOSED** |
| **DEC-006** | 2026-09-29 | **Neon PostgreSQL Database Integration Deferred to Phase 5** | Database credentials will only be requested in Phase 4 after explicit approval of Phase 1-3. | Early DB setup with hardcoded/mock connection string. | **APPROVED** |
| **DEC-007** | 2026-09-29 | **Component Architecture & Server: React JSX + Node.js (Express)** | User explicitly requested React JSX and Node.js. Converted frontend into modular React components and backend to Express REST API. | Single-file Vanilla JS DOM manipulations. | **APPROVED** |
| **DEC-008** | 2026-09-29 | **Production-Grade Separated `frontend/` and `backend/` Directory Structure** | Restructured project into dedicated `frontend/` (React + Vite + Pages + Components + Services) and `backend/` (Node + Express + Routes + Controllers + Data) folders to follow professional enterprise architecture. | Flat unorganized root directory. | **APPROVED** |



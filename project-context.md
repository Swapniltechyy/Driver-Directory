# Project Context: Travel & Tourism Driver Directory

## 1. Project Overview & Purpose
The **Travel & Tourism Driver Directory** is a specialized web application built for transport coordinators, travel agents, and operation staff to maintain and quickly search a centralized directory of transport service providers, including:
* **Drivers**: Individuals operating vehicles for tourist transport.
* **Vendors**: Transportation agencies, suppliers, or third-party vehicle providers.
* **Owners**: Individuals or entities holding ownership of commercial passenger vehicles.

The purpose of this application is to streamline transportation logistics by enabling fast lookup by **Person Name**, **City**, **Area/Stand**, and **Category combinations** (Owner, Driver, Vendor).

---

## 2. Business Problem & Target Users
* **Business Problem**: Travel agencies operating in mountain and tourism circuits (e.g., Darjeeling, Kalimpong, Siliguri, Mirik) struggle with fragmented contact lists, leading to delays when booking vehicles or verifying driver availability.
* **Target Users**: Non-technical transport desks, operational staff, and travel agents. The interface must be intuitive, fast, and accessible without requiring formal training.

---

## 3. Functional Requirements
1. **Directory Search**: Partial and case-insensitive matching by person name.
2. **Dynamic Location Filtering**:
   * Filter by **City**.
   * Dynamic **Area/Stand** filter dependent on the selected city (shows only stands applicable to the chosen city).
3. **Multi-Select Category Filtering**:
   * Supports categories: `Driver`, `Vendor`, `Owner`.
   * Strict **AND-based** multi-category filtering (e.g., selecting `Owner` + `Driver` matches only individuals who possess *both* roles).
4. **Contact & Quick Actions**:
   * Click-to-call direct `tel:` links for contact numbers.
   * Direct WhatsApp action links using formatted contact numbers (`https://wa.me/...`).
5. **Interactive Record Detail**:
   * Clickable row/card opening a detailed modal view with complete vehicle, location, and contact metadata.
6. **Data Display States**:
   * Populated result state with count indicator.
   * No search results / empty dataset state with clear reset actions.
   * Loading state placeholders.

---

## 4. Scope Boundaries

### Current Development Scope (In-Scope)
* Public-facing responsive **Driver Directory UI & Page**.
* Clean component structure for client-side search, filtering, and detail modal.
* Local data-layer architecture matching future database schema.
* Responsive layouts for Desktop, Tablet, and Mobile.
* Comprehensive documentation files (`project-context.md`, `UI.md`, `decisions.md`, `DB.md`).

### Excluded Scope (Out of Scope for Current Phase)
* Admin Dashboard & Admin Navigation Sidebar.
* Authentication, Login, and User Roles.
* Admin CRUD forms for editing/deleting drivers.
* Notification systems & Analytics dashboards.
* Backend API / Database connection (Will be added in Phase 5 & 6 after user approval & credentials).

---

## 5. Technology Stack & Production Folder Architecture

### Stack
* **Frontend**: React 18 (JSX), Vite, Modular Components & Pages architecture.
* **Backend**: Node.js & Express.js REST API (`backend/server.js`) with controllers, routes, and data services.
* **Styling**: Vanilla CSS Design System with Slate & Emerald Palette.
* **Database Target**: Neon PostgreSQL (Planned for Phase 5).

### Project Directory Layout
```
drivermng/
├── package.json               # Root workspace orchestrator
├── project-context.md         # Full project architectural documentation
├── decisions.md               # Architectural decision log
├── UI.md                      # UI Design System guidelines
├── DB.md                      # Neon PostgreSQL schema plan
├── backend/                   # Production Node.js / Express Backend
│   ├── package.json
│   ├── server.js              # Server entry point
│   └── src/
│       ├── app.js             # Express application & middleware setup
│       ├── controllers/       # Business logic (driverController.js, locationController.js)
│       ├── routes/            # REST API endpoints (driverRoutes.js, locationRoutes.js)
│       └── data/              # Database seed layer (seedData.js)
└── frontend/                  # Production React (JSX) Frontend
    ├── package.json
    ├── vite.config.js         # Vite dev server & API proxy config
    ├── index.html             # React mounting HTML template
    └── src/
        ├── main.jsx           # Client root mounting script
        ├── App.jsx            # App root component
        ├── pages/             # Page components (DriverDirectoryPage.jsx)
        ├── components/        # Modular UI components (Header, SearchFilters, DriverCard, DriverModal, etc.)
        ├── services/          # Centralized API service layer (api.js)
        └── styles/            # CSS Design system tokens & utility classes (index.css)
```



---

## 6. Implementation Status
* **Phase 1**: Project inspection & architectural documentation complete. Driver Directory UI implementation in progress matching design reference.
* **Phase 2**: Functional client-side search & filtering logic pending user review of Phase 1.
* **Phase 3**: Proposed improvements review.
* **Phase 4-7**: Neon PostgreSQL database integration, API layer, and automated testing pending explicit user authorization.

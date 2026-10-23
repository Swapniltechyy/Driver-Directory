# Neon PostgreSQL Database Schema & Architecture Plan (DB.md)

> **Note**: Database integration will occur in **Phase 5** after explicit user approval and provision of Neon connection parameters. This document outlines the proposed schema.

---

## 1. Relational Entity Relationship Diagram

```
+----------------+        +-------------------+        +----------------+
|     cities     | 1    N |       areas       |        |   categories   |
+----------------+--------+-------------------+        +----------------+
| id (PK)        |        | id (PK)           |        | id (PK)        |
| name           |        | city_id (FK)      |        | code (UNIQUE)  |
| state          |        | name              |        | name           |
+----------------+        +-------------------+        +----------------+
                                    |                           |
                                    | 1                         | 1
                                    |                           |
                                    v N                         v N
                          +-------------------+        +--------------------+
                          |     contacts      | 1    N | contact_categories |
                          +-------------------+--------+--------------------+
                          | id (PK)           |        | contact_id (FK)    |
                          | name              |        | category_id (FK)   |
                          | phone_number      |        +--------------------+
                          | whatsapp_number   |
                          | city_id (FK)      |
                          | area_id (FK)      |
                          +-------------------+
                                    |
                                    | 1
                                    v N
                          +-------------------+
                          |     vehicles      |
                          +-------------------+
                          | id (PK)           |
                          | contact_id (FK)   |
                          | make              |
                          | model             |
                          | reg_number        |
                          +-------------------+
```

---

## 2. Table Definitions & Column Constraints

### A. Table: `cities`
Stores valid cities/districts in the tourism circuit.
```sql
CREATE TABLE cities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    state VARCHAR(100) DEFAULT 'West Bengal',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### B. Table: `areas`
Stores specific stands or hubs associated with a city.
```sql
CREATE TABLE areas (
    id SERIAL PRIMARY KEY,
    city_id INT NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_city_area UNIQUE(city_id, name)
);
```

### C. Table: `categories`
Lookup table for contact roles (`driver`, `vendor`, `owner`).
```sql
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE, -- 'owner', 'driver', 'vendor'
    name VARCHAR(100) NOT NULL
);

INSERT INTO categories (code, name) VALUES
('owner', 'Owner'),
('driver', 'Driver'),
('vendor', 'Vendor');
```

### D. Table: `contacts`
Stores primary directory profiles (drivers/vendors/owners).
```sql
CREATE TABLE contacts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    whatsapp_number VARCHAR(20),
    city_id INT NOT NULL REFERENCES cities(id) ON DELETE RESTRICT,
    area_id INT NOT NULL REFERENCES areas(id) ON DELETE RESTRICT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### E. Table: `contact_categories` (Junction Table)
Supports multi-category assignments without record duplication.
```sql
CREATE TABLE contact_categories (
    contact_id INT NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
    category_id INT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    PRIMARY KEY (contact_id, category_id)
);
```

### F. Table: `vehicles`
Stores vehicle details linked to a contact (supports 1-to-many relationship if a contact owns multiple vehicles).
```sql
CREATE TABLE vehicles (
    id SERIAL PRIMARY KEY,
    contact_id INT NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
    make VARCHAR(100) NOT NULL, -- e.g., 'Toyota', 'Mahindra', 'Maruti Suzuki'
    model VARCHAR(100) NOT NULL, -- e.g., 'Innova', 'Bolero', 'Swift'
    reg_number VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

---

## 3. Query Patterns & AND-Based Category Search Logic

### A. Fetching Drivers with Filter Criteria (Name, City, Area, AND-Based Categories)
```sql
SELECT 
    c.id,
    c.name,
    c.phone_number,
    c.whatsapp_number,
    city.name AS city_name,
    area.name AS area_name,
    v.make AS vehicle_make,
    v.model AS vehicle_model,
    ARRAY_AGG(cat.code) AS categories
FROM contacts c
JOIN cities city ON c.city_id = city.id
JOIN areas area ON c.area_id = area.id
LEFT JOIN vehicles v ON v.contact_id = c.id
JOIN contact_categories cc ON cc.contact_id = c.id
JOIN categories cat ON cat.id = cc.category_id
WHERE 
    ($1::text IS NULL OR c.name ILIKE '%' || $1 || '%')
    AND ($2::int IS NULL OR c.city_id = $2)
    AND ($3::int IS NULL OR c.area_id = $3)
GROUP BY c.id, city.name, area.name, v.make, v.model
-- AND-Based Category Filtering Clause:
HAVING 
    ($4::text[] IS NULL OR $4::text[] <@ ARRAY_AGG(cat.code)::text[])
ORDER BY c.name ASC;
```

---

## 4. Performance & Indexing Strategy
* `idx_contacts_name`: `CREATE INDEX idx_contacts_name ON contacts(name ILIKE);`
* `idx_contacts_city_area`: `CREATE INDEX idx_contacts_city_area ON contacts(city_id, area_id);`
* `idx_contact_categories`: Primary key `(contact_id, category_id)` covers fast join lookups.
* `idx_areas_city`: `CREATE INDEX idx_areas_city ON areas(city_id);`

---

## 5. Security & Access Control
* **Database Connection**: Server-side only via `DATABASE_URL` environment variable. Never exposed to browser bundle.
* **Parameterized Queries**: All database queries must use prepared statements/parameterization to eliminate SQL injection vulnerabilities.
* **SSL Requirement**: Connection string must enforce `sslmode=require` for Neon PostgreSQL.

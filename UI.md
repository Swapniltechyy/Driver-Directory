# UI Design System & Component Guidelines (UI.md)

## 1. Overview & Aesthetics
The **Driver Directory** interface follows a modern, clean, and professional visual aesthetic designed specifically for transport operators. It features soft slate backgrounds, high-contrast white card containers, clear typography, and vivid semantic category badges.

---

## 2. Branding & Color Palette

### Base & Background Colors
| Token Name | Hex Code | Purpose / Usage |
| :--- | :--- | :--- |
| `--color-bg-main` | `#F4F7FA` | Page body background (soft grayish ice blue) |
| `--color-surface` | `#FFFFFF` | Primary card & input background |
| `--color-border` | `#E2E8F0` | Subtle container borders |
| `--color-border-hover` | `#CBD5E1` | Card hover border state |

### Brand & Text Colors
| Token Name | Hex Code | Purpose / Usage |
| :--- | :--- | :--- |
| `--color-navy-dark` | `#0F172A` | Search button, header logo, primary headings |
| `--color-navy-mid` | `#1E293B` | Main card titles & driver names |
| `--color-text-body` | `#334155` | Secondary text & labels |
| `--color-text-muted` | `#64748B` | Subtitles, vehicle names, location text |

### Semantic Category Badges
| Category | Badge BG | Text Color | Border |
| :--- | :--- | :--- | :--- |
| **Owner** | `#DCFCE7` (Soft Green) | `#15803D` (Dark Green) | `1px solid #BBF7D0` |
| **Driver** | `#DBEAFE` (Soft Blue) | `#1D4ED8` (Dark Blue) | `1px solid #BFDBFE` |
| **Vendor** | `#F3E8FF` (Soft Purple) | `#7E22CE` (Dark Purple) | `1px solid #E9D5FF` |

### Avatar Background Colors (Soft Pastels)
* `RT`: BG `#E0F2FE`, Text `#0369A1` (Light Blue)
* `SR`: BG `#DCFCE7`, Text `#15803D` (Light Green)
* `PG`: BG `#F3E8FF`, Text `#7E22CE` (Light Purple)
* `KL`: BG `#FEF3C7`, Text `#B45309` (Light Amber)
* `AS`: BG `#CCFBF1`, Text `#0F766E` (Light Teal)
* `DS`: BG `#FEE2E2`, Text `#B91C1C` (Light Coral)
* `BT`: BG `#EDE9FE`, Text `#6D28D9` (Light Violet)
* `SD`: BG `#E0F2FE`, Text `#0284C7` (Light Sky Blue)

### Accent Actions
* **WhatsApp Button**: BG `#25D366` (Brand Green), Hover `#20BD5A`, Icon White `#FFFFFF`.
* **Primary Search Button**: BG `#1E2D4A` / `#0F172A`, Hover `#1E293B`, Text `#FFFFFF`.

---

## 3. Typography
* **Primary Font Family**: `'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
* **Google Fonts Imports**: Weights 400, 500, 600, 700.

| Hierarchy | Font Size | Weight | Line Height | Color |
| :--- | :--- | :--- | :--- | :--- |
| **Page Title** | `1.75rem` (`28px`) | 700 (Bold) | 1.2 | `#0F172A` |
| **Subtitle** | `0.95rem` (`15px`) | 400 (Regular) | 1.4 | `#64748B` |
| **Driver Name** | `1.05rem` (`17px`) | 700 (Bold) | 1.3 | `#1E293B` |
| **Filter Label** | `0.80rem` (`13px`) | 600 (Semibold) | 1.2 | `#475569` |
| **Card Subtext** | `0.875rem` (`14px`)| 500 (Medium) | 1.3 | `#64748B` |
| **Badge Text** | `0.75rem` (`12px`) | 600 (Semibold) | 1.0 | Specific category color |

---

## 4. Icons
Font Awesome 6 icon definitions:
* **Search**: `fa-solid fa-magnifying-glass`
* **City Location**: `fa-solid fa-location-dot`
* **Area/Stand**: `fa-solid fa-bus-simple`
* **Category Filter**: `fa-solid fa-users`
* **Phone Action**: `fa-solid fa-phone`
* **Car Vehicle**: `fa-solid fa-car-side`
* **WhatsApp**: `fa-brands fa-whatsapp`
* **Chevron Navigation**: `fa-solid fa-chevron-right`
* **Sort Icon**: `fa-solid fa-arrow-down-short-wide`

---

## 5. UI Components & Layout Specs

### Header Section
* Left-aligned logo with twin mountain peak icon + "Travel & Tourism" branding.
* Title: "Driver Directory" with subtitle "Find verified drivers, vendors and owners for your travel and tourism needs."
* Right-aligned mountain landscape SVG vector illustration with road and pin marker.

### Filter Bar Container
* Background: `#FFFFFF` card with `borderRadius: 14px`, `boxShadow: 0 4px 20px -2px rgba(0,0,0,0.05)`.
* Padding: `16px 20px`.
* Layout: Grid / Flexbox containing Name Search, City Select, Area/Stand Select, Category Multi-Select, Search Button, and Clear Filters action.

### Driver Record Card
* Background: `#FFFFFF` card, `borderRadius: 12px`, `padding: 16px 20px`, `border: 1px solid #E2E8F0`.
* Hover state: `transform: translateY(-2px)`, `border-color: #CBD5E1`, `box-shadow: 0 8px 24px -4px rgba(0,0,0,0.06)`.
* Horizontal sections:
  1. Avatar circle (`46px x 46px`) with initials.
  2. Driver info: Bold name + Car icon with Vehicle model.
  3. Contact info: Phone icon + formatted number + WhatsApp green action icon.
  4. Location info: Location pin + City name + Area/Stand subtext.
  5. Category Pills: Owner, Driver, Vendor badges.
  6. Chevron arrow right button.

---

## 6. Responsive Layout Breakpoints
* **Desktop (> 1024px)**: Single horizontal row for filter bar; 6-column layout per driver card.
* **Tablet (768px - 1023px)**: 2-row filter bar grid; condensed card layout.
* **Mobile (< 767px)**: Stacked single-column filter bar; stacked driver card with touch-friendly targets.

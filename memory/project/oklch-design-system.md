---
name: OKLCH Design System Implementation
description: Applied OKLCH color system across all module pages
type: project
---

**Rule:** All module pages now use the centralized OKLCH color system from Badge.vue.

**Why:** Consistent visual language across the entire application, matching the reference design.

**How to apply:**
- Stats icons use: `oklch(58% 0.18 255)` (Info/Primary), `oklch(62% 0.18 145)` (Success), `oklch(72% 0.16 80)` (Warning)
- Status badges use: `oklch(62% 0.18 145)` for active, `oklch(60% 0.20 25)` for inactive/danger
- All colors are applied via inline styles on stat-icon elements or via the Badge component's color prop

**Modules updated:**
- Permissions: ✅ Stats icons + status badges
- Customers: ✅ Stats icons + status badges
- Agencies: ✅ Stats icons + status badges
- Payments: ✅ Stats icons
- Settings: ✅ Navigation active state

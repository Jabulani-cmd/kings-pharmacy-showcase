# Kings Pharmacy — Demo Environment Build Plan

Goal: turn the current shell into a populated, presentation-ready pharmacy ecosystem with realistic data across customer, pharmacy, driver, and admin portals.

## 1. Seed data layer (`src/lib/demo-data.ts`)
A single deterministic data module (no backend) the whole UI reads from:

- **Products (120+)** across categories: Medicines (Panado, Disprin, Amoxil, Augmentin, Voltaren, Myprodol, Allergex, Sinutab, Betadine, Calpol, …), Equipment (BP monitor, glucometer, thermometer, nebuliser, wheelchair, walking frame, oxygen concentrator), Baby Care, Vitamins, Personal Care. Each: id, sku, name, brand, category, price, stock, status, description, imageKey.
- **Customers (50)** — names, phone, email, address, order history refs, reviews, favourites.
- **Pharmacists (5)** + **Assistants (5)** — role, photo, schedule, rating, orders handled.
- **Drivers (10)** — photo, vehicle, rating, deliveries completed.
- **Orders (600+)** — mix of statuses (Pending, Awaiting Review, Approved, Packed, Driver Assigned, Out for Delivery, Delivered, Cancelled) with customer/pharmacist/driver/products/timestamps.
- **Prescriptions (100)** — statuses Pending/Approved/Rejected/Dispensed.
- **Reviews (200 each)** for drivers, pharmacists, overall delivery.
- **Admin KPIs** — sales (day/week/month/year), order counts, customer counts, on-time %, avg delivery time, top products.

Generated deterministically with a seeded RNG so numbers stay stable between renders/SSR.

## 2. Product imagery
Generate ~24 category/product images (medicine blister, syrup bottle, BP monitor, glucometer, thermometer, nebuliser, wheelchair, baby formula, nappies, vitamin C, toothpaste, sanitiser, mask, etc.) and map each product's `imageKey` to the right asset so name↔image always matches. Fall back per-category for products without a dedicated image.

## 3. Hero carousel refresh
Generate 5 new bright, high-contrast images featuring Black African pharmacists/customers/drivers:
1. Prescription Delivery Service
2. Fast Same-Day Delivery
3. Family Healthcare Solutions
4. Chronic Medication Management
5. Online Pharmacy Ordering

Reduce overlay opacity so the photography reads clearly while keeping blue/white branding and CTA legibility.

## 4. Portals & dashboards
New routes (all populated from the seed module, mobile-first):

- `/` — homepage (updated carousel, featured products with correct images, trust strip, top categories).
- `/account` — customer dashboard: orders, active deliveries, prescriptions, favourites, notifications, reviews.
- `/track` — live delivery example (driver name, status, distance, ETA) + recent deliveries list.
- `/cart` & `/product/$id` — keep, wired to the new product list.
- `/staff` — pharmacy staff dashboard: pending prescriptions, new orders, dispatch queue, inventory alerts, messages.
- `/driver` — driver dashboard: assigned deliveries, route summary, stats, monthly performance, ratings.
- `/admin` — executive dashboard: sales overview cards, orders breakdown, customers, delivery performance, top products, recent orders table.

A simple "Demo Portals" switcher in the header/footer links between the four portals so stakeholders can jump between views.

## 5. Responsive polish
Verify each new dashboard at mobile, tablet, desktop breakpoints (stack cards, scrollable tables, bottom-tab nav preserved on mobile).

## Technical notes
- Pure frontend — no backend/db changes. All data lives in `src/lib/demo-data.ts` and is imported by routes/components.
- Deterministic seeded generator (small mulberry32) keeps SSR and client output identical.
- Images go in `src/assets/` (hero-* and prod-*) and are imported as ES modules.
- Existing `useStore` cart/tracking logic is preserved; product list is replaced by the seed module.

## Out of scope (ask if needed)
- Real auth / multi-tenant role gating (portals are open demo routes).
- Persisting demo edits (cart still uses zustand in-memory).
- Real-time updates / websockets for the live tracker (uses simulated state).

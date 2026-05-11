# Achievement Tracker

A personal year-by-year achievement and gallery tracker built with Next.js, Prisma, and NeonDB.

---

## Implementation Plan

### Step 1 — Create the Next.js App

```bash
npx create-next-app@latest achievement-tracker --typescript --tailwind --eslint --app
cd achievement-tracker
```

---

### Step 2 — Clear `page.tsx` and Write Base Component

Open `app/page.tsx`, delete all boilerplate, and write a basic functional component (rafce):

```tsx
import React from 'react'

const Page = () => {
  return (
    <div>page</div>
  )
}

export default Page
```

---

### Step 3 — Install Prisma

```bash
npm install prisma @prisma/client
npx prisma init
```

This creates a `prisma/` folder with `schema.prisma` and adds `DATABASE_URL` to `.env`.

---

### Step 4 — Define Prisma Models

In `prisma/schema.prisma`, create three models:

```prisma
model Year {
  id           Int           @id @default(autoincrement())
  year         Int           @unique
  about        String?
  achievements Achievement[]
  assets       Asset[]
  createdAt    DateTime      @default(now())
}

model Achievement {
  id        Int      @id @default(autoincrement())
  title     String
  category  String
  date      DateTime
  yearId    Int
  year      Year     @relation(fields: [yearId], references: [id])
  createdAt DateTime @default(now())
}

model Asset {
  id        Int      @id @default(autoincrement())
  url       String
  caption   String?
  month     Int
  yearId    Int
  year      Year     @relation(fields: [yearId], references: [id])
  createdAt DateTime @default(now())
}
```

---

### Step 5 — Get Database URL from NeonDB

1. Go to [neon.tech](https://neon.tech) and create a free project.
2. Copy the connection string (it looks like `postgresql://user:pass@host/dbname?sslmode=require`).
3. Paste it into `.env` as `DATABASE_URL`.

---

### Step 6 — Generate Client and Run Migration

```bash
npx prisma generate
npx prisma migrate dev --name init
```

Optionally seed with dummy data:

```bash
npx prisma db seed
```

---

### Step 7 — Create the `comp` Folder

```
app/
  comp/
    Header.tsx
    WorkflowCircle.tsx
    YearDetail.tsx
    Gallery.tsx
    Achievements.tsx
    AboutYear.tsx
```

Create the folder at `app/comp/`.

---

### Step 8 — Header Component

Create `app/comp/Header.tsx` — a top navigation bar with the app name/logo.

Import and add it to `app/page.tsx`:

```tsx
import Header from './comp/Header'

const Page = () => {
  return (
    <>
      <Header />
      {/* rest of page */}
    </>
  )
}
```

---

### Step 9 — Workflow Circle (Year Selector)

Create `app/comp/WorkflowCircle.tsx`.

- Fetches all `Year` records from the database.
- Renders a horizontal row of year circles connected by a spine line.
- Clicking a circle sets the selected year (via state or URL param).
- The selected year circle is visually highlighted.

Add `<WorkflowCircle />` to `app/page.tsx` below the header.

---

### Step 10 — Year Detail Tabs Component

Create `app/comp/YearDetail.tsx`.

- Receives the selected year as a prop.
- Renders **three tabs**: Gallery, Achievements, About.
- Each tab lazily loads its data.

Add `<YearDetail selectedYear={selectedYear} />` to `app/page.tsx`.

---

### Step 11 — Gallery Component

Create `app/comp/Gallery.tsx`.

- Receives `yearId` as a prop.
- Fetches all `Asset` records for that year.
- Displays images in a responsive grid.
- Shows a bar chart (Recharts) of assets grouped by month.

Used inside the **Gallery tab** of `YearDetail`.

---

### Step 12 — Achievements Component

Create `app/comp/Achievements.tsx`.

- Receives `yearId` as a prop.
- Fetches all `Achievement` records for that year.
- Renders a vertical timeline — each row has a colored category dot, title, and date.

Used inside the **Achievements tab** of `YearDetail`.

---

### Step 13 — About Year Component

Create `app/comp/AboutYear.tsx`.

- Receives `yearId` as a prop.
- Fetches the `about` text for that year.
- Displays a short bio/summary of the year.

Used inside the **About tab** of `YearDetail`.

---

## Project Structure (Final)

```
app/
  comp/
    Header.tsx
    WorkflowCircle.tsx
    YearDetail.tsx
    Gallery.tsx
    Achievements.tsx
    AboutYear.tsx
  page.tsx
  layout.tsx
prisma/
  schema.prisma
  seed.ts
.env
```

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| Next.js (App Router) | Framework |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Prisma | ORM |
| NeonDB (PostgreSQL) | Database |
| Recharts | Charts in Gallery |
| shadcn/ui | UI components (Tabs, etc.) |

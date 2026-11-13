# Rally — tennis academy manager (concept)

A management dashboard for **Albufera Tennis Academy**, a fictional tennis school in Valencia.
Designed and coded by **Kisrak Kulacoglu**.

**Live demo:** https://kisrakk.github.io/Rally/

## What it does
- **Sign in:** a demo staff sign-in screen with form checks, a bouncing tennis ball and a forgot-password flow (no real accounts)
  - Demo login: `marta@albuferatennis.es` / `demo-court-2026` (filled in automatically)
- **Dashboard:** welcome banner, key figures, monthly revenue chart, today's lessons, overdue payments, students by level
- **Students:** search, filter and sort; add, edit, pause or delete students with form validation; profile with lessons, attendance and payment history
- **Schedule:** weekly calendar; add and edit lessons with automatic clash detection (same court or same coach)
- **Attendance:** mark each student present or absent per session, with recent history
- **Payments:** monthly invoices, paid / pending / overdue status, record payments, create the month's invoices
- **Staff:** coach workload, students and attendance
- **English / Spanish switch** on every screen, including dates, money formats, form errors and messages
- Light and dark theme, responsive layout with a mobile menu

## Project structure
```
Rally/
├── index.html      page structure (sidebar, sign-in screen, layout)
├── css/style.css   design: colours, layout, light/dark theme, responsive rules
├── js/app.js       all features: data, views, forms, schedule, payments, EN/ES
└── img/            photos
```

## How it works
Built with HTML, CSS and vanilla JavaScript, no frameworks. All data is saved in the browser with
`localStorage`, so changes stay after a refresh. "Reset demo data" restores the sample data.
In a real product, the same functions would talk to an API and a database, sign-in would be
handled by a server, and card payments would go through a provider such as Stripe.

The academy, people and figures are fictional. Photos are placeholders for demo purposes.

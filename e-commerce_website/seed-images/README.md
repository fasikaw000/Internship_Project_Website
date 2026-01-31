# Seed images for logo and products

**Option A – Copy from Cursor assets (if your images are there)**  
From the **backend** folder, run (use your actual assets path):

```bash
node scripts/copy-assets-to-seed.js "C:\Users\Fasikaw\.cursor\projects\c-Users-Fasikaw-Internship-Project-Website\assets"
```

The assets folder must contain exactly 10 images; they are assigned in **alphabetical filename order**: 1st = logo, 2nd–4th = electronics, 5th–7th = fashion, 8th–10th = books. Rename files (e.g. `01-logo.png`, `02-electronics-1.png`, …) if you need a specific order.

**Option B – Manual**  
Place your 10 images in this folder with **exactly** these filenames:

| Filename        | Use                    | Your image (description)                    |
|-----------------|------------------------|----------------------------------------------|
| `logo.png`      | Site logo (navbar)     | Shopping bag icon (dark blue outline)        |
| `electronics-1.png` | Electronics product | Navy blue over-ear headphones (1MORE)         |
| `electronics-2.png` | Electronics product | iPhone 13 rose gold                           |
| `electronics-3.png` | Electronics product | Silver MacBook / laptop                       |
| `fashion-1.png`     | Fashion product   | Brown shearling-collar jacket (Miu Miu)       |
| `fashion-2.png`     | Fashion product   | Light blue men's dress shirt                 |
| `fashion-3.png`     | Fashion product   | Pink & white platform sneakers               |
| `books-1.png`      | Books product     | "really good, actually" by Monica Heisey        |
| `books-2.png`       | Books product     | "The Power of Your Dreams" by Stephanie Ike Okafor |
| `books-3.png`       | Books product     | "The Book of Hope"                           |

Then from the **backend** folder run:

```bash
npm run seed
```

This will:
1. Copy `logo.png` to the frontend public folder (navbar).
2. Copy `home-bg.png` to the frontend public folder (home page background), if present.
3. Copy the 9 product images to the backend uploads folder.
4. Add 9 products to the database (3 electronics, 3 fashion, 3 books).

Make sure your backend `.env` has `MONGO_URI` set so the database connection works.

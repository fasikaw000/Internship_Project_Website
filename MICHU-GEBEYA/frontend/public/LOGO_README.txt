Logo: logo.png
- The navbar uses mix-blend-mode so a white background in the logo blends with the bar (looks transparent).
- To copy a logo from assets, from the backend folder run:
  node scripts/copy-logo.js "C:\...\assets"
  Optional: add "click-collect" | "person-basket" | "yellow-bag" to choose which logo.
- Which is transparent? The YELLOW 3D shopping bag (yellow-bag) has a transparent PNG. Click & Collect and person-with-basket have white backgrounds; the site makes white blend so they look fine on the navbar. For a truly transparent file, use yellow-bag or edit the image (e.g. remove.bg) and save as PNG, then replace this file.

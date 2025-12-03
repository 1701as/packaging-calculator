# Open Packaging Weight Calculator 📦
### The Open Source CSRD & EPR Compliance Tool

![License: MIT](https://img.shields.io/badge/License-MIT-green.svg) ![Python](https://img.shields.io/badge/Python-3.x-blue.svg) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4.svg)

## The Why: Fixing the E-Commerce Data Nightmare

If you run a Shopify store or manage logistics, you know the panic. New EU regulations like **CSRD**, **LUCID (Germany)**, and **CITEO (France)** demand precise weight data for every gram of packaging you ship into their countries.

**The problem?** Most generic supplier invoices just say "100x Corrugated Boxes." They don't list the specific gram weight or material codes required by law.

**The result?** Merchants are either guessing (risking audits) or overpaying for "Enterprise Sustainability Platforms" just to access basic physics data.

**The Solution:** This project is a free, open-source calculator that estimates packaging weights using industry-standard surface area and GSM (Grams per Square Meter) physics. It provides the "missing link" data—Weight (g), Material Code (e.g., PAP 20), and Recycled Content estimates—instantly and for free.

---

## Features

*   **⚡️ Instant Calculation:** Get accurate weight estimates based on dimensions (L x W x H) and material type (Single/Double Wall, Poly, Kraft).
*   **📝 Compliance Ready:** Auto-generates the specific Material Codes (PAP 20, PAP 21, LDPE 4) required for EU reporting.
*   **🌍 Standard Library:** Pre-loaded with common shipping sizes from **FedEx, USPS, and Amazon**.
*   **🔍 Programmatic SEO:** Includes a Python build script to generate hundreds of specific landing pages (e.g., "FedEx Medium Box Weight") to help lost merchants find answers via Google.
*   **💸 100% Free:** MIT Licensed. No gatekeeping. No SaaS subscriptions.

---

## Quick Start (For Developers)

This project generates a static site (HTML/JS) using Python and Jinja2. It is designed to be hosted on any static host like Netlify, Vercel, or Cloudflare Pages.

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/open-packaging-weight-calculator.git
cd open-packaging-weight-calculator
```

### 2. Install Dependencies
We only need `jinja2` for the templating engine.
```bash
pip install jinja2
```

### 3. Build the Site
We use a two-step build process:

**Step A: Generate the specific landing pages**
This reads the data in `generate.py` and creates individual HTML files in the `pages/` directory.
```bash
python generate.py
```

**Step B: Build the Search Directory (Index)**
This scans the `pages/` directory and builds the main `index.html` with the JS search grid.
```bash
python build_index.py
```

### 4. Deploy
You can simply drag the `index.html` and `pages/` folder to your host, or run the helper script to create a clean `public/` folder:
```bash
python prepare_deploy.py
```

---

## How to Contribute 🤝

This is a community-driven project. We believe access to compliance data should be free.

**We need your help to expand the "Standard Industry Sizes" library.**

Do you use a specific carrier box (DHL, DPD, UPS) or a popular supplier size (Uline)?

1.  Open `generate.py`.
2.  Find the `data_sources` list.
3.  Add your box details following this format:
    ```python
    {"name": "DHL Box 2", "l": 12, "w": 10, "h": 6, "type": "box", "wall": "single"},
    ```
4.  Submit a **Pull Request**!

*Note: Please ensure dimensions are accurate. If you have physical samples, weighing them to verify our GSM assumptions is highly appreciated!*

---

## Roadmap 🗺️

*   [ ] **Add DHL & DPD Standard Sizes:** Expand coverage for European merchants.
*   [ ] **Biodegradability Estimator:** Add logic to estimate decomposition times based on material type.
*   [ ] **Bulk Export:** Allow users to download the entire database as a CSV.
*   [ ] **API:** (Long term) A simple JSON endpoint for other tools to consume.

---

## License

This project is open-sourced under the **MIT License**. You are free to use, modify, and distribute this software as you wish.

**Built for the Open Web.**

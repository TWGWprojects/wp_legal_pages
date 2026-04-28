# WP Legal Pages – Centralized Legal Content API & SDK

This repository provides a **centralized, reusable source of legal content**
(e.g. Privacy Policy, Terms of Service, etc..) that can be
consumed dynamically by websites.

The goal is to update legal text **once** and have the changes reflected across
multiple sites automatically.

---

## How It Works

This repository consists of two parts:

### 1. Public JSON API
Legal content is hosted as structured JSON files via GitHub Pages.

Example endpoints:

https://twgwprojects.github.io/wp_legal_pages/api/privacy-policy.json  
https://twgwprojects.github.io/wp_legal_pages/api/terms-of-service.json

Each JSON file includes:
- `title`
- `lastUpdated`
- structured `content` blocks (headings, paragraphs, lists, tables)

---

### 2. JavaScript Loader (SDK)

A reusable JavaScript file fetches the JSON and renders the legal page content on
any website (WordPress, WooCommerce, or static sites). That will need to added to themes js folder.
*SITENAME* is universal for emails (info@sitename.com)

Legal pages slugs: 
- privacy-policy
- terms-of-service
- terms-of-service
- california-privacy-notice

To use it, include the following HTML markup on your page:

```html

<body data-legal-site="SITENAME" data-legal-emaildomain="EMAILDOMAIN">
  <div id="legal-page" data-slug="legal-slug">
    <p id="legal-last-updated"></p>
    <h1 id="legal-title"></h1>
    <div id="legal-content"></div>
  </div>
</body>


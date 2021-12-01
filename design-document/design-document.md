# Frontend Challenge: Design Doc

This is a design document for the [frontend challenge](https://github.com/gravitational/careers/blob/main/challenges/frontend/challenge.md), a part of the interview process for a frontend position (Level 5) at Teleport, by [Tadeáš Peták](https://github.com/tadeaspetak).

It concerns the interview team and anyone else connected to the interview process. If you belong to neither group and still feel like reading on, it's nothing but joy to have you.

 1. [Context](#context)
 1. [Scope](#scope-goals--no-gos)
 1. [Wireframes](#wireframes)
 1. [Implementation Details](#implementation-details)
 1. [Timeline](#timeline)

# Context

Let's implement a web app which enables users to browse directory content on a server. The key elements of the application are:

 - a file & directory browser with search and sorting (client-side)
 - authentication; the file tree is only accessible after signing in
 - API endpoints necessary for authentication purposes and for browsing a directory

# Scope: Goals & No-gos

This simple `app` shall empower users to:

 - sign in when not authenticated
 - view & browse folders
 - view metadata of a file (no preview)
 - sort and filter on all available attributes (`name`, `size`, and `type`)
 - bookmark URLs for quick navigation

On the backend, this entails a simple `server` which:
 
 - serves web assets
 - manages user sessions

Finally, a few constraints and allowed/encouraged shortucts:

 - containerize the app (Docker)
 - use native browser API for networking
 - use native/standard libraries
 - store uwers & sessions in memory, no need for a db
 - feel free to hardcode usernames, hashes, or directory paths
 - make it secure (strong TLS, no web security vulnerabilities)

# Wireframes

_Note: Honestly, these are more colourful and specific than wireframes need to be — or maybe even should be — but it was fast & easy with [Whimsical](https://whimsical.com)._

<img src="assets/signin.png" style="max-width: 600px" alt="Sign In" />
<img src="assets/browse.png" style="max-width: 600px;" alt="Browse a Folder" /> 

# Implementation Details

The entire codebase shall use typescript, reasonable linting, and be dockerized.

In a real app, performance monitoring and error reporting would be done through Sentry, but for the purposes of the challenge, `console.error` in the browser and logging to a file will suffice.

There will be a few tests for the key React components (the browser view) and for the key API endpoints, but coverage shouldn't become an obsession.

## Frontend

We will use React (`create-react-app` for the simplicity of its setup), React Router, and Tailwind on the frontend. Core considerations:

 - **Authentication:** All protected routes are wrapped in a simple component `<Protected />` which checks whether the user is authenticated. When they're not, the user is taken to the `/sign-in` page, and the original URL is stored in the `state` property on the `location` object of our router. That way, we can redirect them back to where they intended to go once they've signed in.
 - **URL as the source of truth:** The location in the file tree is stored as URL params, the sorting and filtering criteria as query params (`/browse/my-folder/my-child-folder?sort=name-up&search=holid`)
 - **Security:** Sanitize input and output, i.e. URL params, query params, and the search input.

## Backend

The server will be written as a simple `express` app. For simplicity, we'll skip a database and store everything in memory instead.

Since searching and filtering is required on the client only, the **API** consists of just a few endpoints:
 - `GET /contents/{path}` to obtain the contents of a directory
 - `POST /sign-in` to sign the user in
 - `POST /sign-out` to sign the user out (`POST` to avoid [prefetching it](https://twitter.com/nick_craver/status/296281730984316928?lang=fa) 🤦) 

## Security

_Note: Whenever generating random, secure tokens, let's use [crypto.randomBytes()](https://nodejs.org/api/crypto.html#cryptorandombytessize-callback)._

Security is, naturally, a huge consideration.

### TLS

To start with, let's use a self-signed certificate to enable development in a `TLS` environment even on localhost. (Unfortunately, this implies you will need to import the certificate as trusted or "Accept the risk" in your browser. Thanks for your understanding 🙏)

### Session Management

To avoid dependencies on external libs, we'll build a simple **session management** ourselves. On signing in, we generate a random `sessionId` for the user. This is used as the `key` in the `sessions` key-value store, and also set as a cookie sent back to the client (more on security considerations in the sections below).

### Directory Traversing

Since we're browsing real directories, we also need to make sure the user is not allowed outside their root directory. Starting with [path.normalize()](https://nodejs.org/api/path.html#pathnormalizepath), then remove any remaining `./` and `../` at the beginning of the path should suffice. This will make it impossible to traverse outside the root directory.

### Cross-Site-Scripting (XSS)

As we're not storing user content and we are skipping file previews, Stored XSS is not an issue in our case. Sanitizing user input and output (effectively only the URL) should take care of Reflected and DOM-Based XSS. Since we won't be relying on any external resources, let's also write a strict Content Security Policy (CSP).

Should a vector attack exist anyway, we can mitigate this by storing the `sessionId` as an `httpOnly` cookie, making it unavailable to the client and, therefore, immune to being snatched by a third party.

### Cross-Site-Request-Forgery (CSRF)

Since CSRF exploits are applicable only with state-changing requests, we have a single candidate to protect, namely the `POST /sign-in` endpoint. To prevent login CSRF, let's:

 - Disable `CORS`; in our case, this is the default behaviour.
 - Check the `Content-Type` header is set to `application/json` to prevent e.g. 3rd party forms from being submitted to our endpoint.
 - Set the `sameSite` attribute of our `sessionId` cookie to `lax` to prevent it from being sent on cross-site requests (with the exception of the "safe" `GET` and `HEAD` which should never be modifying state).

 The above 👆 should actually suffice, but we might as well implement token-based mitigation for good measure and practice:

  - When generating our `sessionId`, let's also generate a `csrfId`, save it as an attribute on the session, and set as a `sameSite` (but not `httpOnly`) cookie.
  - When submitting the login form, we check the `csrfId` is included in the request header and matches the one stored with the `sessionId`
  - On the frontend, we need to set the `Content-Type` appropriately, and include the `csrfId` cookie value in the headers.

### Security in the Real World

In my estimation, these precautions should make our app pretty safe. In a real-world scenario, we would, naturally, need to consider the following and much more:

 - The app would be deployed, which would give us heaps of room for misconfiguration.
 - There would a database, i.e. plenty of potential for SQL injections.
 - We would probably be forced to use the `strict-dynamic` CSP since we would start loading external assets.
 - If we added the possibilty for file uploading, the `X-Content-Type-Options: nosniff` header should be set to prevent browser from MIME sniffing.

<a name="timeline"></a>
# 5. Timeline

Ideally, this design document is approved within a few days, and my PRs can start coming in. I will do my best to have submitted the last PR by Wednesday, Dec 8.
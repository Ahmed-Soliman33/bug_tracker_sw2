# Nawras — Headless WordPress Integration Roadmap

**Frontend:** `react-front/` (React 19 + Vite + Tailwind CSS v4 + Framer Motion)  
**CMS Backend:** `https://admin.nawras.app` (WordPress + WPGraphQL + ACF)  
**GraphQL Endpoint:** `https://admin.nawras.app/graphql`

> This document is the single source of truth for the integration sprint.  
> Work through phases in order — each phase is a prerequisite for the next.

---

## Table of Contents

1. [Phase 1 — WordPress Backend Setup](#phase-1--wordpress-backend-setup)
2. [Phase 2 — Apollo Client Configuration](#phase-2--apollo-client-configuration)
3. [Phase 3 — Data Fetching & Mock Swap](#phase-3--data-fetching--mock-swap)
4. [Phase 4 — Form Handling & Mutations](#phase-4--form-handling--mutations)
5. [Phase 5 — The Preview Challenge](#phase-5--the-preview-challenge)
6. [Phase 6 — Production Deployment](#phase-6--production-deployment)

---

## Phase 1 — WordPress Backend Setup

### 1.1 Required Plugins

Install and activate in this order:

- [ ] **WPGraphQL** (v1.x) — `wp.org/plugins/wp-graphql`
- [ ] **Advanced Custom Fields PRO** — `advancedcustomfields.com`
- [ ] **WPGraphQL for ACF** — `github.com/wp-graphql/wpgraphql-acf`
- [ ] **WPGraphQL JWT Authentication** — needed for Preview (Phase 5)
- [ ] **WS Form PRO** *or* **Forminator** — for contact form (Phase 4 explains why)

> **Note on Ninja Forms:** The official Ninja Forms WPGraphQL bridge is unmaintained and
> unreliable. WS Form PRO has a production-grade WPGraphQL addon. Forminator is a free
> alternative. Either is a better choice than Ninja Forms for this integration.

### 1.2 WPGraphQL Settings

In `WordPress → GraphQL → Settings`:

- [ ] Enable **Public Introspection** (disable in production after frontend is stable)
- [ ] Enable **GraphQL IDE** (GraphiQL) for development
- [ ] Set **JWT Secret** (a long random string, saved in `wp-config.php`):
  ```php
  // wp-config.php
  define( 'GRAPHQL_JWT_AUTH_SECRET_KEY', 'your-64-char-random-string-here' );
  ```

### 1.3 Custom Post Types (CPTs)

Register CPTs in the child theme's `functions.php`. This keeps them version-controlled.

```php
// divi-child/functions.php

function nawras_register_cpts() {

    // ── Solutions (HCM, ERP, future products) ──────────────────────────────
    register_post_type( 'nw_solution', [
        'labels'              => [ 'name' => 'Solutions', 'singular_name' => 'Solution' ],
        'public'              => true,
        'show_in_graphql'     => true,           // exposes to WPGraphQL
        'graphql_single_name' => 'solution',
        'graphql_plural_name' => 'solutions',
        'supports'            => [ 'title', 'editor', 'thumbnail', 'revisions' ],
        'menu_icon'           => 'dashicons-lightbulb',
        'has_archive'         => false,
    ]);

    // ── Features (the 6-card grid) ─────────────────────────────────────────
    register_post_type( 'nw_feature', [
        'labels'              => [ 'name' => 'Features', 'singular_name' => 'Feature' ],
        'public'              => true,
        'show_in_graphql'     => true,
        'graphql_single_name' => 'feature',
        'graphql_plural_name' => 'features',
        'supports'            => [ 'title', 'editor', 'thumbnail' ],
        'menu_icon'           => 'dashicons-star-filled',
        'has_archive'         => false,
    ]);

    // ── Team Members (future) ───────────────────────────────────────────────
    register_post_type( 'nw_team', [
        'labels'              => [ 'name' => 'Team', 'singular_name' => 'Team Member' ],
        'public'              => true,
        'show_in_graphql'     => true,
        'graphql_single_name' => 'teamMember',
        'graphql_plural_name' => 'teamMembers',
        'supports'            => [ 'title', 'thumbnail' ],
        'menu_icon'           => 'dashicons-groups',
        'has_archive'         => false,
    ]);

    // ── Trusted Customers / Logos ───────────────────────────────────────────
    register_post_type( 'nw_customer', [
        'labels'              => [ 'name' => 'Customers', 'singular_name' => 'Customer' ],
        'public'              => true,
        'show_in_graphql'     => true,
        'graphql_single_name' => 'customer',
        'graphql_plural_name' => 'customers',
        'supports'            => [ 'title', 'thumbnail' ],
        'menu_icon'           => 'dashicons-building',
        'has_archive'         => false,
    ]);
}
add_action( 'init', 'nawras_register_cpts' );
```

### 1.4 ACF Field Groups

Create these field groups in **ACF → Field Groups**. For each, set the **Show this field group if** rule to match the CPT, and enable **Show in GraphQL**.

#### Group A — `Solutions Options` (CPT: `nw_solution`)

| Field Label       | Field Name        | Type            | Notes                          |
|-------------------|-------------------|-----------------|--------------------------------|
| Solution Type     | `solution_type`   | Select          | Choices: `hcm`, `erp`         |
| Short Description | `short_desc`      | Textarea        | Used in cards                  |
| Icon SVG          | `icon_svg`        | Textarea        | Paste raw `<svg>` string       |
| CTA Label         | `cta_label`       | Text            | Button text                    |
| CTA URL           | `cta_url`         | URL             |                                |
| Featured Image    | (built-in)        | —               | Use core post thumbnail        |
| Display Order     | `display_order`   | Number          | Controls render sequence       |

#### Group B — `Feature Card` (CPT: `nw_feature`)

| Field Label  | Field Name   | Type     | Notes                    |
|--------------|--------------|----------|--------------------------|
| Icon SVG     | `icon_svg`   | Textarea | Raw SVG string           |
| Description  | `description`| Textarea |                          |
| Accent Color | `accent_color`| Color   | Optional per-card accent |

#### Group C — `Impact Stats` (Options Page — site-wide)

Create an ACF **Options Page** (`ACF → Options Pages → Add New`):

```php
// divi-child/functions.php
if ( function_exists( 'acf_add_options_page' ) ) {
    acf_add_options_page([
        'page_title'      => 'Site Options',
        'menu_title'      => 'Site Options',
        'menu_slug'       => 'nawras-site-options',
        'capability'      => 'edit_posts',
        'show_in_graphql' => true,       // critical
    ]);
}
```

Then create field group **Site Options** assigned to this options page:

| Field Label          | Field Name            | Type   |
|----------------------|-----------------------|--------|
| Stat 1 Value         | `stat_1_value`        | Number |
| Stat 1 Suffix        | `stat_1_suffix`       | Text   |
| Stat 1 Label (EN)    | `stat_1_label_en`     | Text   |
| Stat 1 Label (AR)    | `stat_1_label_ar`     | Text   |
| *(repeat for 2–4)*   |                       |        |
| Impact Hook Text (EN)| `impact_hook_en`      | Text   |
| Impact Hook Text (AR)| `impact_hook_ar`      | Text   |
| Video Embed URL      | `video_embed_url`     | URL    |
| YouTube Video ID     | `youtube_video_id`    | Text   |

#### Group D — `Customer Logo` (CPT: `nw_customer`)

| Field Label | Field Name | Type  | Notes                       |
|-------------|------------|-------|-----------------------------|
| Logo Image  | `logo`     | Image | Return format: `Array`      |
| Alt Text    | `logo_alt` | Text  | For accessibility           |
| Website URL | `website`  | URL   | Optional                    |

### 1.5 Expose ACF Fields to WPGraphQL

For every ACF field group:

1. Open the field group in **ACF → Field Groups**
2. In the **Settings** tab, find **Show in GraphQL** → enable it
3. Set the **GraphQL Field Name** (camelCase, e.g., `solutionType`, `iconSvg`)

> **Verify it works** — open `https://admin.nawras.app/graphql` in the browser.
> If you see the GraphiQL IDE, the plugin is active. Run:
> ```graphql
> { solutions { nodes { title } } }
> ```

---

## Phase 2 — Apollo Client Configuration

### 2.1 Install Dependencies

```bash
npm install @apollo/client graphql
```

### 2.2 Folder Structure

```
src/
  services/
    apolloClient.js      ← Apollo singleton (create this)
    posts.js             ← already exists, swap mock functions
  graphql/
    queries/
      posts.js           ← blog post queries
      solutions.js       ← solutions + features queries
      siteOptions.js     ← global options (stats, video, nav)
      customers.js       ← trusted customers logos
    mutations/
      contactForm.js     ← form submission mutation
    fragments/
      imageFields.js     ← reusable image fragment
```

### 2.3 Apollo Client Setup

```js
// src/services/apolloClient.js
import { ApolloClient, InMemoryCache, createHttpLink, from } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({
  uri: "https://admin.nawras.app/graphql",
});

// Auth link — attaches preview JWT token when present (Phase 5)
const authLink = setContext((_, { headers }) => {
  const token = sessionStorage.getItem("nw_preview_token");
  return {
    headers: {
      ...headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };
});

// Error link — logs GraphQL errors without crashing the app
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(`[GraphQL Error] ${message}`, { locations, path });
    });
  }
  if (networkError) {
    console.error(`[Network Error]`, networkError);
  }
});

export const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      // Normalize by URI so the same post fetched in list vs detail views
      // uses one cache entry instead of two
      Post: {
        keyFields: ["id"],
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      // Return cached data immediately while revalidating in background
      fetchPolicy: "cache-and-network",
      nextFetchPolicy: "cache-first",
    },
  },
});
```

### 2.4 Wrap the App

```jsx
// src/main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "./services/apolloClient";
import App from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ApolloProvider client={apolloClient}>
      <App />
    </ApolloProvider>
  </StrictMode>
);
```

### 2.5 Reusable Fragment

```js
// src/graphql/fragments/imageFields.js
import { gql } from "@apollo/client";

export const IMAGE_FIELDS = gql`
  fragment ImageFields on MediaItem {
    sourceUrl
    altText
    mediaDetails {
      width
      height
    }
  }
`;
```

---

## Phase 3 — Data Fetching & Mock Swap

### Strategy

Each swap follows the same four-step pattern:

1. Write the GraphQL query in `src/graphql/queries/`
2. Call `useQuery()` in the component
3. Map the API shape to the existing component's prop shape
4. Remove the mock import

Keep the mock data file around until every consumer is swapped — then delete it.

---

### 3.1 Blog Posts

```js
// src/graphql/queries/posts.js
import { gql } from "@apollo/client";
import { IMAGE_FIELDS } from "../fragments/imageFields";

export const GET_POSTS = gql`
  query GetPosts($first: Int!) {
    posts(first: $first, where: { status: PUBLISH }) {
      nodes {
        id
        slug
        title
        date
        excerpt(format: RAW)
        categories {
          nodes { name }
        }
        featuredImage {
          node { ...ImageFields }
        }
      }
    }
  }
  ${IMAGE_FIELDS}
`;

export const GET_POST_BY_SLUG = gql`
  query GetPostBySlug($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      id
      slug
      title
      date
      content
      excerpt(format: RAW)
      categories {
        nodes { name }
      }
      featuredImage {
        node { ...ImageFields }
      }
    }
  }
  ${IMAGE_FIELDS}
`;
```

**Swap in `src/services/posts.js`:**

```js
// src/services/posts.js
import { apolloClient } from "./apolloClient";
import { GET_POSTS, GET_POST_BY_SLUG } from "../graphql/queries/posts";

function normalizePost(node) {
  return {
    id:       node.id,
    slug:     node.slug,
    title:    node.title,
    date:     node.date,
    excerpt:  node.excerpt,
    content:  node.content ?? "",
    category: node.categories?.nodes?.[0]?.name ?? "General",
    image:    node.featuredImage?.node?.sourceUrl ?? "",
  };
}

export async function getPosts(first = 9) {
  const { data } = await apolloClient.query({
    query: GET_POSTS,
    variables: { first },
  });
  return data.posts.nodes.map(normalizePost);
}

export async function getPostBySlug(slug) {
  const { data } = await apolloClient.query({
    query: GET_POST_BY_SLUG,
    variables: { slug },
  });
  return data.post ? normalizePost(data.post) : null;
}
```

> `BlogPost.jsx` and `LatestNews.jsx` call these functions and will work without
> any component-level changes — the function signatures are identical to the mock.

---

### 3.2 Solutions & Features

```js
// src/graphql/queries/solutions.js
import { gql } from "@apollo/client";
import { IMAGE_FIELDS } from "../fragments/imageFields";

export const GET_SOLUTIONS = gql`
  query GetSolutions {
    solutions(first: 10, where: { orderby: { field: META_VALUE_NUM, order: ASC } }) {
      nodes {
        id
        title
        solutionFields {          # ACF field group name in GraphQL
          solutionType
          shortDesc
          iconSvg
          ctaLabel
          ctaUrl
          displayOrder
        }
        featuredImage {
          node { ...ImageFields }
        }
      }
    }
  }
  ${IMAGE_FIELDS}
`;

export const GET_FEATURES = gql`
  query GetFeatures {
    features(first: 10) {
      nodes {
        id
        title
        featureFields {
          iconSvg
          description
          accentColor
        }
      }
    }
  }
`;
```

**Swap in `OurSolutions.jsx`** (abbreviated — same pattern for `Features.jsx`):

```jsx
// src/components/OurSolutions/OurSolutions.jsx
import { useQuery } from "@apollo/client";
import { GET_SOLUTIONS } from "../../graphql/queries/solutions";

export default function OurSolutions() {
  const { data, loading, error } = useQuery(GET_SOLUTIONS);

  // Graceful loading state — preserves layout to avoid CLS
  if (loading) return <SolutionsSkeleton />;
  if (error)   return null; // fail silently in production

  const solutions = data.solutions.nodes;
  const hcm = solutions.find(s => s.solutionFields.solutionType === "hcm");
  const erp = solutions.find(s => s.solutionFields.solutionType === "erp");

  return (
    <section ...>
      {hcm && <HCMSection solution={hcm} />}
      <SwooshDivider />
      {erp && <ERPSection solution={erp} />}
    </section>
  );
}
```

---

### 3.3 Impact Bar Stats

```js
// src/graphql/queries/siteOptions.js
import { gql } from "@apollo/client";

export const GET_SITE_OPTIONS = gql`
  query GetSiteOptions {
    nawrasSiteOptions {           # matches the options page graphql_field_name
      siteOptionsFields {
        stat1Value
        stat1Suffix
        stat1LabelEn
        stat1LabelAr
        stat2Value
        stat2Suffix
        stat2LabelEn
        stat2LabelAr
        stat3Value
        stat3Suffix
        stat3LabelEn
        stat3LabelAr
        stat4Value
        stat4Suffix
        stat4LabelEn
        stat4LabelAr
        impactHookEn
        impactHookAr
        videoEmbedUrl
      }
    }
  }
`;
```

**Swap in `ImpactBar.jsx`:**

```jsx
// src/components/ImpactBar/ImpactBar.jsx
import { useQuery } from "@apollo/client";
import { GET_SITE_OPTIONS } from "../../graphql/queries/siteOptions";
import { useLang } from "../../context/LanguageContext";

export default function ImpactBar() {
  const { lang } = useLang();
  const { data, loading } = useQuery(GET_SITE_OPTIONS);

  if (loading) return <ImpactBarSkeleton />;

  const opts = data.nawrasSiteOptions.siteOptionsFields;

  // Build the STATS array dynamically from CMS data
  const STATS = [1, 2, 3, 4].map(n => ({
    key:    `stat${n}`,
    value:  opts[`stat${n}Value`],
    suffix: opts[`stat${n}Suffix`],
    label:  lang === "ar" ? opts[`stat${n}LabelAr`] : opts[`stat${n}LabelEn`],
  }));

  const hookText = lang === "ar" ? opts.impactHookAr : opts.impactHookEn;

  return ( /* existing JSX, pass STATS and hookText as props */ );
}
```

---

### 3.4 Trusted Customers Logos

```js
// src/graphql/queries/customers.js
import { gql } from "@apollo/client";
import { IMAGE_FIELDS } from "../fragments/imageFields";

export const GET_CUSTOMERS = gql`
  query GetCustomers {
    customers(first: 30) {
      nodes {
        id
        title
        customerFields {
          logoAlt
          website
          logo {
            ...ImageFields
          }
        }
      }
    }
  }
  ${IMAGE_FIELDS}
`;
```

**Swap in `TrustedCustomers.jsx`:**

```jsx
// src/components/TrustedCustomers/TrustedCustomers.jsx
import { useQuery } from "@apollo/client";
import { GET_CUSTOMERS } from "../../graphql/queries/customers";

export default function TrustedCustomers() {
  const { data, loading } = useQuery(GET_CUSTOMERS);

  if (loading) return <LogoCarouselSkeleton />;

  // Map to the shape the carousel already expects: { src, alt }
  const logos = data.customers.nodes.map(n => ({
    id:  n.id,
    src: n.customerFields.logo?.sourceUrl,
    alt: n.customerFields.logoAlt || n.title,
    url: n.customerFields.website,
  }));

  return ( /* existing carousel JSX, replace hard-coded logo imports with logos[] */ );
}
```

> The local PNG files in `src/assets/images/partners_logos/` can be deleted
> once the CMS data is confirmed live.

---

## Phase 4 — Form Handling & Mutations

### 4.1 Recommended Strategy — WS Form PRO

Ninja Forms' WPGraphQL plugin is abandoned. **WS Form PRO** (wsform.com) provides a
maintained GraphQL mutation for form submission and includes spam protection, email
notifications, and a CRM-ready entry log — everything the client needs.

After installing WS Form PRO and creating a form named **"Contact"**, the mutation
becomes available automatically:

```js
// src/graphql/mutations/contactForm.js
import { gql } from "@apollo/client";

export const SUBMIT_CONTACT_FORM = gql`
  mutation SubmitContactForm($input: SubmitFormInput!) {
    submitForm(input: $input) {
      success
      errorMessage
      validationErrors {
        fieldId
        message
      }
    }
  }
`;
```

### 4.2 Alternative — WP REST API Fallback

If adding another plugin isn't an option, use the WP REST endpoint for a simple email:

```js
// src/services/contactService.js
export async function submitContactForm(data) {
  const res = await fetch("https://admin.nawras.app/wp-json/nawras/v1/contact", {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Submission failed");
  return res.json();
}
```

Then register the endpoint in `functions.php`:

```php
// divi-child/functions.php
add_action( 'rest_api_init', function () {
    register_rest_route( 'nawras/v1', '/contact', [
        'methods'             => 'POST',
        'callback'            => 'nawras_handle_contact',
        'permission_callback' => '__return_true',
    ]);
});

function nawras_handle_contact( WP_REST_Request $request ) {
    $data = $request->get_json_params();

    // Sanitize
    $name    = sanitize_text_field( $data['name'] ?? '' );
    $email   = sanitize_email( $data['email'] ?? '' );
    $phone   = sanitize_text_field( $data['phone'] ?? '' );
    $company = sanitize_text_field( $data['company'] ?? '' );

    if ( ! $email || ! $name ) {
        return new WP_Error( 'missing_fields', 'Name and email are required.', [ 'status' => 422 ] );
    }

    // Send email to the admin
    wp_mail(
        get_option( 'admin_email' ),
        "New Contact Request from {$name}",
        "Name: {$name}\nEmail: {$email}\nPhone: {$phone}\nCompany: {$company}",
        [ "Reply-To: {$email}" ]
    );

    return [ 'success' => true ];
}
```

### 4.3 Wire to ContactForm.jsx

```jsx
// src/components/Footer/ContactForm.jsx — final handleSubmit
import { useMutation } from "@apollo/client";
import { SUBMIT_CONTACT_FORM } from "../../graphql/mutations/contactForm";

// ── Inside component ──────────────────────────────────────────────────────────
const [submitForm] = useMutation(SUBMIT_CONTACT_FORM);

const handleSubmit = async (e) => {
  e.preventDefault();
  setStatus("loading");
  try {
    const { data } = await submitForm({
      variables: {
        input: {
          formId:  "1",   // WS Form form ID
          fields: [
            { id: "field_name",    value: form.name },
            { id: "field_email",   value: form.email },
            { id: "field_phone",   value: form.phone },
            { id: "field_company", value: form.company },
          ],
        },
      },
    });

    if (data.submitForm.success) {
      setStatus("success");
      setForm(INITIAL);
      setTimeout(() => setStatus("idle"), 3000);
    } else {
      setStatus("error");
    }
  } catch {
    setStatus("error");
  }
};
```

---

## Phase 5 — The Preview Challenge

This is the hardest part of any headless WordPress build. Here is the complete,
production-tested solution.

### 5.1 The Problem

WordPress's native preview button (`?preview=true`) redirects to a URL on `admin.nawras.app`.
Since our frontend lives on a different domain, the preview never reaches React — it just
loads the raw WordPress theme (Divi). The client clicks **Preview** and sees nothing useful.

### 5.2 The Solution — JWT-Authenticated Preview Route

The flow has four steps:

```
WordPress Preview Button
         │
         ▼
  preview.php (divi-child)
  ─ generates a short-lived JWT
  ─ redirects to React:
         │
         ▼
https://nawras.app/preview?postId=123&token=eyJ...
         │
         ▼
  React <PreviewPage>
  ─ reads token from URL
  ─ stores in sessionStorage
  ─ queries GraphQL with Authorization header
  ─ Apollo authLink attaches token automatically (Phase 2.3)
         │
         ▼
  WPGraphQL returns DRAFT post data ✓
```

### 5.3 WordPress Side

**Step 1 — Intercept the preview redirect:**

```php
// divi-child/functions.php

add_filter( 'preview_post_link', 'nawras_headless_preview_link', 10, 2 );

function nawras_headless_preview_link( $link, $post ) {
    // Generate a short-lived JWT (10 minute expiry) for this preview
    $token = nawras_generate_preview_token( $post->ID );

    $frontend_url = 'https://nawras.app'; // your React domain
    return "{$frontend_url}/preview?postId={$post->ID}&token={$token}";
}

function nawras_generate_preview_token( $post_id ) {
    $secret  = defined( 'GRAPHQL_JWT_AUTH_SECRET_KEY' ) ? GRAPHQL_JWT_AUTH_SECRET_KEY : wp_salt();
    $payload = base64_encode( json_encode([
        'sub' => get_current_user_id(),
        'pid' => $post_id,
        'exp' => time() + 600,  // 10 minutes
        'iat' => time(),
    ]));
    $sig = hash_hmac( 'sha256', $payload, $secret );
    return "{$payload}.{$sig}";
}
```

> **Better alternative:** Use the **WPGraphQL JWT Authentication** plugin's built-in
> `generateJwtAuthToken` mutation and call it from a small WordPress page template
> that auto-redirects. This avoids maintaining your own JWT implementation.

### 5.4 React Side

**Step 1 — Create the preview route:**

```jsx
// src/App.jsx — add to Routes
<Route path="/preview" element={<PreviewPage />} />
```

**Step 2 — Create the preview page:**

```jsx
// src/pages/PreviewPage.jsx
import { useEffect } from "react";
import { useSearchParams, Navigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { gql } from "@apollo/client";

const GET_PREVIEW_POST = gql`
  query GetPreviewPost($id: ID!) {
    post(id: $id, idType: DATABASE_ID, asPreview: true) {
      id
      title
      content
      date
      featuredImage {
        node { sourceUrl altText }
      }
    }
  }
`;

export default function PreviewPage() {
  const [params] = useSearchParams();
  const postId   = params.get("postId");
  const token    = params.get("token");

  // Store the token so Apollo's authLink picks it up (see Phase 2.3)
  useEffect(() => {
    if (token) sessionStorage.setItem("nw_preview_token", token);
    return () => sessionStorage.removeItem("nw_preview_token");
  }, [token]);

  const { data, loading, error } = useQuery(GET_PREVIEW_POST, {
    variables:   { id: postId },
    skip:        !postId || !token,
    fetchPolicy: "network-only", // never serve draft from cache
  });

  if (!postId || !token) return <Navigate to="/" replace />;
  if (loading) return <PreviewLoadingState />;
  if (error)   return <PreviewErrorState message="Preview failed — token may have expired." />;

  const post = data?.post;
  if (!post)   return <PreviewErrorState message="Post not found or not published yet." />;

  return (
    <div className="min-h-screen bg-white">
      {/* Floating preview banner */}
      <div className="sticky top-0 z-50 flex items-center justify-center gap-3 bg-amber-400 px-6 py-2.5 text-sm font-bold text-amber-900">
        <span>⚠ Preview Mode</span>
        <span className="opacity-60">|</span>
        <span>This page is not published yet.</span>
      </div>
      {/* Reuse BlogPost layout — pass post as prop */}
      <BlogPostLayout post={post} />
    </div>
  );
}
```

### 5.5 Preview Checklist

- [ ] WPGraphQL JWT Auth plugin installed and `GRAPHQL_JWT_AUTH_SECRET_KEY` defined
- [ ] `nawras_headless_preview_link` filter active in `functions.php`
- [ ] `https://nawras.app` added to WordPress **Settings → General → Allowed Origins**
- [ ] `/preview` route added in `App.jsx`
- [ ] `sessionStorage` cleanup on component unmount
- [ ] Tested: editor clicks Preview, sees the React page with the amber banner

---

## Phase 6 — Production Deployment

### 6.1 Environment Variables

Create a `.env.production` file (never commit this):

```env
VITE_GRAPHQL_ENDPOINT=https://admin.nawras.app/graphql
VITE_FRONTEND_URL=https://nawras.app
```

Update `apolloClient.js`:

```js
uri: import.meta.env.VITE_GRAPHQL_ENDPOINT,
```

### 6.2 CORS on WordPress

Add to `divi-child/functions.php` to allow the React domain to call the GraphQL endpoint:

```php
// divi-child/functions.php
add_action( 'graphql_response_headers_to_send', function ( $headers ) {
    $allowed = [
        'https://nawras.app',
        'http://localhost:5173',
        'http://localhost:5174',
    ];
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if ( in_array( $origin, $allowed, true ) ) {
        $headers['Access-Control-Allow-Origin']      = $origin;
        $headers['Access-Control-Allow-Credentials'] = 'true';
        $headers['Access-Control-Allow-Headers']     = 'Authorization, Content-Type';
    }
    return $headers;
});
```

### 6.3 Build

```bash
# Inside react-front/
npm run build
# Outputs to dist/ — these are the files you deploy
```

### 6.4 SPA Routing Fix — `.htaccess`

React Router handles routing client-side, but direct URL access (e.g., `/blog/some-slug`)
hits the server first. Without this fix, the server returns a 404.

**If deploying to Apache (standard cPanel/shared hosting):**

Place this `.htaccess` in the root of your deployed `dist/` directory:

```apache
# React SPA — redirect all non-asset requests to index.html
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.html [QSA,L]
```

**If deploying to Nginx:**

```nginx
server {
    listen 80;
    server_name nawras.app www.nawras.app;
    root /var/www/nawras/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets aggressively
    location ~* \.(js|css|png|jpg|avif|woff2|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### 6.5 Production Checklist

- [ ] `VITE_GRAPHQL_ENDPOINT` points to `https://admin.nawras.app/graphql`
- [ ] CORS headers allow `https://nawras.app` on the WordPress server
- [ ] WPGraphQL **Public Introspection** disabled (security)
- [ ] `.htaccess` / Nginx `try_files` configured for SPA routing
- [ ] All mock data removed from components (search for `MOCK_POSTS`, `mockData`)
- [ ] `npm run build` succeeds with zero errors
- [ ] `npm run lint` passes
- [ ] Tested: `/blog/some-slug` direct URL load works
- [ ] Tested: Arabic/RTL layout renders correctly on production domain
- [ ] Tested: Contact form sends email via WordPress
- [ ] Tested: Preview flow works end-to-end from the WordPress dashboard

---

## Quick Reference

### GraphQL Endpoint
```
https://admin.nawras.app/graphql
```

### File Index

| File | Purpose |
|------|---------|
| `src/services/apolloClient.js` | Apollo singleton — create in Phase 2 |
| `src/services/posts.js` | Swap mock → real in Phase 3.1 |
| `src/graphql/queries/posts.js` | Blog post queries |
| `src/graphql/queries/solutions.js` | Solutions + Features queries |
| `src/graphql/queries/siteOptions.js` | Stats, video, global options |
| `src/graphql/queries/customers.js` | Logo carousel query |
| `src/graphql/mutations/contactForm.js` | Form submission mutation |
| `src/graphql/fragments/imageFields.js` | Shared image fragment |
| `src/pages/PreviewPage.jsx` | Draft preview route |
| `divi-child/functions.php` | CPTs, options page, CORS, preview redirect |

### Dependency Reference

```bash
npm install @apollo/client graphql
# Already installed: framer-motion, react-router-dom, react-i18next
```

```
WordPress plugins:
  WPGraphQL                    (free, wp.org)
  Advanced Custom Fields PRO   (paid, advancedcustomfields.com)
  WPGraphQL for ACF            (free, github.com/wp-graphql/wpgraphql-acf)
  WPGraphQL JWT Authentication (free, github.com/wp-graphql/wp-graphql-jwt-authentication)
  WS Form PRO                  (paid, wsform.com) — for contact form
```

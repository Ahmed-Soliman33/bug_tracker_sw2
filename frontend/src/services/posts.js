/**
 * Posts service — swap the mock functions below with WPGraphQL queries.
 *
 * WPGraphQL integration pattern:
 *   import { gql } from "@apollo/client";
 *   import { apolloClient } from "./apolloClient";
 *
 *   const GET_POSTS = gql`
 *     query GetPosts($first: Int!) {
 *       posts(first: $first) {
 *         nodes {
 *           id
 *           slug
 *           title
 *           date
 *           excerpt
 *           categories { nodes { name } }
 *           featuredImage { node { sourceUrl altText } }
 *           content
 *         }
 *       }
 *     }
 *   `;
 *
 *   export async function getPosts(first = 9) {
 *     const { data } = await apolloClient.query({ query: GET_POSTS, variables: { first } });
 *     return data.posts.nodes;
 *   }
 */

// ─── Mock data (replace with WPGraphQL when backend is ready) ─────────────────
export const MOCK_POSTS = [
  {
    id: "1",
    slug: "hcm-saas-replacing-traditional-hr",
    title: "HCM SaaS: Why Online HCM Systems Are Replacing Traditional HR Models",
    date: "2025-04-12",
    category: "HCM",
    excerpt:
      "Human Capital Management has evolved dramatically over the past decade. Organizations are no longer managing employees through isolated tools or static databases.",
    content: `
      <p>Human Capital Management has evolved dramatically over the past decade. Organizations are no longer managing employees through isolated tools or static databases. The shift to cloud-based HCM SaaS platforms has fundamentally changed how businesses attract, manage, and retain talent.</p>
      <h2>The Problem with Legacy HR Systems</h2>
      <p>Traditional HR software was built for a different era — one where data lived in spreadsheets, compliance meant binders of printed documents, and employee self-service was a luxury few could afford. These systems are rigid, expensive to maintain, and unable to scale with modern workforce demands.</p>
      <h2>What SaaS HCM Changes</h2>
      <p>Cloud-native HCM platforms like Nawras deliver real-time data access, automatic compliance updates, and seamless employee self-service portals. With modules covering everything from recruitment to retirement planning, organizations gain a single source of truth for their entire workforce.</p>
      <h2>The Numbers Speak</h2>
      <p>Companies that migrate to modern HCM solutions report up to 40% faster onboarding, 60% improvement in HR productivity, and a 3x return on investment within the first two years. Client retention rates consistently exceed 90% once organizations experience the operational clarity that a unified platform delivers.</p>
    `,
    image: "https://images.unsplash.com/photo-1664575599736-c5197c684128?w=800&q=80",
  },
  {
    id: "2",
    slug: "erp-integration-business-growth",
    title: "How Integrated ERP Systems Drive Sustainable Business Growth",
    date: "2025-03-28",
    category: "ERP",
    excerpt:
      "Enterprise Resource Planning has moved far beyond its roots in manufacturing. Modern ERP platforms connect every department — finance, inventory, HR, and beyond.",
    content: `
      <p>Enterprise Resource Planning has moved far beyond its roots in manufacturing. Modern ERP platforms connect every department — finance, inventory, HR, and beyond — into a single, coherent operational system.</p>
      <h2>Breaking Down Departmental Silos</h2>
      <p>The most costly inefficiency in any growing business is data fragmentation. When finance uses one system, operations another, and HR a third, decision-makers are always working with incomplete pictures. Integrated ERP eliminates this by creating a unified data layer across all business functions.</p>
      <h2>Real-Time Decision Making</h2>
      <p>With Nawras ERP, executives gain access to live dashboards that reflect the true state of the business at any moment. Inventory levels, payroll liabilities, project margins, and cash flow forecasts all update in real time — enabling decisions based on facts, not estimates.</p>
    `,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
  },
  {
    id: "3",
    slug: "ai-powered-workforce-analytics",
    title: "AI-Powered Workforce Analytics: Predicting Talent Needs Before They Arise",
    date: "2025-03-15",
    category: "Analytics",
    excerpt:
      "Predictive analytics is transforming how HR leaders plan for the future. Instead of reacting to talent gaps, forward-thinking organizations now anticipate them.",
    content: `
      <p>Predictive analytics is transforming how HR leaders plan for the future. Instead of reacting to talent gaps, forward-thinking organizations now anticipate them weeks or months in advance.</p>
      <h2>From Descriptive to Predictive</h2>
      <p>Traditional HR reporting tells you what happened. AI-powered workforce analytics tells you what is about to happen. By analyzing patterns in employee engagement, productivity, and tenure data, these systems surface early warning signals for attrition, skill shortages, and succession risks.</p>
    `,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
  },
  {
    id: "4",
    slug: "cloud-security-enterprise-data",
    title: "Enterprise-Grade Cloud Security: What Every CTO Should Know in 2025",
    date: "2025-02-20",
    category: "Security",
    excerpt:
      "As organizations migrate critical operations to the cloud, security concerns continue to rank as the top barrier to adoption. Here is how modern platforms address them.",
    content: `
      <p>As organizations migrate critical operations to the cloud, security concerns continue to rank as the top barrier to adoption. Here is how modern platforms address them with enterprise-grade protections built in from the ground up.</p>
      <h2>Zero-Trust Architecture</h2>
      <p>Modern cloud platforms operate on a zero-trust model — no user, device, or network is inherently trusted. Every request is authenticated, authorized, and continuously validated, dramatically reducing the attack surface compared to traditional perimeter-based security models.</p>
    `,
    image: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=800&q=80",
  },
  {
    id: "5",
    slug: "employee-self-service-productivity",
    title: "Employee Self-Service Portals: Reclaiming 60% of HR's Administrative Time",
    date: "2025-02-05",
    category: "HCM",
    excerpt:
      "HR teams spend the majority of their time on transactional tasks — leave requests, payslip queries, and document submissions. Self-service portals change that equation entirely.",
    content: `
      <p>HR teams spend the majority of their time on transactional tasks — leave requests, payslip queries, and document submissions. Self-service portals change that equation entirely, freeing HR professionals to focus on strategic initiatives that actually move the business forward.</p>
      <h2>The ROI of Self-Service</h2>
      <p>Nawras ESS module enables employees to manage their own HR transactions 24/7 from any device. The result: HR administrative burden drops by up to 60%, while employee satisfaction scores consistently improve due to faster response times and greater autonomy.</p>
    `,
    image: "https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?w=800&q=80",
  },
  {
    id: "6",
    slug: "digital-transformation-roadmap",
    title: "Building a Digital Transformation Roadmap That Actually Delivers Results",
    date: "2025-01-18",
    category: "Strategy",
    excerpt:
      "Digital transformation initiatives fail at an alarming rate — not because of bad technology, but because of poor planning and change management.",
    content: `
      <p>Digital transformation initiatives fail at an alarming rate — not because of bad technology, but because of poor planning and change management. A well-structured roadmap is the difference between a successful transformation and an expensive lesson.</p>
      <h2>Starting With Outcomes, Not Tools</h2>
      <p>The most common mistake organizations make is selecting technology before defining desired business outcomes. A transformation roadmap should begin with a clear articulation of what success looks like — measurable KPIs, timeline milestones, and stakeholder accountability frameworks.</p>
    `,
    image: "https://images.unsplash.com/photo-1531973576160-7125cd663d86?w=800&q=80",
  },
];

/** Returns all posts. Swap for API call when ready. */
export async function getPosts() {
  return MOCK_POSTS;
}

/** Returns a single post by slug. Swap for API call when ready. */
export async function getPostBySlug(slug) {
  return MOCK_POSTS.find((p) => p.slug === slug) ?? null;
}

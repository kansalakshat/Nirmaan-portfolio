import {
  Globe,
  DeviceMobile,
  Database,
  GearSix,
  Cpu,
  Code,
  MagnifyingGlass,
  PencilRuler,
  ShieldCheck,
  Rocket,
  Headset,
  WhatsappLogo,
  CurrencyInr,
  MapPin,
  EnvelopeSimple,
  ChatText,
  CloudArrowUp,
  ShoppingBag,
  StripeLogo,
  Kanban,
  DotsThree,
  Lightning,
  UsersThree,
  TrendUp,
} from '@phosphor-icons/react'

export const GITHUB = 'https://github.com/kansalakshat'

/* Every "Start a project" button opens a WhatsApp chat with this message ready */
export const WHATSAPP = `https://wa.me/918964909090?text=${encodeURIComponent(
  "Hi Nirmaan Tech, I'd like to start a project. Can we talk?",
)}`

export const contact = {
  email: 'nirmaanos35@gmail.com',
  phones: [
    { label: '+91 89649 09090', href: 'tel:+918964909090' },
    { label: '+91 78983 21171', href: 'tel:+917898321171' },
  ],
  location: 'Indore, India',
}

export const projects = [
  {
    name: 'Tenderleo',
    kind: 'Tender intelligence platform',
    line: 'Every public tender in India, in one search.',
    desc: 'Pulls tenders from CPPP, GeM and 20 state GePNIC portals, normalises them into one schema, reads the facts out of each bid document and matches them to a company profile.',
    facts: ['60,000+ tenders tracked', '23 official portals crawled', 'Refreshed and purged daily'],
    stack: ['Python', 'FastAPI', 'Postgres', 'Playwright', 'GitHub Actions'],
    shot: '/shots/tender.webp',
    live: 'https://tender-0s.vercel.app',
    code: 'https://github.com/kansalakshat/Tender-os',
  },
  {
    name: 'CA Firm CRM',
    kind: 'Practice management CRM',
    line: 'A private workspace for every CA firm.',
    desc: 'Clients, fees, filings, invoices, tasks and documents for a CA practice. Each firm signs up, gets an isolated workspace and adds its own team, with n8n automations wired in.',
    facts: ['Multi-firm, isolated workspaces', 'Google sign-in and email verification', 'n8n workflow automation'],
    stack: ['React', 'Node.js', 'Supabase', 'n8n', 'Vercel'],
    shot: '/shots/ca.webp',
    live: 'https://ca-0s.vercel.app',
    code: 'https://github.com/kansalakshat/CA',
  },
  {
    name: 'Nirmaan OS',
    kind: 'Construction management app',
    line: 'Every site, store and worker in one pocket.',
    desc: 'Connects builders, supervisors and their sites. Builders track budget and progress; supervisors file daily reports on spending, materials, labour and photos that land straight back with the builder.',
    facts: ['Builder and supervisor roles', 'Photo reports from the site', 'Full app in English or Hindi'],
    stack: ['Expo', 'TypeScript', 'Supabase', 'TanStack Query', 'Reanimated'],
    shot: '/shots/nirmaan.webp',
    portrait: true,
    live: 'https://nirmaan-0s.vercel.app',
    code: 'https://github.com/kansalakshat/Nirmaan-OS',
  },
  {
    name: 'Fuel Bill Lucky Draw',
    kind: 'Campaign entry system',
    line: 'Entries by web, SMS or WhatsApp. One fair draw.',
    desc: 'Customers register a fuel bill through a web form, an SMS or a WhatsApp message. Duplicates are rejected, entries land on an admin dashboard and one click picks a winner with a cryptographically fair draw.',
    facts: ['Web, SMS and WhatsApp entry', 'Twilio and Meta Cloud API webhooks', 'crypto.randomInt winner draw'],
    stack: ['Node.js', 'Express', 'Twilio', 'WhatsApp API', 'Render'],
    shot: '/shots/luckydraw.webp',
    live: 'https://indianoil-lucky-draw.onrender.com',
    code: 'https://github.com/kansalakshat/indianoil-lucky-draw',
  },
]

export const services = [
  { name: 'Websites', icon: Globe, desc: 'Fast, search-ready sites that turn visitors into enquiries.', tags: ['Marketing', 'E-commerce', 'Portals'] },
  { name: 'Apps', icon: DeviceMobile, desc: 'Android, iOS and web apps your team and customers actually open.', tags: ['Expo', 'React Native', 'PWA'] },
  { name: 'CRM', icon: Database, desc: 'Leads, clients, invoices and follow-ups in one private workspace.', tags: ['Sales', 'Billing', 'Teams'] },
  { name: 'Automation', icon: GearSix, desc: 'WhatsApp, email and n8n flows that do the repetitive work for you.', tags: ['n8n', 'Webhooks', 'Cron'] },
  { name: 'AI', icon: Cpu, desc: 'Assistants that read documents, answer customers and sort your data.', tags: ['LLMs', 'Extraction', 'Chat'] },
  { name: 'Custom software', icon: Code, desc: 'Internal tools shaped around how your business already runs.', tags: ['Dashboards', 'APIs', 'Ops'] },
]

export const steps = [
  { title: 'Requirement and discovery', desc: 'Understand your business, goals and requirements.', icon: MagnifyingGlass },
  { title: 'UI/UX design', desc: 'Plan the user experience and system architecture.', icon: PencilRuler },
  { title: 'Development', desc: 'Build your custom solution with modern technology.', icon: Code },
  { title: 'Testing', desc: 'Prove performance, security and reliability before launch.', icon: ShieldCheck },
  { title: 'Deployment', desc: 'Launch your product on your preferred platform.', icon: Rocket },
  { title: 'Support', desc: 'Ongoing maintenance, improvements and scaling.', icon: Headset },
]

export const pillars = [
  { label: 'Business-focused solutions', icon: Lightning },
  { label: 'End-to-end support', icon: UsersThree },
  { label: 'Modern, scalable technology', icon: TrendUp },
  { label: 'Long-term partnership', icon: ShieldCheck },
]

/* Inner ring then outer ring */
export const integrations = [
  [
    { name: 'WhatsApp', icon: WhatsappLogo },
    { name: 'UPI / Payments', icon: CurrencyInr },
    { name: 'Gmail', icon: EnvelopeSimple },
    { name: 'Google Maps', icon: MapPin },
  ],
  [
    { name: 'SMS', icon: ChatText },
    { name: 'Cloud storage', icon: CloudArrowUp },
    { name: 'Shopify', icon: ShoppingBag },
    { name: 'Stripe', icon: StripeLogo },
    { name: 'Atlassian', icon: Kanban },
    { name: 'And more', icon: DotsThree },
  ],
]

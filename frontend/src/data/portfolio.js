/**
 * Single source of truth for page content.
 * The same shape is mirrored by the backend at GET /api/profile, so the site can
 * later be driven from the API without touching any component.
 */

export const profile = {
  name: 'John Patrick Baldorado',
  brand: 'JPB // Network Engineer',
  role: 'Network Engineer | Infrastructure Architecture & Automation',
  valueProp:
    'Designing and deploying high-availability, secure infrastructure for mission-critical operations.',
  location: 'Philippines',
  linkedin: 'https://www.linkedin.com/in/johnpatrickbaldorado',
  github: 'https://github.com/johnpatrickbaldorado',
  email: 'johnpatrick.baldorado@example.com',
};

export const navLinks = [
  { id: 'projects', label: 'Projects' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'contact', label: 'Contact' },
];

export const metrics = [
  {
    value: '7+',
    unit: 'Enterprise Sites',
    note: 'ASEAN 2026 Summit deployment footprint',
  },
  {
    value: '100–200',
    unit: 'Endpoints / Site',
    note: 'Monitored and secured concurrently',
  },
  {
    value: '100+',
    unit: 'Tickets / Week',
    note: 'Sustained SLA queue management',
  },
];

export const projects = [
  {
    id: 'asean-2026',
    title: 'ASEAN 2026 Summit Infrastructure Deployment',
    topology: 'multisite',
    description:
      'Led a team of network engineers deploying critical infrastructure across 7+ regional sites (including Cebu and PICC Manila). Handled routing, switching, firewall hardening, and served as final on-site escalation.',
    tags: ['Routing & Switching', 'Firewalls', 'Network Segmentation', 'Multi-site Deployment'],
  },
  {
    id: 'cloud-identity',
    title: 'Enterprise Application & Cloud Identity Stream',
    topology: 'cloud',
    description:
      'Managed Google Cloud workstream, IAM role-based provisioning, security access-review compliance, and led L1/L2 engineering response for high-priority production incidents.',
    tags: ['GCP', 'IAM', 'SLA Management', 'Linux Administration'],
  },
  {
    id: 'sm-intelligence',
    title: 'SM Intelligence Platform',
    topology: 'stack',
    description:
      'Developed and maintained responsive UI/UX architecture for a heavy corporate intelligence web app platform.',
    tags: ['React', 'Django', 'JavaScript', 'Python', 'Git'],
  },
];

export const achievements = [
  {
    id: 'cum-laude',
    title: 'Graduated Cum Laude',
    org: 'Technological University of the Philippines — Manila',
    detail: 'Bachelor of Engineering Technology.',
    kind: 'Academic',
  },
  {
    id: 'summit-lead',
    title: 'ASEAN 2026 Summit Deployment Lead',
    org: 'Multi-regional deployment sites',
    detail:
      'Successfully brought routing, switching, and firewall infrastructure live ahead of the readiness milestone schedule across multi-regional deployment sites.',
    kind: 'Field',
  },
  {
    id: 'sla-lead',
    title: 'SLA Excellence Lead',
    org: 'Accenture Inc.',
    detail:
      'Driven consistent SLA attainment while managing a high-volume queue of 100+ critical production tickets weekly.',
    kind: 'Operations',
  },
  {
    id: 'stem-honors',
    title: 'Academic Honors Graduate',
    org: 'Technological Institute of the Philippines — Quezon City',
    detail:
      'Completed Science, Technology, Engineering, and Mathematics (STEM) with Honors.',
    kind: 'Academic',
  },
];

export const skillClusters = [
  {
    id: 'networking',
    label: 'Networking',
    summary: 'Core plant: how traffic is carried, filtered, and kept inside its lane.',
    skills: [
      'Routing and switching',
      'Firewall configuration',
      'Network segmentation',
      'Monitoring',
      'Capacity planning',
      'Multi-site deployment',
    ],
  },
  {
    id: 'cloud',
    label: 'Cloud & Systems',
    summary: 'Identity, access, and the hosts that sit behind the edge.',
    skills: [
      'Google Cloud Platform (GCP)',
      'Google Workspace admin',
      'IAM access control',
      'Linux administration',
    ],
  },
  {
    id: 'software',
    label: 'Software & Dev',
    summary: 'The engineering background that turns manual fixes into repeatable ones.',
    skills: [
      'Python',
      'JavaScript',
      'React',
      'Django',
      'Git',
      'Runbook authoring',
      'Root cause analysis',
    ],
  },
];

export const timeline = [
  {
    id: 'dict',
    title: 'Network Engineer',
    org: 'Dept. of Information and Communications Technology / Itraverse Solutions',
    period: 'Mar. 2026 – Present',
    current: true,
    points: [
      'Deployed and hardened routing, switching, and firewall infrastructure across 7+ enterprise sites.',
      'Final on-site escalation point for multi-regional summit readiness.',
      'Monitors and secures 100–200 endpoints per site concurrently.',
    ],
  },
  {
    id: 'accenture',
    title: 'Associate Software Engineer',
    org: 'Accenture Inc.',
    period: 'Nov. 2024 – Apr. 2026',
    current: false,
    points: [
      'Ran the Google Cloud workstream with IAM role-based provisioning and access-review compliance.',
      'Led L1/L2 engineering response for high-priority production incidents.',
      'Sustained SLA attainment across 100+ critical tickets weekly.',
    ],
  },
  {
    id: 'afp',
    title: 'Part-Time Software Developer',
    org: 'Armed Forces of the Philippines',
    period: 'Apr. 2024 – Oct. 2024',
    current: false,
    points: [
      'Built and maintained internal web tooling against operational requirements.',
      'Authored runbooks so handover did not depend on any one developer.',
    ],
  },
];

export const certifications = [
  {
    id: 'google-cyber',
    name: 'Google Cybersecurity Professional',
    issuer: 'Google',
    verified: true,
  },
  {
    id: 'workspace-admin',
    name: 'Associate Google Workspace Administrator',
    issuer: 'Google',
    verified: true,
  },
  {
    id: 'networks-security',
    name: 'Computer Networks & Network Security Fundamentals',
    issuer: 'Professional certification',
    verified: true,
  },
];

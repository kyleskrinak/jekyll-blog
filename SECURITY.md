# Security Policy

This repository contains a static Jekyll site. There is no custom server-side code, but client-side JS, build tooling, and workflows may still present risk.

## Supported Versions
| Branch / Version | Supported |
| ---------------- | --------- |
| `main` (current) | ✅        |
| `staging`        | ✅ (pre-release; best-effort) |
| Older tags       | ❌        |

## How to Report a Vulnerability
**Please do not open a public issue.** Use GitHub’s private reporting:

1. Go to the repo **Security** tab → **Report a vulnerability**
2. Include a clear description, impact, steps to reproduce/PoC, and any affected pages.

We will acknowledge within **3 business days** and provide weekly updates until resolution.

## Scope
**In scope**
- XSS/HTML injection impacting this site.
- Leaked secrets in this repo.
- CI/workflow supply-chain risks affecting this site.
- Mixed-content or config issues introduced by this site.

**Out of scope**
- Hosting/CDN platform issues.
- Third-party library vulns without a demonstrated impact here.
- DoS/volumetric issues; clickjacking on static pages.
- TLS/headers fully controlled by hosting provider.
- Social engineering.

## Disclosure & Remediation
We practice coordinated disclosure. After a fix/mitigation is available, we’ll agree on a disclosure timeline (commonly within **90 days**).

## Safe Harbor
Good-faith testing that follows this policy and avoids privacy violations, data destruction, or service degradation is welcomed. We will not pursue action against such testing.

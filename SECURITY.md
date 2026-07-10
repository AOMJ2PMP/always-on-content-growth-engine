# Security Policy

## Reporting

Please report credential exposure, unsafe publishing behavior, or private-data leakage through a private GitHub security advisory. Do not open a public issue containing secrets or customer data.

## Secret Handling

- Provide TikHub authentication only through `TIKHUB_API_KEY`.
- Never commit `.env` files, bearer tokens, Notion workspace IDs, or raw private payloads.
- Keep publishing disabled unless a user explicitly authorizes it in a separate workflow.
- Treat generated claims, product capabilities, and CTA destinations as unverified until the relevant human review gate is approved.

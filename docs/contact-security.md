# Contact security

- I accept only same-origin JSON POSTs with Cloudflare's trusted client IP header.
- I cap the actual body at 16 KiB, including requests without Content-Length.
- I validate field types, lengths, subjects and UTF-8 on the server. The browser shares
  the field checks for immediate feedback but is not a security boundary.
- I reject common URL forms, HTML, code fences, hidden controls and long binary/encoded
  dumps. These are anti-spam rules, not proof that text is safe or an exhaustive detector.
- I keep SQL values parameterized and Telegram notifications plain text without parse_mode.
  No submitted text is executed. Future message viewers must escape it, not use raw HTML.
- I allow 10 attempts per IP per rolling minute, including rejected payloads, and
  3 saved messages per rolling 10 minutes. Each check and insert is one SQL statement.
- Networks sharing an IP also share the limits. Proxies, rotating IPs and distributed
  attacks can bypass IP-only controls. Origin headers can be forged outside browsers.
- Attempt records store the same truncated IP hash used by messages. Cleanup deletes up
  to 100 attempt records older than one day on an accepted attempt; idle sites retain them
  until traffic resumes. This does not delete visitor messages.

## Verification

`pnpm test` requires Node 24 and runs against isolated in-memory SQLite. Build with
`pnpm run build`; use Wrangler local D1 to verify deployment-specific behavior.

Before deploying this version, apply `schema.sql` to remote D1. The added table and
indexes use IF NOT EXISTS. Without the table, the endpoint fails closed with 503.

For sustained automated abuse, configure edge WAF/rate limits and consider Turnstile
with server-side verification. These are not configured by this change. Application
limits still consume Worker/D1 resources and cannot guarantee DDoS protection.

References: [OWASP input validation](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html),
[Cloudflare prepared statements](https://developers.cloudflare.com/d1/worker-api/prepared-statements/).

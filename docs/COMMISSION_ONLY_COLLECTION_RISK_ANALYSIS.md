## Commission-only collection: risk analysis and recommendation

### Short answer
Collecting only your commission on-platform and having students pay institutions directly reduces tuition refund/chargeback exposure, but increases disintermediation risk, hurts conversion, and weakens control. Prefer a single on‑platform checkout with the institution as merchant‑of‑record via marketplace split‑pay.

### What risks it actually mitigates
- **Card disputes on tuition**: You are not merchant-of-record for tuition → fewer chargebacks on you.
- **Custody/escrow risk**: No large balances held → fewer “where’s my money” claims.
- **Non‑delivery refunds**: Primary delivery liability shifts to the institution.

### New risks and tradeoffs introduced
- **Disintermediation**: Training both sides to transact off‑platform erodes commissions.
- **Conversion friction**: Two-payment flow (your commission + institution tuition) increases drop‑off and support load.
- **Control and evidence**: Weaker audit trail to defend disputes and enforce policies.
- **Ops/reconciliation**: Harder revenue recognition and payment matching to enrollments.
- **Compliance/tax**: Potential joint responsibility under consumer laws; VAT/GST standardization becomes harder.
- **User trust/UX**: Split flows feel risky to buyers and generate more pre‑purchase support.

### Recommended approach instead
- **Use marketplace split‑pay with institution as MoR**: Keep a single on‑platform checkout; route tuition as a direct charge to the institution and take your fee via an application fee. Benefits:
  - Shifts tuition dispute/refund liability to the institution
  - Preserves on‑platform UX, conversion, and attribution
  - Maintains your visibility for evidence, SLAs, and nudges
- **Layer protections**: rolling reserves by institution, staged payouts (deposit → week 1 → census), mandatory on‑platform dispute flow, institution E&O insurance and indemnities.
- **Policies**: clear refund matrix, delivery SLAs, arbitration/class‑action waiver where lawful, chargeback pass‑through.

### When commission‑only collection can make sense
- High‑risk institutions/markets as a temporary risk control.
- Low‑ticket application/seat deposits (commission) while tuition is paid at the school.
- Pilot phases to validate demand without taking tuition risk.

### Turnover and reporting
- GMV through your rails drops, but recognized revenue (commission) is unchanged.
- If GMV optics matter, report total GMV via verified off‑platform tuition while charging on‑platform fees via split‑pay.
- If using direct tuition payments, require proof‑of‑payment upload or verified payment links to preserve attribution and data.

### Summary
- Commission‑only collection reduces tuition chargeback/refund exposure but increases leakage and weakens control.
- Prefer single on‑platform checkout with institution as MoR (split‑pay) to shift liability while preserving conversion and attribution.
- Add reserves, staged releases, strong terms, and evidence capture to further insulate the platform.

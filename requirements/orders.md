# Acme Orders — Pricing Requirements

The pricing rules for the demo storefront (`/demo`). Each acceptance criterion is linked from the
`pricing` rulebook (`calc.req`) and verified by a check, so the RTM shows requirement → rule → run.

### DEMO-PRICE-001: Customer-tier discount
@criticality=high

The system **shall** discount the order subtotal according to the customer's loyalty tier.

**Acceptance:**
- 1: WHEN the customer tier is gold THE SYSTEM SHALL reduce the subtotal by 10%
- 2: WHEN the customer tier is silver THE SYSTEM SHALL reduce the subtotal by 5%
- 3: WHEN the customer tier is platinum THE SYSTEM SHALL reduce the subtotal by 15%

### DEMO-PRICE-002: Rush surcharge
@criticality=medium

The system **shall** add a surcharge for rush delivery.

**Acceptance:**
- 1: WHEN rush delivery is selected THE SYSTEM SHALL add a 15% surcharge on the discounted subtotal

### DEMO-PRICE-003: Shipping
@criticality=medium

The system **shall** ship free above a spend threshold and charge a flat fee otherwise.

**Acceptance:**
- 1: WHEN the discounted subtotal is at least 100 THE SYSTEM SHALL ship the order free
- 2: IF the discounted subtotal is below 100 THEN THE SYSTEM SHALL charge a 9.99 shipping fee

### DEMO-PRICE-004: Approval routing
@criticality=high

The system **shall** route large orders to a human for review.

**Acceptance:**
- 1: WHEN the order total exceeds 1000 THE SYSTEM SHALL route the order to manual review
- 2: IF the order total is 1000 or below THEN THE SYSTEM SHALL auto-approve the order

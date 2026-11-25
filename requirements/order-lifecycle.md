# Acme Orders — Order API Requirements

The order API beside the demo storefront (`/demo/api/login`, `/demo/api/orders`). A caller signs in
for a Bearer token, then creates an order and moves it through its lifecycle: created → paid →
shipped, or cancelled before it ships.

### DEMO-ORDER-001: Sign-in
@criticality=high

The system **shall** issue a Bearer token to a caller with valid credentials and require it on every order call.

**Acceptance:**
- 1: WHEN a caller posts a valid username and password to login THE SYSTEM SHALL return a token
- 2: IF the username or password is wrong THEN THE SYSTEM SHALL respond 401 and issue no token
- 3: IF an order call carries no token or an unknown token THEN THE SYSTEM SHALL respond 401

### DEMO-ORDER-002: Create an order
@criticality=high

The system **shall** create an order from a cart of catalog items.

**Acceptance:**
- 1: WHEN a signed-in caller creates an order with known SKUs and positive quantities THE SYSTEM SHALL respond 201 with an order id and status created
- 2: WHEN an order is created THE SYSTEM SHALL return its total as the sum of unit price times quantity
- 3: IF an item names an unknown SKU or a non-positive quantity THEN THE SYSTEM SHALL respond 400

### DEMO-ORDER-003: Payment
@criticality=high

The system **shall** record payment for an order awaiting it.

**Acceptance:**
- 1: WHEN a created order is paid THE SYSTEM SHALL set its status to paid
- 2: WHEN a paid order is read back THE SYSTEM SHALL report status paid
- 3: IF an order that is not created is paid THEN THE SYSTEM SHALL respond 409 and leave its status unchanged

### DEMO-ORDER-004: Shipping and cancellation
@criticality=medium

The system **shall** ship only paid orders and cancel only orders that have not shipped.

**Acceptance:**
- 1: WHEN a paid order is shipped THE SYSTEM SHALL set its status to shipped
- 2: IF an order that is not paid is shipped THEN THE SYSTEM SHALL respond 409
- 3: WHEN a created or paid order is cancelled THE SYSTEM SHALL set its status to cancelled
- 4: IF a shipped or cancelled order is cancelled THEN THE SYSTEM SHALL respond 409

### DEMO-ORDER-005: Read an order
@criticality=medium

The system **shall** return an order by its id.

**Acceptance:**
- 1: WHEN a signed-in caller reads an existing order THE SYSTEM SHALL return its id, status, items and total
- 2: IF the order id does not exist THEN THE SYSTEM SHALL respond 404

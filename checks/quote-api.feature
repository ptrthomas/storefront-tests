Feature: quote API — verify the /demo pricing SUT against the rules

  Each scenario drives ONE saved business case through the live API and asserts the system prices it
  exactly as the `pricing` RULEBOOK does. Only the platinum tier (DEMO-PRICE-001/3) is left uncovered —
  the deliberate gap. Drift the SUT (the storefront admin panel, or POST /demo/api/config) and these go
  red — that's the point.
  #
  # NO golden numbers: a hardcoded total is a COPY of what the rules already compute, so it proves
  # nothing, needs re-pinning on every legitimate rate change, and can never catch the one thing it
  # looks like it is checking — the SYSTEM drifting from the RULES. `Rule.execute` is the oracle;
  # `check.verify(...)` stamps that something outside the rulebook agreed with it and auto-attaches the
  # criteria the rules realized (calc.req), so traceability costs no extra tag. The scenario-level
  # `@req=` tags below are the OTHER join — a DECLARED link, for the criteria a reader wants named on
  # the scenario itself. Both land in the same RTM.
  #
  # NO test-owned data either: the business cases live once, in the rulebook's saved scenarios
  # (rulebooks/pricing/scenarios.json — what the console's Scenarios tab edits). A check names the row
  # it drives. Add a row there, name it in a new scenario here, re-run: coverage grows, nothing is pinned.

  Background:
    * url demoUrl
    * def saved = Rule.load('pricing').scenarios
    * def rowById = function(id){ return karate.filter(saved, function(s){ return s._id == id })[0] }
    # the API takes {sku, qty} and prices from its own catalog; the rulebook needs each line's unitPrice.
    # One row feeds both — this strips it to the wire shape, so no value is ever typed twice.
    * def toCart = function(o){ return { tier: o.tier, rush: o.rush, items: karate.map(o.items, function(i){ return { sku: i.sku, qty: i.qty } }) } }

  @req=DEMO-PRICE-001/1,DEMO-PRICE-003/2,DEMO-PRICE-004/2
  Scenario: gold tier gets 10% off (pays shipping, auto-approves)
    * def order = rowById('gold-single-gadget')
    * def check = Rule.execute('pricing', order)
    Given path 'demo/api/quote'
    And request toCart(order)
    When method post
    Then status 200
    # the whole priced breakdown — subtotal, discount, rushSurcharge, shipping, total — in one line
    And match response contains check.output
    And match response.outcome == check.outcome
    * check.verify(true, 'the /demo quote API agrees with the pricing rulebook')

  @req=DEMO-PRICE-001/2,DEMO-PRICE-003/2,DEMO-PRICE-004/2
  Scenario: silver tier gets 5% off
    * def order = rowById('silver-mixed')
    * def check = Rule.execute('pricing', order)
    Given path 'demo/api/quote'
    And request toCart(order)
    When method post
    Then status 200
    And match response contains check.output
    And match response.outcome == check.outcome
    * check.verify(true, 'the /demo quote API agrees with the pricing rulebook')

  @req=DEMO-PRICE-001/1,DEMO-PRICE-002/1,DEMO-PRICE-003/1,DEMO-PRICE-004/2
  Scenario: rush adds a 15% surcharge and a large cart ships free
    * def order = rowById('gold-rush-bulk')
    * def check = Rule.execute('pricing', order)
    Given path 'demo/api/quote'
    And request toCart(order)
    When method post
    Then status 200
    And match response contains check.output
    And match response.outcome == check.outcome
    * check.verify(true, 'the /demo quote API agrees with the pricing rulebook')

  @req=DEMO-PRICE-003/1,DEMO-PRICE-004/1
  Scenario: a large order ships free and routes to manual review
    * def order = rowById('large-needs-review')
    * def check = Rule.execute('pricing', order)
    Given path 'demo/api/quote'
    And request toCart(order)
    When method post
    Then status 200
    And match response contains check.output
    And match response.outcome == check.outcome
    * check.verify(true, 'the /demo quote API agrees with the pricing rulebook')

  # the boundary the requirement names: AT 100 exactly, shipping is free (a >= rule, not a > rule)
  @req=DEMO-PRICE-003/1,DEMO-PRICE-004/2
  Scenario: an order exactly at the free-shipping threshold ships free
    * def order = rowById('free-ship-threshold')
    * def check = Rule.execute('pricing', order)
    Given path 'demo/api/quote'
    And request toCart(order)
    When method post
    Then status 200
    And match response contains check.output
    And match response.outcome == check.outcome
    * check.verify(true, 'the /demo quote API agrees with the pricing rulebook')

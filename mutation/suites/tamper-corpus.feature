Feature: tamper corpus — frozen authored oracles against the live /demo SUT

  # The Tier-2 in-client tamper fixture (SPEC api-mutation-testing §4 Seam A). Every assertion is
  # a FROZEN authored literal in feature text — no Rule.execute, no response-derived vars — so an
  # independent kill is possible on every asserted site. The DELIBERATE seeded weakness: no
  # scenario asserts `rushSurcharge`, so its field mutants must SURVIVE and land on the worklist
  # ("no test would independently notice rushSurcharge changing"). The numbers are the demo SUT's
  # spec defaults (DemoApp — deterministic, exact cents).

  Background:
    * url demoUrl
    # declared Content-Type is authoritative (no body sniffing) — also what makes the
    # content-type tamper operator meaningful when Runner.mutate is told {strictResponseParsing: true}
    * configure strictResponseParsing = true

  Scenario: gold tier single gadget — the full frozen breakdown
    Given path 'demo/api/quote'
    And request { tier: 'gold', rush: false, items: [{ sku: 'GADGET', qty: 1 }] }
    When method post
    Then status 200
    And match response.subtotal == 80.0
    And match response.discount == 8.0
    And match response.shipping == 9.99
    And match response.total == 81.99
    And match response.outcome == 'auto_approved'

  Scenario: gold rush bulk — free shipping kicks in (rushSurcharge deliberately unasserted)
    Given path 'demo/api/quote'
    And request { tier: 'gold', rush: true, items: [{ sku: 'GADGET', qty: 2 }] }
    When method post
    Then status 200
    And match response.shipping == 0.0
    And match response.total == 165.6

  Scenario: an unknown sku is a 400 with a named error
    Given path 'demo/api/quote'
    And request { tier: 'standard', items: [{ sku: 'NOPE', qty: 1 }] }
    When method post
    Then status 400
    And match response.error == 'unknown sku: NOPE'

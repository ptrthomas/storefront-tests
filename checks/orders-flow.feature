Feature: Orders flow — sign in, order, pay

  Background:
    * url demoUrl
    # Sign in once: every flow below reuses its token
    * callonce read('/auth/sign-in.feature')

  @req=DEMO-ORDER-002/1,DEMO-ORDER-003/1,DEMO-ORDER-003/2,DEMO-ORDER-005/1
  Scenario: Place, pay and read back an order
    # Create an order
    Given path 'demo/api/orders'
    And header Authorization = 'Bearer ' + token
    And request { items: [{ sku: 'GADGET', qty: 2 }] }
    When method post
    Then status 201
    And match response.status == 'created'
    * def orderId = response.id
    # Pay the order
    Given path 'demo/api/orders', orderId, 'pay'
    And header Authorization = 'Bearer ' + token
    When method post
    Then status 200
    And match response.status == 'paid'
    # Read the order back
    Given path 'demo/api/orders', orderId
    And header Authorization = 'Bearer ' + token
    When method get
    Then status 200
    And match response.status == 'paid'
    And match response.id == orderId

  @req=DEMO-ORDER-002/2
  Scenario Outline: An order's total is the unit price times the quantity
    # Order the row's product and quantity
    Given path 'demo/api/orders'
    And header Authorization = 'Bearer ' + token
    And request { items: [{ sku: '<sku>', qty: <qty> }] }
    When method post
    Then status 201
    And match response.total == <total>

    Examples:
      | sku    | qty | total |
      | WIDGET | 2   | 50    |
      | GADGET | 3   | 240   |

  @req=DEMO-ORDER-001/2
  Scenario: A wrong password is refused
    # Sign in with the wrong password
    Given path 'demo/api/login'
    And request { username: 'tester', password: 'not-the-password' }
    When method post
    Then status 401
    And match response.error == 'invalid username or password'

@ignore
Feature: Sign in

  Scenario: Sign in
    Given url demoUrl
    And path 'demo/api/login'
    And request { username: '#(apiUser)', password: '#(apiPassword)' }
    When method post
    Then status 200
    * def token = response.token

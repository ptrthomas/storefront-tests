// Demo kit — the Acme Orders onboarding/dogfood project. karate auto-loads karate-boot.js from the
// working dir, so a run anchored here (the served console, or a CLI run in this folder) boots:
//  - rules:    the Rule.execute oracle (the `pricing` rulebook) becomes a scenario global, AND binds
//              Check/match/Rule into the feature runtime (D134, RulesExt) — so a `.js` check runs as a
//              suite (Runner.run('checks/x.js') wraps it as a one-scenario feature) and a `.feature`
//              step can call `* def x = Check.run('drive.js', __row)`. Without this boot a spawned
//              check-suite fails "Check is not defined".
//  - robot:    Robot/bot — the UI check (checks/storefront-ui.js) drives the /demo storefront. Each scenario
//              gets a lazy `bot` (a check may open its own with Robot.create); booting the ext launches none.
//  - coverage: contributes the Coverage + Traceability tabs + the requirements tile to each run's report.
//              cov.requirements joins requirements/orders.md so a run's @req= verdicts land in the RTM
//              (Requirement.matrix); cov.openapi the OpenAPI contract; cov.rules the rulebook home (oracle).
const rules = boot.ext('rules');
rules.home = 'rulebooks';
boot.ext('robot');
const cov = boot.ext('coverage');
cov.openapi = 'openapi.yaml';
cov.rules = 'rulebooks';
cov.requirements = 'requirements';

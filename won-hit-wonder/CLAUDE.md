<!-- ERNE-GENERATED -->
<!-- erne-profile: standard -->
# won-hit-wonder — ERNE Configuration

## Project Stack
- **Framework**: React Native with Expo (managed)
- **Language**: TypeScript
- **Navigation**: Expo Router (file-based)
- **State**: None
- **Styling**: StyleSheet.create
- **Lists**: FlatList (built-in)
- **Images**: expo-image
- **Testing**: None configured
- **Build**: Manual

## Key Rules
- Functional components only with `const` + arrow functions
- Named exports only (no default exports)
- Use Expo Router file-based routing — no manual navigation config
- Use secure storage for tokens — avoid AsyncStorage for sensitive data
- Conventional Commits: feat:, fix:, refactor:, test:, docs:, chore:

## Available Commands
/erne-plan, /erne-code-review, /erne-tdd, /erne-build-fix, /erne-perf, /erne-upgrade, /erne-native-module, /erne-debug, /erne-debug-visual, /erne-deploy,
/erne-component, /erne-navigate, /erne-animate, /erne-orchestrate, /erne-quality-gate, /erne-code, /erne-feature, /erne-worker, /erne-audit, /erne-learn, /erne-retrospective, /erne-setup-device

## Dashboard
ERNE includes a visual dashboard for monitoring agents, project health, worker status, and documentation.
Launch: `erne dashboard`
The dashboard shows 6 tabs: HQ (pixel-art agent office), Worker (autonomous tickets), Health (doctor score), Docs (generated documentation), Project (stack & MCP), Insights (analytics).

## Rules
@import .claude/rules/common/
@import .claude/rules/expo/

## Skills
@import .claude/skills/

const gates = [
  { name: "format:check", command: "pnpm format:check" },
  { name: "lint", command: "pnpm lint" },
  { name: "typecheck", command: "pnpm typecheck" },
  { name: "unit", command: "pnpm test" },
  { name: "integration", command: "pnpm test:integration" },
];

const mode = process.argv[2] ?? "develop";

const selectedGates =
  mode === "fast" ? gates.filter((gate) => gate.name !== "integration") : gates;

console.log(`Running quality gates for mode: ${mode}`);
console.log(selectedGates.map((gate) => `- ${gate.name}`).join("\n"));

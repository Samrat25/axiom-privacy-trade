import { createFileRoute } from "@tanstack/react-router";
import Layout from "@/components/Layout";
import StrategyBuilder from "@/components/StrategyBuilder";

export const Route = createFileRoute("/app/strategy")({
  head: () => ({
    meta: [
      { title: "Strategy Builder — Axiom" },
      {
        name: "description",
        content: "Describe a trading strategy in plain language, review the parsed rules, then commit only its hash.",
      },
      { property: "og:title", content: "Strategy Builder — Axiom" },
      { property: "og:description", content: "Describe a strategy, review the rules, commit only its hash." },
    ],
  }),
  component: StrategyPage,
});

function StrategyPage() {
  return (
    <Layout title="Strategy Builder" subtitle="Describe it once. Prove it forever. Disclose nothing.">
      <StrategyBuilder />
    </Layout>
  );
}

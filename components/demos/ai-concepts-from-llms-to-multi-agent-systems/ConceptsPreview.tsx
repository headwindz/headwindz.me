'use client'

import { useId, useState } from 'react'

const concepts = [
  {
    label: 'LLMs',
    topics: 'Large language models',
    detail: 'An LLM generates text or proposes actions using the context it receives.',
  },
  {
    label: 'Context',
    topics: 'Context engineering · Memory · RAG',
    detail:
      'Memory carries forward useful state. RAG retrieves evidence to include in the next model call.',
  },
  {
    label: 'Workflows & agents',
    topics: 'Workflows · Autonomous agents',
    detail:
      'A workflow defines the execution path. An agent chooses its next step based on feedback.',
  },
  {
    label: 'Tools & MCP',
    topics: 'Tools · MCP · Skills · Plugins',
    detail:
      'Tools perform operations, MCP exposes capabilities across hosts, skills supply instructions, and plugins package integrations.',
  },
  {
    label: 'Multi-agent systems',
    topics: 'Multi-agent systems · Orchestrators',
    detail:
      'Agents work in separate contexts while an orchestrator routes tasks and combines results.',
  },
  {
    label: 'Runtime & evaluation',
    topics: 'Hooks · Guardrails · Harnesses',
    detail:
      'Hooks intercept runtime events, guardrails enforce limits, and a harness runs or evaluates the system.',
  },
]

export default function ConceptsPreview() {
  const [active, setActive] = useState(0)
  const detailId = useId()
  const concept = concepts[active]

  return (
    <figure className="post-cover concepts-cover">
      <figcaption>Explore the building blocks</figcaption>
      <div className="concepts-index" role="group" aria-label="AI building blocks">
        {concepts.map(({ label }, index) => (
          <button
            key={label}
            type="button"
            aria-pressed={index === active}
            aria-controls={detailId}
            onClick={() => setActive(index)}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="concepts-note" id={detailId} aria-live="polite" aria-atomic="true">
        <p className="concepts-topics">{concept.topics}</p>
        <p>{concept.detail}</p>
      </div>
    </figure>
  )
}

"use client";

import {
  availableChoices,
  choose,
  createGameState,
  formatDatePtBr,
  formatTime,
  getNode,
  IndexedDbSaveRepository,
  type AppliedChange,
  type GameState,
  type Origin,
  type Presentation
} from "@/game";
import { useEffect, useMemo, useState } from "react";

const SAVE_SLOT = "primary";

const LOCATION_LABELS: Record<GameState["location"], string> = {
  home: "Casa",
  school: "Escola",
  library: "Biblioteca",
  public_transport: "Transporte público",
  work: "Trabalho",
  street: "Rua"
};

const ORIGIN_LABELS: Record<Origin, string> = {
  low_income: "Baixa renda",
  middle_income: "Renda intermediária",
  high_income: "Renda alta"
};

const STAT_LABELS: Record<keyof GameState["stats"], string> = {
  knowledge: "Conhecimento",
  communication: "Comunicação",
  discipline: "Disciplina",
  ethics: "Ética",
  energy: "Energia",
  stress: "Estresse",
  health: "Saúde",
  reputation: "Reputação"
};

function formatChange(change: AppliedChange): string {
  switch (change.type) {
    case "stat":
      return `${STAT_LABELS[change.key]}: ${change.before} → ${change.after}`;
    case "money":
      return `Dinheiro: R$ ${(change.before / 100).toFixed(2)} → R$ ${(
        change.after / 100
      ).toFixed(2)}`;
    case "flag":
      return `${change.key}: ${String(change.before)} → ${String(
        change.after
      )}`;
    case "clock":
      return `Horário: ${formatTime(
        change.before.minuteOfDay
      )} → ${formatTime(change.after.minuteOfDay)}`;
    case "location":
      return `Local: ${LOCATION_LABELS[change.before]} → ${
        LOCATION_LABELS[change.after]
      }`;
  }
}

export default function HomePage() {
  const repository = useMemo(
    () => new IndexedDbSaveRepository(),
    []
  );
  const [state, setState] = useState<GameState | null>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [presentation, setPresentation] =
    useState<Presentation>("man");
  const [origin, setOrigin] = useState<Origin>("middle_income");

  useEffect(() => {
    repository
      .load(SAVE_SLOT)
      .then(setState)
      .catch(() => setState(null))
      .finally(() => setLoading(false));
  }, [repository]);

  useEffect(() => {
    if (state) {
      void repository.save(SAVE_SLOT, state);
    }
  }, [repository, state]);

  if (loading) {
    return (
      <main>
        <div className="shell">
          <section className="panel">Carregando vida...</section>
        </div>
      </main>
    );
  }

  if (!state) {
    return (
      <main>
        <div className="shell">
          <section className="panel">
            <span className="eyebrow">SPRINT 0 · MVP TEXTUAL</span>
            <h1>Vidas Possíveis</h1>
            <p>
              Crie uma vida e enfrente a primeira decisão escolar.
              O horário e as consequências serão salvos automaticamente.
            </p>
          </section>

          <section className="panel form">
            <label>
              Nome
              <input
                aria-label="Nome"
                maxLength={40}
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </label>

            <label>
              Apresentação
              <select
                aria-label="Apresentação"
                value={presentation}
                onChange={(event) =>
                  setPresentation(event.target.value as Presentation)
                }
              >
                <option value="man">Homem</option>
                <option value="woman">Mulher</option>
              </select>
            </label>

            <label>
              Origem familiar
              <select
                aria-label="Origem familiar"
                value={origin}
                onChange={(event) =>
                  setOrigin(event.target.value as Origin)
                }
              >
                {Object.entries(ORIGIN_LABELS).map(
                  ([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  )
                )}
              </select>
            </label>

            <button
              type="button"
              disabled={name.trim().length < 2}
              onClick={() =>
                setState(
                  createGameState({
                    id: crypto.randomUUID(),
                    name: name.trim(),
                    presentation,
                    origin
                  })
                )
              }
            >
              Iniciar vida
            </button>
          </section>
        </div>
      </main>
    );
  }

  const node = getNode(state.currentNodeId);
  const choices = availableChoices(state, node);
  const latestDecision = state.history.at(-1);

  return (
    <main>
      <div className="shell">
        <header
          className="clock"
          data-testid="game-clock"
          aria-label="Data, horário e contexto do personagem"
        >
          <div>
            <span>Data</span>
            <strong>{formatDatePtBr(state.clock.date)}</strong>
          </div>
          <div>
            <span>Horário</span>
            <strong data-testid="current-time">
              {formatTime(state.clock.minuteOfDay)}
            </strong>
          </div>
          <div>
            <span>Local:</span>
            <strong>{LOCATION_LABELS[state.location]}</strong>
          </div>
          <div>
            <span>Próximo compromisso</span>
            <strong>Apresentação às 08:00</strong>
          </div>
        </header>

        <section className="panel">
          <span className="eyebrow">
            {state.player.name} · {ORIGIN_LABELS[state.player.origin]}
          </span>
          <h1>{node.title}</h1>
          <p>{node.text}</p>

          {node.ending ? (
            <button
              type="button"
              onClick={() =>
                void repository
                  .delete(SAVE_SLOT)
                  .then(() => setState(null))
              }
            >
              Criar outra vida
            </button>
          ) : (
            <div className="choices">
              {choices.map((choiceItem) => (
                <button
                  type="button"
                  key={choiceItem.id}
                  onClick={() =>
                    setState((current) =>
                      current
                        ? choose(current, node, choiceItem.id)
                        : current
                    )
                  }
                >
                  {choiceItem.label}
                </button>
              ))}
            </div>
          )}
        </section>

        <section className="panel stats">
          <h2>Estado atual</h2>
          {Object.entries(state.stats).map(([key, value]) => (
            <div key={key}>
              <span>{STAT_LABELS[key as keyof GameState["stats"]]}</span>
              <strong>{value}</strong>
            </div>
          ))}
          <div>
            <span>Dinheiro</span>
            <strong>R$ {(state.moneyCents / 100).toFixed(2)}</strong>
          </div>
        </section>

        {latestDecision ? (
          <section className="panel" aria-live="polite">
            <h2>Consequências da última escolha</h2>
            <ul>
              {latestDecision.changes.map((change, index) => (
                <li key={`${change.type}-${index}`}>
                  {formatChange(change)}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <details className="panel">
          <summary>Painel de depuração</summary>
          <pre>
            {JSON.stringify(
              {
                nodeId: state.currentNodeId,
                seed: state.seed,
                schemaVersion: state.schemaVersion,
                contentVersion: state.contentVersion,
                flags: state.flags
              },
              null,
              2
            )}
          </pre>
        </details>
      </div>
    </main>
  );
}

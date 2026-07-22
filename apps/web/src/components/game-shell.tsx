"use client";

import {
  chooseStoryOption,
  createGameState,
  formatDatePtBr,
  formatTime,
  getAvailableChoices,
  type AppliedChange,
  type GameState,
  type Origin,
  type PlayerProfile
} from "@vidas-possiveis/game-engine";
import { getStoryNode } from "@vidas-possiveis/narrative";
import { IndexedDbSaveRepository } from "@vidas-possiveis/persistence";
import { useEffect, useMemo, useState } from "react";

const SAVE_SLOT = "primary";
const LOCATION_LABELS: Record<GameState["location"], string> = {
  home: "Casa",
  school: "Escola",
  library: "Biblioteca",
  work: "Trabalho",
  public_transport: "Transporte público",
  street: "Rua"
};

const ORIGIN_LABELS: Record<Origin, string> = {
  low_income: "Baixa renda",
  middle_income: "Renda intermediária",
  high_income: "Renda alta"
};

function formatChange(change: AppliedChange): string {
  switch (change.type) {
    case "stat": return `${change.stat}: ${change.before} → ${change.after}`;
    case "money": return `Dinheiro: R$ ${(change.beforeCents / 100).toFixed(2)} → R$ ${(change.afterCents / 100).toFixed(2)}`;
    case "flag": return `${change.flag}: ${String(change.before)} → ${String(change.after)}`;
    case "clock": return `Horário: ${formatTime(change.before.minuteOfDay)} → ${formatTime(change.after.minuteOfDay)}`;
    case "location": return `Local: ${LOCATION_LABELS[change.before]} → ${LOCATION_LABELS[change.after]}`;
  }
}

export function GameShell() {
  const repository = useMemo(() => new IndexedDbSaveRepository(), []);
  const [state, setState] = useState<GameState | null>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [presentation, setPresentation] = useState<PlayerProfile["presentation"]>("man");
  const [origin, setOrigin] = useState<Origin>("middle_income");

  useEffect(() => {
    repository.load(SAVE_SLOT).then((saved) => {
      setState(saved);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [repository]);

  useEffect(() => {
    if (state) void repository.save(SAVE_SLOT, state);
  }, [repository, state]);

  if (loading) return <main><div className="shell"><section className="panel">Carregando vida...</section></div></main>;

  if (!state) {
    return (
      <main>
        <div className="shell">
          <section className="panel hero">
            <p className="label">SPRINT 0 · VERTICAL SLICE TEXTUAL</p>
            <h1>Vidas Possíveis</h1>
            <p className="muted">Crie uma vida e enfrente a primeira decisão escolar. O horário e as consequências serão persistidos automaticamente.</p>
          </section>
          <section className="panel">
            <h2>Nova vida</h2>
            <div className="form-grid">
              <label className="field">
                <span>Nome</span>
                <input value={name} onChange={(event) => setName(event.target.value)} maxLength={40} />
              </label>
              <label className="field">
                <span>Apresentação</span>
                <select value={presentation} onChange={(event) => setPresentation(event.target.value as PlayerProfile["presentation"])}>
                  <option value="man">Homem</option>
                  <option value="woman">Mulher</option>
                </select>
              </label>
              <label className="field">
                <span>Origem familiar</span>
                <select value={origin} onChange={(event) => setOrigin(event.target.value as Origin)}>
                  {Object.entries(ORIGIN_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
              </label>
            </div>
            <div style={{ marginTop: 18 }}>
              <button
                className="primary"
                type="button"
                disabled={name.trim().length < 2}
                onClick={() => setState(createGameState({
                  id: crypto.randomUUID(),
                  name: name.trim(),
                  presentation,
                  origin
                }))}
              >
                Iniciar vida
              </button>
            </div>
          </section>
        </div>
      </main>
    );
  }

  const node = getStoryNode(state.currentNodeId);
  const choices = getAvailableChoices(state, node);
  const latestHistory = state.history.at(-1);
  const nextCommitment = "Apresentação do trabalho às 08:00";

  return (
    <main>
      <div className="shell">
        <header className="clock" data-testid="game-clock" aria-label="Data, horário e contexto atual do personagem">
          <div><span className="label">Data</span><strong>{formatDatePtBr(state.clock.date)}</strong></div>
          <div><span className="label">Horário</span><strong data-testid="current-time">{formatTime(state.clock.minuteOfDay)}</strong></div>
          <div><span className="label">Local:</span><strong>{LOCATION_LABELS[state.location]}</strong></div>
          <div><span className="label">Próximo compromisso</span><strong>{nextCommitment}</strong></div>
        </header>

        <section className="panel hero">
          <p className="label">{state.player.name} · {ORIGIN_LABELS[state.player.origin]}</p>
          <h1>{node.title}</h1>
          <p>{node.text}</p>
          {node.ending ? (
            <div>
              <p><strong>Primeiro recorte concluído.</strong> O save foi registrado e o relógio reflete o tempo consumido.</p>
              <button className="primary" type="button" onClick={() => void repository.delete(SAVE_SLOT).then(() => setState(null))}>
                Criar outra vida
              </button>
            </div>
          ) : (
            <div className="choices">
              {choices.map((choice) => (
                <button
                  className="choice"
                  key={choice.id}
                  type="button"
                  onClick={() => setState((current) => current ? chooseStoryOption(current, node, choice.id) : current)}
                >
                  {choice.label}
                </button>
              ))}
            </div>
          )}
        </section>

        <section className="panel">
          <h2>Estado atual</h2>
          <div className="stats-grid">
            {Object.entries(state.stats).map(([key, value]) => (
              <div className="stat" key={key}><span>{key}</span><strong>{value}</strong></div>
            ))}
            <div className="stat"><span>dinheiro</span><strong>R$ {(state.moneyCents / 100).toFixed(2)}</strong></div>
          </div>
        </section>

        {latestHistory ? (
          <section className="panel" aria-live="polite">
            <h2>Consequências da última escolha</h2>
            <ul className="change-list">
              {latestHistory.changes.map((change, index) => <li key={`${change.type}-${index}`}>{formatChange(change)}</li>)}
            </ul>
          </section>
        ) : null}

        <details className="panel debug">
          <summary>Painel de depuração</summary>
          <pre>{JSON.stringify({
            nodeId: state.currentNodeId,
            seed: state.seed,
            contentVersion: state.contentVersion,
            schemaVersion: state.schemaVersion,
            flags: state.flags
          }, null, 2)}</pre>
        </details>
      </div>
    </main>
  );
}

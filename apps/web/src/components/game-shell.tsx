"use client";

import {
  chooseStoryOption,
  createGameState,
  formatDatePtBr,
  formatTime,
  getChoiceAvailability,
  minutesBetweenClocks,
  STAT_KEYS,
  type AppliedChange,
  type Condition,
  type GameClock,
  type GameState,
  type Origin,
  type PlayerProfile,
  type StatKey
} from "@vidas-possiveis/game-engine";
import { getStoryNode } from "@vidas-possiveis/narrative";
import { IndexedDbSaveRepository } from "@vidas-possiveis/persistence";
import { useEffect, useMemo, useState } from "react";

const SAVE_SLOT = "primary";
const NEXT_COMMITMENT: Readonly<{ label: string; clock: GameClock }> = {
  label: "Apresentação do trabalho",
  clock: { date: "2026-02-17", minuteOfDay: 8 * 60 }
};

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

const STAT_LABELS: Record<StatKey, string> = {
  knowledge: "Conhecimento",
  communication: "Comunicação",
  discipline: "Disciplina",
  ethics: "Ética",
  energy: "Energia",
  stress: "Estresse",
  health: "Saúde",
  reputation: "Reputação"
};

const FLAG_LABELS: Record<string, string> = {
  hasComputer: "Possui computador",
  preparedAssignment: "Trabalho preparado"
};

const SAVE_STATUS_LABELS = {
  idle: "Aguardando primeira alteração",
  saving: "Salvando…",
  saved: "Salvo",
  error: "Falha ao salvar"
} as const;

type SaveStatus = keyof typeof SAVE_STATUS_LABELS;

const MONEY_FORMATTER = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL"
});

function formatMoney(cents: number): string {
  return MONEY_FORMATTER.format(cents / 100);
}

function formatDuration(totalMinutes: number): string {
  if (totalMinutes === 0) return "agora";

  const prefix = totalMinutes < 0 ? "atraso de " : "";
  const absoluteMinutes = Math.abs(totalMinutes);
  const days = Math.floor(absoluteMinutes / (24 * 60));
  const hours = Math.floor((absoluteMinutes % (24 * 60)) / 60);
  const minutes = absoluteMinutes % 60;
  const parts = [
    days > 0 ? `${days}d` : null,
    hours > 0 ? `${hours}h` : null,
    minutes > 0 ? `${minutes}min` : null
  ].filter((part): part is string => part !== null);

  return `${prefix}${parts.join(" ")}`;
}

function formatCondition(condition: Condition): string {
  switch (condition.type) {
    case "stat":
      return `${STAT_LABELS[condition.stat]} deve ser ${condition.operator} ${condition.value}`;
    case "flag":
      return `${FLAG_LABELS[condition.flag] ?? condition.flag} deve ser ${condition.value ? "verdadeiro" : "falso"}`;
    case "money":
      return `Dinheiro deve ser ${condition.operator} ${formatMoney(condition.valueCents)}`;
    case "location":
      return `Local deve ser ${LOCATION_LABELS[condition.value]}`;
  }
}

function formatChange(change: AppliedChange): string {
  switch (change.type) {
    case "stat":
      return `${STAT_LABELS[change.stat]}: ${change.before} → ${change.after}`;
    case "money":
      return `Dinheiro: ${formatMoney(change.beforeCents)} → ${formatMoney(change.afterCents)}`;
    case "flag":
      return `${FLAG_LABELS[change.flag] ?? change.flag}: ${String(change.before)} → ${String(change.after)}`;
    case "clock":
      return `Horário: ${formatTime(change.before.minuteOfDay)} → ${formatTime(change.after.minuteOfDay)}`;
    case "location":
      return `Local: ${LOCATION_LABELS[change.before]} → ${LOCATION_LABELS[change.after]}`;
  }
}

export function GameShell() {
  const repository = useMemo(() => new IndexedDbSaveRepository(), []);
  const [state, setState] = useState<GameState | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [persistenceError, setPersistenceError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [presentation, setPresentation] = useState<PlayerProfile["presentation"]>("man");
  const [origin, setOrigin] = useState<Origin>("middle_income");

  useEffect(() => {
    let active = true;

    repository.load(SAVE_SLOT).then((saved) => {
      if (!active) return;
      setState(saved);
      setSaveStatus(saved ? "saved" : "idle");
      setLoading(false);
    }).catch(() => {
      if (!active) return;
      setSaveStatus("error");
      setPersistenceError("Não foi possível carregar o save local. Você ainda pode iniciar uma nova vida.");
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, [repository]);

  useEffect(() => {
    if (!state) return;
    setSaveStatus("saving");
    repository.save(SAVE_SLOT, state)
      .then(() => {
        setSaveStatus("saved");
        setPersistenceError(null);
      })
      .catch(() => {
        setSaveStatus("error");
        setPersistenceError("O estado atual não pôde ser salvo neste dispositivo.");
      });
  }, [repository, state]);

  async function resetLife(): Promise<void> {
    try {
      await repository.delete(SAVE_SLOT);
      setPersistenceError(null);
      setSaveStatus("idle");
      setState(null);
    } catch {
      setSaveStatus("error");
      setPersistenceError("Não foi possível apagar o save local.");
    }
  }

  if (loading) {
    return <main><div className="shell"><section className="panel">Carregando vida...</section></div></main>;
  }

  if (!state) {
    return (
      <main>
        <div className="shell">
          {persistenceError ? <p className="alert" role="alert">{persistenceError}</p> : null}
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
                <input value={name} onChange={(event) => setName(event.target.value)} maxLength={40} autoComplete="off" />
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
            <div className="form-actions">
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
  const choiceAvailability = getChoiceAvailability(state, node);
  const choices = choiceAvailability.filter((item) => item.available).map((item) => item.choice);
  const blockedChoices = choiceAvailability.filter((item) => !item.available);
  const latestHistory = state.history.at(-1);
  const minutesUntilCommitment = minutesBetweenClocks(state.clock, NEXT_COMMITMENT.clock);
  const currentActivity = node.ending ? "Planejar o restante da noite" : "Organizar o trabalho escolar";

  return (
    <main>
      <div className="shell">
        {persistenceError ? <p className="alert" role="alert">{persistenceError}</p> : null}
        <header className="clock" data-testid="game-clock" aria-label="Data, horário e contexto atual do personagem">
          <div><span className="label">Data</span><strong>{formatDatePtBr(state.clock.date)}</strong></div>
          <div><span className="label">Horário</span><strong data-testid="current-time">{formatTime(state.clock.minuteOfDay)}</strong></div>
          <div><span className="label">Local</span><strong>{LOCATION_LABELS[state.location]}</strong></div>
          <div><span className="label">Atividade atual</span><strong>{currentActivity}</strong></div>
          <div>
            <span className="label">Próximo compromisso</span>
            <strong>{NEXT_COMMITMENT.label} · {formatTime(NEXT_COMMITMENT.clock.minuteOfDay)}</strong>
          </div>
          <div>
            <span className="label">Tempo até compromisso</span>
            <strong data-testid="time-until-commitment">{formatDuration(minutesUntilCommitment)}</strong>
          </div>
        </header>

        <section className="panel hero">
          <p className="label">{state.player.name} · {ORIGIN_LABELS[state.player.origin]}</p>
          <p className="save-status" data-testid="save-status" aria-live="polite">Save local: {SAVE_STATUS_LABELS[saveStatus]}</p>
          <h1>{node.title}</h1>
          <p>{node.text}</p>
          {node.ending ? (
            <div>
              <p><strong>Primeiro recorte concluído.</strong> O save foi registrado e o relógio reflete o tempo consumido.</p>
              <button className="primary" type="button" onClick={() => void resetLife()}>
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
            {STAT_KEYS.map((key) => (
              <div className="stat" key={key}><span>{STAT_LABELS[key]}</span><strong>{state.stats[key]}</strong></div>
            ))}
            <div className="stat"><span>Dinheiro</span><strong>{formatMoney(state.moneyCents)}</strong></div>
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
          {blockedChoices.length > 0 ? (
            <div data-testid="blocked-choice-reasons">
              <p><strong>Opções bloqueadas</strong></p>
              <ul>
                {blockedChoices.map(({ choice, failedConditions }) => (
                  <li key={choice.id}>
                    {choice.label}: {failedConditions.map(formatCondition).join("; ")}
                  </li>
                ))}
              </ul>
            </div>
          ) : <p>Nenhuma opção bloqueada neste nó.</p>}
          <pre>{JSON.stringify({
            nodeId: state.currentNodeId,
            seed: state.seed,
            contentVersion: state.contentVersion,
            schemaVersion: state.schemaVersion,
            clock: state.clock,
            nextCommitment: NEXT_COMMITMENT,
            minutesUntilCommitment,
            saveStatus,
            flags: state.flags
          }, null, 2)}</pre>
        </details>
      </div>
    </main>
  );
}

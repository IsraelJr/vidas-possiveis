"use client";

import {
  chooseStoryOption,
  createGameState,
  formatDatePtBr,
  formatTime,
  getChoiceAvailability,
  migrateGameState,
  minutesBetweenClocks,
  STAT_KEYS,
  type AppliedChange,
  type Condition,
  type GameClock,
  type GameState,
  type Origin,
  type OutcomeTier,
  type PlayerProfile,
  type RelationshipDimension,
  type StatKey
} from "@vidas-possiveis/game-engine";
import { getStoryNode } from "@vidas-possiveis/narrative";
import { IndexedDbSaveRepository } from "@vidas-possiveis/persistence";
import { useEffect, useMemo, useRef, useState } from "react";

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

const RELATIONSHIP_LABELS: Record<RelationshipDimension, string> = {
  trust: "Confiança",
  affection: "Proximidade",
  conflict: "Tensão"
};

const FLAG_LABELS: Record<string, string> = {
  hasComputer: "Possui computador",
  preparedAssignment: "Trabalho preparado",
  promisedHelp: "Prometeu ajudar Bia",
  sharedPlan: "Organizou o grupo",
  removedBia: "Afastou Bia do trabalho",
  rehearsedPresentation: "Ensaiou a apresentação",
  restedBeforePresentation: "Descansou antes da apresentação",
  improvisedNight: "Improvisou a preparação",
  attendedTechCourse: "Participou do curso de tecnologia",
  workedTemporaryJob: "Fez um trabalho temporário",
  builtFirstProject: "Criou o primeiro projeto",
  formationUniversity: "Escolheu a faculdade",
  formationTechnical: "Escolheu um curso técnico",
  formationOnlineWork: "Escolheu trabalhar e estudar online",
  formationSelfStudy: "Escolheu trabalhar e estudar por conta própria"
};

const OUTCOME_LABELS: Record<OutcomeTier, { title: string; text: string }> = {
  critical_failure: {
    title: "A situação saiu do controle",
    text: "Foi um momento difícil, com consequências maiores do que você esperava."
  },
  failure: {
    title: "Não saiu como você esperava",
    text: "Você encontrou dificuldades, mas a experiência mostrou o que precisa melhorar."
  },
  partial_success: {
    title: "Você conseguiu, com alguns tropeços",
    text: "O resultado foi suficiente para seguir em frente, embora nem tudo tenha funcionado."
  },
  success: {
    title: "Você se saiu bem",
    text: "Sua preparação e suas escolhas ajudaram a situação a terminar de forma positiva."
  },
  exceptional_success: {
    title: "Você surpreendeu a todos",
    text: "O resultado foi melhor do que o esperado e abriu novas possibilidades."
  }
};

const PROGRESS_STATUS_LABELS = {
  idle: "Ainda não há escolhas para guardar",
  saving: "Guardando suas escolhas…",
  saved: "Escolhas guardadas",
  error: "Não foi possível guardar suas escolhas"
} as const;

type ProgressStatus = keyof typeof PROGRESS_STATUS_LABELS;

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

function formatClock(clock: GameClock): string {
  return `${formatDatePtBr(clock.date)} às ${formatTime(clock.minuteOfDay)}`;
}

function formatCondition(condition: Condition, state: GameState): string {
  switch (condition.type) {
    case "stat":
      return `${STAT_LABELS[condition.stat]} deve ser ${condition.operator} ${condition.value}`;
    case "flag":
      return `${FLAG_LABELS[condition.flag] ?? condition.flag} deve ser ${condition.value ? "sim" : "não"}`;
    case "money":
      return `Dinheiro deve ser ${condition.operator} ${formatMoney(condition.valueCents)}`;
    case "location":
      return `Local deve ser ${LOCATION_LABELS[condition.value]}`;
    case "relationship":
      return `${RELATIONSHIP_LABELS[condition.dimension]} com ${state.relationships[condition.relationshipId]?.name ?? condition.relationshipId} deve ser ${condition.operator} ${condition.value}`;
  }
}

function formatChange(change: AppliedChange, state: GameState): string | null {
  switch (change.type) {
    case "stat":
      return `${STAT_LABELS[change.stat]}: ${change.before} → ${change.after}`;
    case "money":
      return `Dinheiro: ${formatMoney(change.beforeCents)} → ${formatMoney(change.afterCents)}`;
    case "flag":
      return `${FLAG_LABELS[change.flag] ?? change.flag}: ${change.after ? "Sim" : "Não"}`;
    case "clock":
      return change.before.date === change.after.date
        ? `Horário: ${formatTime(change.before.minuteOfDay)} → ${formatTime(change.after.minuteOfDay)}`
        : `Tempo: ${formatClock(change.before)} → ${formatClock(change.after)}`;
    case "location":
      return `Local: ${LOCATION_LABELS[change.before]} → ${LOCATION_LABELS[change.after]}`;
    case "relationship":
      return `${RELATIONSHIP_LABELS[change.dimension]} com ${state.relationships[change.relationshipId]?.name ?? change.relationshipId}: ${change.before} → ${change.after}`;
    case "scheduled_consequence":
      return null;
  }
}

export function GameShell() {
  const repository = useMemo(() => new IndexedDbSaveRepository(), []);
  const saveRevision = useRef(0);
  const [state, setState] = useState<GameState | null>(null);
  const [loading, setLoading] = useState(true);
  const [progressStatus, setProgressStatus] = useState<ProgressStatus>("idle");
  const [persistenceError, setPersistenceError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [presentation, setPresentation] = useState<PlayerProfile["presentation"]>("man");
  const [origin, setOrigin] = useState<Origin>("middle_income");

  useEffect(() => {
    let active = true;

    repository.load(SAVE_SLOT).then((saved) => {
      if (!active) return;
      setState(saved ? migrateGameState(saved) : null);
      setProgressStatus(saved ? "saved" : "idle");
      setLoading(false);
    }).catch(() => {
      if (!active) return;
      setProgressStatus("error");
      setPersistenceError("Não foi possível recuperar suas escolhas anteriores. Você ainda pode começar uma nova vida.");
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, [repository]);

  useEffect(() => {
    if (!state) return;

    const revision = saveRevision.current + 1;
    saveRevision.current = revision;
    setProgressStatus("saving");

    repository.save(SAVE_SLOT, state)
      .then(() => {
        if (revision !== saveRevision.current) return;
        setProgressStatus("saved");
        setPersistenceError(null);
      })
      .catch(() => {
        if (revision !== saveRevision.current) return;
        setProgressStatus("error");
        setPersistenceError("Suas escolhas mais recentes não puderam ser guardadas neste dispositivo.");
      });
  }, [repository, state]);

  async function resetLife(): Promise<void> {
    saveRevision.current += 1;
    try {
      await repository.delete(SAVE_SLOT);
      setPersistenceError(null);
      setProgressStatus("idle");
      setState(null);
    } catch {
      setProgressStatus("error");
      setPersistenceError("Não foi possível apagar a vida atual.");
    }
  }

  if (loading) {
    return <main><div className="shell"><section className="panel">Recuperando sua história…</section></div></main>;
  }

  if (!state) {
    return (
      <main>
        <div className="shell">
          {persistenceError ? <p className="alert" role="alert">{persistenceError}</p> : null}
          <section className="panel hero">
            <p className="label">UMA VIDA COMEÇA</p>
            <h1>Vidas Possíveis</h1>
            <p className="muted">Crie uma vida, faça escolhas e acompanhe como o tempo, as oportunidades e as relações mudam o caminho do personagem.</p>
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
  const commitment = node.nextCommitment;
  const minutesUntilCommitment = commitment ? minutesBetweenClocks(state.clock, commitment.clock) : null;
  const visibleChanges = latestHistory?.changes
    .map((change) => formatChange(change, state))
    .filter((change): change is string => change !== null) ?? [];
  const triggeredConsequences = latestHistory?.triggeredConsequences ?? [];
  const skillResult = latestHistory?.skillCheck ? OUTCOME_LABELS[latestHistory.skillCheck.outcome] : null;

  return (
    <main>
      <div className="shell">
        {persistenceError ? <p className="alert" role="alert">{persistenceError}</p> : null}
        <header className="clock" data-testid="game-clock" aria-label="Data, horário e contexto atual do personagem">
          <div><span className="label">Data</span><strong>{formatDatePtBr(state.clock.date)}</strong></div>
          <div><span className="label">Horário</span><strong data-testid="current-time">{formatTime(state.clock.minuteOfDay)}</strong></div>
          <div><span className="label">Local</span><strong>{LOCATION_LABELS[state.location]}</strong></div>
          <div><span className="label">Atividade atual</span><strong>{node.activity}</strong></div>
          <div>
            <span className="label">Próximo compromisso</span>
            <strong>{commitment ? `${commitment.label} · ${formatClock(commitment.clock)}` : "Nenhum compromisso marcado"}</strong>
          </div>
          <div>
            <span className="label">Tempo até compromisso</span>
            <strong data-testid="time-until-commitment">{minutesUntilCommitment === null ? "Tempo livre" : formatDuration(minutesUntilCommitment)}</strong>
          </div>
        </header>

        <section className="panel hero">
          <p className="label">{state.player.name} · {ORIGIN_LABELS[state.player.origin]}</p>
          <p className="save-status" data-testid="save-status" aria-live="polite">Progresso: {PROGRESS_STATUS_LABELS[progressStatus]}</p>
          <h1>{node.title}</h1>
          <p>{node.text}</p>
          {node.ending ? (
            <div>
              <p><strong>Esta etapa da sua história chegou ao fim.</strong> Suas escolhas abriram um caminho para os próximos anos.</p>
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

        {skillResult ? (
          <section className="panel result-card" data-testid="skill-result" aria-live="polite">
            <p className="label">COMO A SITUAÇÃO TERMINOU</p>
            <h2>{skillResult.title}</h2>
            <p>{skillResult.text}</p>
          </section>
        ) : null}

        {triggeredConsequences.map((consequence) => (
          <section className="panel consequence-card" key={consequence.id} data-testid="triggered-consequence" aria-live="polite">
            <p className="label">UMA ESCOLHA VOLTOU A TER EFEITO</p>
            <h2>{consequence.title}</h2>
            <p>{consequence.text}</p>
          </section>
        ))}

        {visibleChanges.length > 0 ? (
          <section className="panel" aria-live="polite">
            <h2>O que mudou</h2>
            <ul className="change-list">
              {visibleChanges.map((change, index) => <li key={`${change}-${index}`}>{change}</li>)}
            </ul>
          </section>
        ) : null}

        <section className="panel">
          <h2>Estado atual</h2>
          <div className="stats-grid">
            {STAT_KEYS.map((key) => (
              <div className="stat" key={key}><span>{STAT_LABELS[key]}</span><strong>{state.stats[key]}</strong></div>
            ))}
            <div className="stat"><span>Dinheiro</span><strong>{formatMoney(state.moneyCents)}</strong></div>
          </div>
        </section>

        <section className="panel">
          <h2>Pessoas importantes</h2>
          <div className="relationship-grid">
            {Object.values(state.relationships).map((relationship) => (
              <article className="relationship" key={relationship.id}>
                <h3>{relationship.name}</h3>
                <p className="muted">Amiga da escola</p>
                <div className="stat"><span>Confiança</span><strong>{relationship.trust}</strong></div>
                <div className="stat"><span>Proximidade</span><strong>{relationship.affection}</strong></div>
                <div className="stat"><span>Tensão</span><strong>{relationship.conflict}</strong></div>
              </article>
            ))}
          </div>
        </section>

        <details className="panel debug">
          <summary>Detalhes de teste</summary>
          {blockedChoices.length > 0 ? (
            <div data-testid="blocked-choice-reasons">
              <p><strong>Opções indisponíveis</strong></p>
              <ul>
                {blockedChoices.map(({ choice, failedConditions }) => (
                  <li key={choice.id}>
                    {choice.label}: {failedConditions.map((condition) => formatCondition(condition, state)).join("; ")}
                  </li>
                ))}
              </ul>
            </div>
          ) : <p>Nenhuma opção indisponível neste momento.</p>}
          <pre>{JSON.stringify({
            nodeId: state.currentNodeId,
            seed: state.seed,
            contentVersion: state.contentVersion,
            schemaVersion: state.schemaVersion,
            clock: state.clock,
            nextCommitment: commitment,
            minutesUntilCommitment,
            progressStatus,
            saveRevision: saveRevision.current,
            rollIndex: state.rollIndex,
            flags: state.flags,
            relationships: state.relationships,
            scheduledConsequences: state.scheduledConsequences,
            latestHistory
          }, null, 2)}</pre>
        </details>
      </div>
    </main>
  );
}

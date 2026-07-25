"use client";

import {
  ATTRIBUTE_KEYS,
  CONDITION_KEYS,
  chooseStoryOption,
  continueStoryAfterOutcome,
  createGameState,
  formatDatePtBr,
  formatTime,
  getChoiceAvailability,
  migrateGameState,
  minutesBetweenClocks,
  readPersistedPlayerProfile,
  type GameState,
  type PersonState,
  type PlayerProfile,
  type RomanticPreference
} from "@vidas-possiveis/game-engine";
import {
  getNarrativePack,
  getStoryNodeForState,
  renderNodeForState,
  schoolProloguePack
} from "@vidas-possiveis/narrative";
import { IndexedDbSaveRepository } from "@vidas-possiveis/persistence";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ATTRIBUTE_LABELS,
  CATEGORY_LABELS,
  CONDITION_LABELS,
  OUTCOME_LABELS,
  PROGRESS_STATUS_LABELS,
  formatChange,
  formatClock,
  formatCondition,
  formatDuration,
  formatKnowledge,
  formatLocation,
  formatMoney,
  relationshipPeople,
  relationshipSummary,
  type ProgressStatus
} from "./game-presentation";

const SAVE_SLOT = "primary";

function savedScenarioId(saved: unknown): string | null {
  if (!saved || typeof saved !== "object") return null;
  const scenario = (saved as { readonly scenario?: { readonly id?: unknown } }).scenario;
  return typeof scenario?.id === "string" ? scenario.id : null;
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
  const [romanticPreference, setRomanticPreference] = useState<RomanticPreference>("undefined");

  useEffect(() => {
    let active = true;

    repository.load(SAVE_SLOT).then((saved) => {
      if (!active) return;
      if (!saved) {
        setState(null);
        setProgressStatus("idle");
        setLoading(false);
        return;
      }

      const profile = readPersistedPlayerProfile(saved);
      if (!profile) throw new Error("Personagem salvo inválido.");
      const requestedPackId = savedScenarioId(saved);
      const pack = requestedPackId ? getNarrativePack(requestedPackId) : schoolProloguePack;
      setState(migrateGameState(saved, pack.createSetup(profile)));
      setProgressStatus("saved");
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

  function startLife(): void {
    const profile: PlayerProfile = {
      id: crypto.randomUUID(),
      name: name.trim(),
      presentation,
      origin: "middle_income",
      romanticPreference
    };
    setState(createGameState(profile, schoolProloguePack.createSetup(profile)));
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
            <p className="label">PRÓLOGO ESCOLAR</p>
            <h1>Vidas Possíveis</h1>
            <p className="muted">Crie uma vida de classe média, atravesse dois anos do Ensino Médio e veja como tempo, dinheiro e relações mudam o caminho até a vida adulta.</p>
          </section>
          <section className="panel">
            <h2>Nova vida</h2>
            <div className="form-grid">
              <label className="field">
                <span>Nome</span>
                <input value={name} onChange={(event) => setName(event.target.value)} maxLength={40} autoComplete="off" />
              </label>
              <label className="field">
                <span>Personagem</span>
                <select value={presentation} onChange={(event) => setPresentation(event.target.value as PlayerProfile["presentation"])}>
                  <option value="man">Homem</option>
                  <option value="woman">Mulher</option>
                </select>
              </label>
              <label className="field">
                <span>Possível interesse romântico</span>
                <select value={romanticPreference} onChange={(event) => setRomanticPreference(event.target.value as RomanticPreference)}>
                  <option value="undefined">Ainda não definir</option>
                  <option value="women">Mulheres</option>
                  <option value="men">Homens</option>
                  <option value="both">Homens e mulheres</option>
                  <option value="none">Não quero romance</option>
                </select>
              </label>
              <div className="field static-field">
                <span>Contexto do prólogo</span>
                <strong>Classe média · aproximadamente 16 anos · 2º ano do Ensino Médio</strong>
              </div>
            </div>
            <div className="form-actions">
              <button
                className="primary"
                type="button"
                disabled={name.trim().length < 2}
                onClick={startLife}
              >
                Iniciar vida
              </button>
            </div>
          </section>
        </div>
      </main>
    );
  }

  const pack = getNarrativePack(state.scenario.id);
  const labels = pack.presentation;
  const rawNode = getStoryNodeForState(state);
  const node = renderNodeForState(state, rawNode);
  const pendingOutcome = state.pendingOutcome;
  const choiceAvailability = pendingOutcome ? [] : getChoiceAvailability(state, node);
  const choices = choiceAvailability.filter((item) => item.available).map((item) => item.choice);
  const blockedChoices = choiceAvailability.filter((item) => !item.available);
  const latestHistory = pendingOutcome ? state.history.at(-1) : undefined;
  const commitment = node.nextCommitment;
  const minutesUntilCommitment = commitment ? minutesBetweenClocks(state.clock, commitment.clock) : null;
  const visibleChanges = latestHistory?.changes
    .map((change) => formatChange(change, state, labels))
    .filter((change): change is string => change !== null) ?? [];
  const triggeredConsequences = latestHistory?.triggeredConsequences ?? [];
  const skillResult = latestHistory?.skillCheck ? OUTCOME_LABELS[latestHistory.skillCheck.outcome] : null;
  const contextPeople = pendingOutcome ? [] : (node.contextPersonIds ?? [])
    .map((personId) => state.people[personId])
    .filter((person): person is PersonState => Boolean(person));
  const displayedTitle = pendingOutcome?.title ?? node.title;
  const displayedText = pendingOutcome?.text ?? node.text;
  const displayedActivity = pendingOutcome?.activity ?? node.activity;

  return (
    <main>
      <div className="shell">
        {persistenceError ? <p className="alert" role="alert">{persistenceError}</p> : null}
        {state.flags.migratedToTwoYearPrologue ? (
          <p className="notice" data-testid="migration-notice">
            Sua vida escolar foi ampliada para dois anos. Suas escolhas, pessoas e lembranças compatíveis foram preservadas.
          </p>
        ) : state.flags.migratedFromEarlierPrologue ? (
          <p className="notice" data-testid="migration-notice">
            Seu personagem foi atualizado para a versão atual do prólogo. A história escolar recomeçou porque o progresso anterior não possuía todos os dados necessários.
          </p>
        ) : null}

        <header className="clock" data-testid="game-clock" aria-label="Data, horário e contexto atual do personagem">
          <div><span className="label">Data</span><strong>{formatDatePtBr(state.clock.date)}</strong></div>
          <div><span className="label">Horário</span><strong data-testid="current-time">{formatTime(state.clock.minuteOfDay)}</strong></div>
          <div><span className="label">Local</span><strong>{formatLocation(state.location, labels)}</strong></div>
          <div><span className="label">Atividade atual</span><strong data-testid="current-activity">{displayedActivity}</strong></div>
          <div>
            <span className="label">Próximo compromisso</span>
            <strong>{commitment ? `${commitment.label} · ${formatClock(commitment.clock)}` : "Nenhum compromisso marcado"}</strong>
          </div>
          <div>
            <span className="label">Tempo até compromisso</span>
            <strong data-testid="time-until-commitment">{minutesUntilCommitment === null ? "Tempo livre" : formatDuration(minutesUntilCommitment)}</strong>
          </div>
        </header>

        <section className="panel hero" data-testid={pendingOutcome ? "choice-outcome" : "story-scene"}>
          <p className="label">{pendingOutcome ? "O QUE ACONTECEU DEPOIS DA SUA ESCOLHA" : `${state.player.name} · Classe média`}</p>
          <p className="save-status" data-testid="save-status" aria-live="polite">Progresso: {PROGRESS_STATUS_LABELS[progressStatus]}</p>
          <h1>{displayedTitle}</h1>
          <p>{displayedText}</p>

          {contextPeople.map((person) => (
            <details className="person-context" key={person.id} data-testid={`person-context-${person.id}`}>
              <summary>Quem é {person.name}?</summary>
              <p>{person.contextSummary}</p>
              <p className="muted">{relationshipSummary(person)}</p>
            </details>
          ))}

          {pendingOutcome ? (
            <div className="form-actions">
              <button
                className="primary"
                data-testid="continue-outcome"
                type="button"
                onClick={() => setState((current) => current ? continueStoryAfterOutcome(current) : current)}
              >
                {pendingOutcome.continueLabel ?? "Continuar"}
              </button>
            </div>
          ) : node.ending ? (
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
          <h2>Atributos</h2>
          <div className="stats-grid">
            {ATTRIBUTE_KEYS.map((key) => (
              <div className="stat" key={key}><span>{ATTRIBUTE_LABELS[key]}</span><strong>{state.attributes[key]}</strong></div>
            ))}
          </div>
        </section>

        <section className="panel">
          <h2>Condições do momento</h2>
          <div className="stats-grid">
            {CONDITION_KEYS.map((key) => (
              <div className="stat" key={key}><span>{CONDITION_LABELS[key]}</span><strong>{state.conditions[key]}</strong></div>
            ))}
          </div>
        </section>

        <section className="panel">
          <h2>Conhecimentos</h2>
          <div className="stats-grid">
            {Object.entries(state.knowledge).map(([key, value]) => (
              <div className="stat" key={key}><span>{formatKnowledge(key, labels)}</span><strong>{value}</strong></div>
            ))}
          </div>
        </section>

        <section className="panel">
          <h2>Recursos e trajetória</h2>
          <div className="stats-grid">
            <div className="stat"><span>Dinheiro</span><strong>{formatMoney(state.moneyCents)}</strong></div>
            <div className="stat"><span>{labels.reputationLabel}</span><strong>{state.reputation}</strong></div>
          </div>
        </section>

        <section className="panel">
          <h2>Pessoas da sua história</h2>
          <div className="relationship-grid">
            {relationshipPeople(state).map((person) => (
              <article className="relationship" key={person.id}>
                <div className="relationship-heading">
                  <h3>{person.name}</h3>
                  <span className={`category category-${person.category}`}>{CATEGORY_LABELS[person.category]}</span>
                </div>
                <p className="muted">{person.role}</p>
                <p>{relationshipSummary(person)}</p>
                <details>
                  <summary>Como está a relação</summary>
                  <div className="stat"><span>Confiança</span><strong>{person.trust}</strong></div>
                  <div className="stat"><span>Proximidade</span><strong>{person.closeness}</strong></div>
                  <div className="stat"><span>Tensão</span><strong>{person.tension}</strong></div>
                  {person.memories.length > 0 ? (
                    <>
                      <h4>Lembranças</h4>
                      <ul className="memory-list">
                        {person.memories.map((memory) => <li key={memory.id}>{memory.summary}</li>)}
                      </ul>
                    </>
                  ) : null}
                </details>
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
                    {choice.label}: {failedConditions.map((condition) => formatCondition(condition, state, labels)).join("; ")}
                  </li>
                ))}
              </ul>
            </div>
          ) : <p>{pendingOutcome ? "Aguardando a continuidade da consequência narrativa." : "Nenhuma opção indisponível neste momento."}</p>}
          <pre>{JSON.stringify({
            nodeId: state.currentNodeId,
            seed: state.seed,
            contentVersion: state.contentVersion,
            schemaVersion: state.schemaVersion,
            scenario: state.scenario,
            clock: state.clock,
            nextCommitment: commitment,
            minutesUntilCommitment,
            progressStatus,
            people: state.people,
            scheduledConsequences: state.scheduledConsequences,
            pendingOutcome,
            latestHistory
          }, null, 2)}</pre>
        </details>
      </div>
    </main>
  );
}

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
  home: "Casa", school: "Escola", library: "Biblioteca", work: "Trabalho",
  public_transport: "Transporte público", ride_hailing: "Carro por aplicativo",
  shopping_mall: "Shopping", park: "Parque", party: "Festa", street: "Rua"
};
const ORIGIN_LABELS: Record<Origin, string> = { low_income: "Baixa renda", middle_income: "Classe média", high_income: "Renda alta" };
const STAT_LABELS: Record<StatKey, string> = {
  knowledge: "Conhecimento", communication: "Comunicação", discipline: "Autocontrole", ethics: "Responsabilidade",
  energy: "Energia", stress: "Estresse", health: "Saúde", reputation: "Reputação"
};
const RELATIONSHIP_LABELS: Record<RelationshipDimension, string> = { trust: "Confiança", affection: "Proximidade", conflict: "Tensão" };
const OUTCOME_LABELS: Record<OutcomeTier, { title: string; text: string }> = {
  critical_failure: { title: "A situação saiu do controle", text: "Foi um momento difícil, com consequências maiores do que você esperava." },
  failure: { title: "Não saiu como você esperava", text: "Você encontrou dificuldades, mas a experiência mostrou o que precisa melhorar." },
  partial_success: { title: "Você conseguiu, com alguns tropeços", text: "O resultado foi suficiente para seguir em frente, embora nem tudo tenha funcionado." },
  success: { title: "Você se saiu bem", text: "Sua preparação e suas escolhas ajudaram a situação a terminar de forma positiva." },
  exceptional_success: { title: "Você surpreendeu a todos", text: "O resultado foi melhor do que o esperado e abriu novas possibilidades." }
};
const PROGRESS_STATUS_LABELS = { idle: "Ainda não há escolhas para guardar", saving: "Guardando suas escolhas…", saved: "Escolhas guardadas", error: "Não foi possível guardar suas escolhas" } as const;
type ProgressStatus = keyof typeof PROGRESS_STATUS_LABELS;
const MONEY_FORMATTER = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

function formatMoney(cents: number): string { return MONEY_FORMATTER.format(cents / 100); }
function formatDuration(totalMinutes: number): string {
  if (totalMinutes === 0) return "agora";
  const prefix = totalMinutes < 0 ? "atraso de " : "";
  const absolute = Math.abs(totalMinutes);
  const days = Math.floor(absolute / 1440);
  const hours = Math.floor((absolute % 1440) / 60);
  const minutes = absolute % 60;
  return prefix + [days ? `${days}d` : null, hours ? `${hours}h` : null, minutes ? `${minutes}min` : null].filter(Boolean).join(" ");
}
function formatClock(clock: GameClock): string { return `${formatDatePtBr(clock.date)} às ${formatTime(clock.minuteOfDay)}`; }
function formatCondition(condition: Condition, state: GameState): string {
  if (condition.type === "stat") return `${STAT_LABELS[condition.stat]} deve ser ${condition.operator} ${condition.value}`;
  if (condition.type === "flag") return `${condition.flag} deve ser ${condition.value ? "sim" : "não"}`;
  if (condition.type === "money") return `Dinheiro deve ser ${condition.operator} ${formatMoney(condition.valueCents)}`;
  if (condition.type === "location") return `Local deve ser ${LOCATION_LABELS[condition.value]}`;
  return `${RELATIONSHIP_LABELS[condition.dimension]} com ${state.relationships[condition.relationshipId]?.name ?? "a pessoa"} deve ser ${condition.operator} ${condition.value}`;
}
function formatChange(change: AppliedChange, state: GameState): string | null {
  if (change.type === "stat") return `${STAT_LABELS[change.stat]}: ${change.before} → ${change.after}`;
  if (change.type === "money") return `Dinheiro: ${formatMoney(change.beforeCents)} → ${formatMoney(change.afterCents)}`;
  if (change.type === "flag") return null;
  if (change.type === "clock") return change.before.date === change.after.date ? `Horário: ${formatTime(change.before.minuteOfDay)} → ${formatTime(change.after.minuteOfDay)}` : `Tempo: ${formatClock(change.before)} → ${formatClock(change.after)}`;
  if (change.type === "location") return `Local: ${LOCATION_LABELS[change.before]} → ${LOCATION_LABELS[change.after]}`;
  if (change.type === "relationship") return `${RELATIONSHIP_LABELS[change.dimension]} com ${state.relationships[change.relationshipId]?.name ?? "a pessoa"}: ${change.before} → ${change.after}`;
  if (change.type === "person_category") return `${state.relationships[change.relationshipId]?.name ?? "A pessoa"} passou a ter mais importância na sua vida`;
  return null;
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
    }).catch(() => { if (active) { setProgressStatus("error"); setPersistenceError("Não foi possível recuperar sua história anterior."); setLoading(false); } });
    return () => { active = false; };
  }, [repository]);

  useEffect(() => {
    if (!state) return;
    const revision = ++saveRevision.current;
    setProgressStatus("saving");
    repository.save(SAVE_SLOT, state).then(() => {
      if (revision === saveRevision.current) { setProgressStatus("saved"); setPersistenceError(null); }
    }).catch(() => { if (revision === saveRevision.current) { setProgressStatus("error"); setPersistenceError("Suas escolhas mais recentes não puderam ser guardadas."); } });
  }, [repository, state]);

  async function resetLife(): Promise<void> {
    saveRevision.current += 1;
    await repository.delete(SAVE_SLOT);
    setState(null);
    setProgressStatus("idle");
  }

  if (loading) return <main><div className="shell"><section className="panel">Recuperando sua história…</section></div></main>;

  if (!state) return (
    <main><div className="shell">
      {persistenceError ? <p className="alert">{persistenceError}</p> : null}
      <section className="panel hero"><p className="label">UMA VIDA COMEÇA</p><h1>Vidas Possíveis</h1><p>Crie uma vida e acompanhe como tempo, dinheiro, estudo, família e pessoas mudam o caminho.</p></section>
      <section className="panel"><h2>Nova vida</h2><div className="form-grid">
        <label className="field"><span>Nome</span><input value={name} onChange={(event) => setName(event.target.value)} maxLength={40} /></label>
        <label className="field"><span>Apresentação</span><select value={presentation} onChange={(event) => setPresentation(event.target.value as PlayerProfile["presentation"])}><option value="man">Homem</option><option value="woman">Mulher</option></select></label>
        <label className="field"><span>Origem familiar</span><select value={origin} onChange={(event) => setOrigin(event.target.value as Origin)}>{Object.entries(ORIGIN_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
      </div><div className="form-actions"><button className="primary" disabled={name.trim().length < 2} onClick={() => setState(createGameState({ id: crypto.randomUUID(), name: name.trim(), presentation, origin }))}>Iniciar vida</button></div></section>
    </div></main>
  );

  const node = getStoryNode(state.currentNodeId, state);
  const availability = getChoiceAvailability(state, node);
  const choices = availability.filter((item) => item.available).map((item) => item.choice);
  const blocked = availability.filter((item) => !item.available);
  const latest = state.history.at(-1);
  const commitment = node.nextCommitment;
  const minutesUntil = commitment ? minutesBetweenClocks(state.clock, commitment.clock) : null;
  const visibleChanges = latest?.changes.map((change) => formatChange(change, state)).filter((value): value is string => Boolean(value)) ?? [];
  const skillResult = latest?.skillCheck ? OUTCOME_LABELS[latest.skillCheck.outcome] : null;
  const contextPerson = node.contextPersonId ? state.relationships[node.contextPersonId] : null;
  const people = Object.values(state.relationships).filter((person) => person.category !== "scene");

  return <main><div className="shell">
    {persistenceError ? <p className="alert">{persistenceError}</p> : null}
    <header className="clock" data-testid="game-clock">
      <div><span className="label">Data</span><strong>{formatDatePtBr(state.clock.date)}</strong></div>
      <div><span className="label">Horário</span><strong data-testid="current-time">{formatTime(state.clock.minuteOfDay)}</strong></div>
      <div><span className="label">Local</span><strong>{LOCATION_LABELS[state.location]}</strong></div>
      <div><span className="label">Atividade atual</span><strong>{node.activity}</strong></div>
      <div><span className="label">Próximo compromisso</span><strong>{commitment ? `${commitment.label} · ${formatClock(commitment.clock)}` : "Nenhum compromisso marcado"}</strong></div>
      <div><span className="label">Tempo até compromisso</span><strong data-testid="time-until-commitment">{minutesUntil === null ? "Tempo livre" : formatDuration(minutesUntil)}</strong></div>
    </header>

    <section className="panel hero"><p className="label">{state.player.name} · {ORIGIN_LABELS[state.player.origin]}</p><p className="save-status" data-testid="save-status">Progresso: {PROGRESS_STATUS_LABELS[progressStatus]}</p><h1>{node.title}</h1><p>{node.text}</p>
      {contextPerson ? <details className="relationship-context"><summary>Quem é {contextPerson.name}?</summary><p>{contextPerson.contextSummary}</p><p className="muted">Vocês são conhecidos. O que acontecer agora pode aproximar, afastar ou tornar essa pessoa importante.</p></details> : null}
      {node.ending ? <div><p><strong>Esta etapa da sua história chegou ao fim.</strong> Suas escolhas abriram um caminho para os próximos anos.</p><button className="primary" onClick={() => void resetLife()}>Criar outra vida</button></div> : <div className="choices">{choices.map((choice) => <button className="choice" key={choice.id} onClick={() => setState((current) => current ? chooseStoryOption(current, node, choice.id) : current)}>{choice.label}</button>)}</div>}
    </section>

    {skillResult ? <section className="panel result-card" data-testid="skill-result"><p className="label">COMO A SITUAÇÃO TERMINOU</p><h2>{skillResult.title}</h2><p>{skillResult.text}</p></section> : null}
    {latest?.triggeredConsequences?.map((item) => <section className="panel consequence-card" key={item.id} data-testid="triggered-consequence"><p className="label">UMA ESCOLHA VOLTOU A TER EFEITO</p><h2>{item.title}</h2><p>{item.text.replaceAll("{{groupMate}}", state.relationships["school.groupMate"]?.name ?? "seu colega")}</p></section>)}
    {visibleChanges.length ? <section className="panel"><h2>O que mudou</h2><ul className="change-list">{visibleChanges.map((change, index) => <li key={`${change}-${index}`}>{change}</li>)}</ul></section> : null}

    <section className="panel"><h2>Estado atual</h2><div className="stats-grid">{STAT_KEYS.map((key) => <div className="stat" key={key}><span>{STAT_LABELS[key]}</span><strong>{state.stats[key]}</strong></div>)}<div className="stat"><span>Dinheiro</span><strong>{formatMoney(state.moneyCents)}</strong></div></div></section>

    <section className="panel"><h2>Pessoas na sua vida</h2><div className="relationship-grid">{people.map((person) => <article className="relationship" key={person.id}><h3>{person.name}</h3><p className="muted">{person.role} · {person.category === "important" ? "Pessoa importante" : "Pessoa conhecida"}</p><p>{person.contextSummary}</p><details><summary>Como está a relação</summary><div className="stat"><span>Confiança</span><strong>{person.trust}</strong></div><div className="stat"><span>Proximidade</span><strong>{person.affection}</strong></div><div className="stat"><span>Tensão</span><strong>{person.conflict}</strong></div></details></article>)}</div></section>

    <details className="panel debug"><summary>Informações adicionais</summary>{blocked.length ? <ul data-testid="blocked-choice-reasons">{blocked.map(({ choice, failedConditions }) => <li key={choice.id}>{choice.label}: {failedConditions.map((condition) => formatCondition(condition, state)).join("; ")}</li>)}</ul> : <p>Nenhuma opção indisponível.</p>}</details>
  </div></main>;
}

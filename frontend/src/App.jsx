import React, { useState, useEffect } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  Plus,
  Search,
  SlidersHorizontal,
  ShieldCheck,
  Link2,
  Handshake,
  Lightbulb,
  Heart,
  Coins,
  Check,
  Send,
  Paperclip,
  LockKeyhole,
  Users,
  TrendingUp,
  Clock,
  ChevronRight,
  CheckCircle2,
  Download,
} from "lucide-react";
import Shell from "./layouts/Shell";
import Logo from "./components/Logo";
import { PostCard, Protected, Modal, Empty } from "./components/UI";
import PostForm from "./pages/PostForm";
import Dashboard from "./pages/Dashboard";
import { useDemo } from "./hooks/useDemo";
import { mockApi } from "./services/mockApi";
import { types, categories } from "./mock/data";
export default function App() {
  const { state, act, feedback, setFeedback } = useDemo();
  const [page, setPage] = useState(location.hash.slice(1) || "home");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [modal, setModal] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(
    () => state.rooms.at(-1)?.id || null,
  );
  const [coopTab, setCoopTab] = useState("Em andamento");
  const [mineIdeas, setMineIdeas] = useState(false);
  useEffect(() => {
    const handler = () => setPage(location.hash.slice(1) || "home");
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);
  useEffect(() => {
    if (feedback) {
      const t = setTimeout(() => setFeedback(""), 5000);
      return () => clearTimeout(t);
    }
  }, [feedback]);
  const go = (p) => {
    setPage(p);
    location.hash = p;
    window.scrollTo(0, 0);
  };
  const mutate = (fn, msg) => act(() => mockApi.mutate(fn), msg);
  const requireUser = (fn) => {
    if (!state.authenticated) {
      setModal({ kind: "login" });
      return;
    }
    fn();
  };
  const publish = (type) => requireUser(() => setModal({ kind: "form", type }));
  const support = (p) =>
    requireUser(() =>
      mutate((s) => {
        if (s.supported.includes(p.id)) {
          s.supported = s.supported.filter((id) => id !== p.id);
          s.posts.find((x) => x.id === p.id).supports--;
        } else {
          s.supported.push(p.id);
          s.posts.find((x) => x.id === p.id).supports++;
        }
      }, "Apoio atualizado."),
    );
  const openPost = (p) => setModal({ kind: "post", id: p.id });
  const post = state.posts.find((p) => p.id === modal?.id);
  const room = state.rooms.find((r) => r.id === selectedRoom);
  const privatePage = [
    "profile",
    "publications",
    "cooperations",
    "wallet",
    "privacy",
    "settings",
    "reviews",
    "votes",
    "room",
  ].includes(page);
  const accept = (m) =>
    requireUser(() => {
      act(
        () => mockApi.accept(m.id),
        "Conexão iniciada. Bem-vindo à cooperação protegida.",
      );
      const r = mockApi.load().rooms.find((r) => r.matchId === m.id);
      setSelectedRoom(r.id);
      go("room");
      setModal(null);
    });
  const heading = (eyebrow, title, description) => (
    <div className="page-heading">
      <div className="eyebrow">{eyebrow}</div>
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  );
  const matchCard = (m) => {
    const n = state.posts.find((p) => p.id === m.need),
      o = state.posts.find((p) => p.id === m.offer);
    if (!n || !o) return null;
    return (
      <article className="match-panel" key={m.id}>
        <div className="match-panel-top">
          <span className="badge green">
            <Users size={14} />
            Cooperação intersetorial
          </span>
          <strong>
            {m.score}% <small>de compatibilidade</small>
          </strong>
        </div>
        <div className="match-pair">
          <div>
            <span className="eyebrow">PRECISO · {n.category}</span>
            <h3>{n.title}</h3>
            <small>Participante protegido</small>
          </div>
          <span className="match-link">
            <Link2 />
          </span>
          <div>
            <span className="eyebrow">POSSO COOPERAR · {o.category}</span>
            <h3>{o.title}</h3>
            <small>Participante protegido</small>
          </div>
        </div>
        <div className="match-explanation">
          <strong>Por que combinam?</strong>
          <p>
            Esta oferta possui competências relacionadas à necessidade:{" "}
            {m.tags.join(", ")}. Uma conexão entre {n.category} e {o.category}.
          </p>
        </div>
        <div className="button-row">
          <button
            className="btn secondary"
            onClick={() => setModal({ kind: "compatibility", match: m })}
          >
            Ver compatibilidade
          </button>
          <button className="btn primary" onClick={() => accept(m)}>
            {state.rooms.some((r) => r.matchId === m.id)
              ? "Abrir cooperação"
              : "Quero cooperar"}
            <ArrowRight size={16} />
          </button>
        </div>
      </article>
    );
  };
  const feed = state.posts.filter(
    (p) =>
      (filter === "all" || p.type === filter) &&
      (category === "all" || p.category === category) &&
      `${p.title} ${p.description} ${p.tags.join(" ")}`
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  return (
    <Shell
      page={page}
      go={go}
      state={state}
      login={() =>
        mutate(
          (s) => (s.authenticated = true),
          "Você entrou como usuário demo.",
        )
      }
      logout={() => {
        mutate(
          (s) => (s.authenticated = false),
          "Você está no modo visitante.",
        );
        go("home");
      }}
    >
      {privatePage && !state.authenticated ? (
        <section className="panel login-page">
          <Logo className="login-logo" decorative />
          <LockKeyhole size={36} />
          <h1>Seu espaço de cooperação</h1>
          <p>
            Entre na demonstração para publicar, cooperar e acompanhar suas
            contribuições.
          </p>
          <button
            className="btn primary"
            onClick={() => mutate((s) => (s.authenticated = true))}
          >
            Entrar como usuário demo
          </button>
        </section>
      ) : (
        <>
          {page === "home" && (
            <>
              <section className="hero">
                <div className="hero-copy">
                  <div className="eyebrow">
                    <span /> CONECTAR PARA TRANSFORMAR
                  </div>
                  <h1>
                    Necessidades encontram
                    <br />
                    <em>capacidades.</em>
                  </h1>
                  <p className="hero-subtitle">Ideias encontram colaboração.</p>
                  <p>
                    O Coopera aproxima pessoas, conhecimentos e soluções, com
                    mais isonomia e identidade protegida.
                  </p>
                  <button
                    className="btn primary hero-cta"
                    onClick={() =>
                      document
                        .getElementById("urna-feed")
                        ?.scrollIntoView({
                          behavior: window.matchMedia(
                            "(prefers-reduced-motion: reduce)",
                          ).matches
                            ? "instant"
                            : "smooth",
                          block: "start",
                        })
                    }
                  >
                    Explorar a Urna Coopera <ArrowRight size={18} />
                  </button>
                  <div className="hero-foot">
                    <ShieldCheck size={16} />
                    Identidade protegida. Participação horizontal.
                  </div>
                </div>
                <div className="orbit-art" aria-hidden="true">
                  <div className="orbit orbit-one" />
                  <div className="orbit orbit-two" />
                  <div className="orbit-core">
                    <Users size={48} strokeWidth={1.5} />
                  </div>
                  <span className="orbit-node node-one">
                    <Lightbulb />
                  </span>
                  <span className="orbit-node node-two">
                    <Handshake />
                  </span>
                  <span className="orbit-node node-three">
                    <Link2 />
                  </span>
                  <i className="orbit-dot dot-one" />
                  <i className="orbit-dot dot-two" />
                  <span className="art-label">
                    Diferentes talentos.
                    <br />
                    <b>Novas possibilidades.</b>
                  </span>
                </div>
              </section>
              <section
                className="action-grid"
                aria-label="Contribuir com a comunidade"
              >
                {[
                  [
                    "need",
                    "O que você precisa?",
                    "Preciso",
                    "Publique aquilo de que você precisa.",
                    Plus,
                  ],
                  [
                    "offer",
                    "O que você pode compartilhar?",
                    "Posso cooperar",
                    "Ofereça aquilo com que você pode cooperar.",
                    Handshake,
                  ],
                  [
                    "idea",
                    "E se a gente fizesse diferente?",
                    "Proponho",
                    "Compartilhe uma ideia que merece ser considerada.",
                    Lightbulb,
                  ],
                ].map(([id, q, t, d, Icon]) => (
                  <button
                    key={id}
                    className={"action-card " + types[id].color}
                    onClick={() => publish(id)}
                  >
                    <span className="action-icon">
                      <Icon size={23} />
                    </span>
                    <span>
                      <small>{q}</small>
                      <strong>
                        {t}
                        <ArrowUpRight size={21} />
                      </strong>
                      <p>{d}</p>
                    </span>
                  </button>
                ))}
              </section>
              <section className="impact-strip">
                <span>
                  <span className="live-dot" /> A cooperação acontece aqui
                </span>
                <strong>
                  {427 +
                    state.rooms.filter((r) => r.status === "Concluída")
                      .length}{" "}
                  <small>cooperações concluídas</small>
                </strong>
                <strong>
                  {83 + state.rooms.length}{" "}
                  <small>conexões entre setores</small>
                </strong>
                <strong>
                  12 <small>necessidades resolvidas nesta semana</small>
                </strong>
                <button
                  aria-label="Ver impacto coletivo"
                  onClick={() => go("dashboard")}
                >
                  <ArrowUpRight size={19} />
                </button>
              </section>
              <div className="home-columns" id="urna-feed">
                <section>
                  <div className="section-heading">
                    <div>
                      <h2>O que nos conecta</h2>
                      <p>
                        Necessidades, capacidades e ideias. Todas têm espaço
                        aqui.
                      </p>
                    </div>
                    <span className="live-caption">
                      <span className="live-dot" />
                      Comunidade em movimento
                    </span>
                  </div>
                  <div className="feed-toolbar">
                    <div className="tabs">
                      {[
                        ["all", "Tudo"],
                        ["need", "Preciso"],
                        ["offer", "Posso cooperar"],
                        ["idea", "Proponho"],
                      ].map(([id, t]) => (
                        <button
                          key={id}
                          className={filter === id ? "selected" : ""}
                          onClick={() => setFilter(id)}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                    <div className="search-row">
                      <label className="search-input">
                        <Search size={17} />
                        <input
                          aria-label="Buscar na comunidade"
                          placeholder="Busque por uma necessidade, habilidade ou ideia…"
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                        />
                      </label>
                      <button
                        className="filter-button"
                        onClick={() => setShowFilters(!showFilters)}
                      >
                        <SlidersHorizontal size={16} />
                        Filtros
                      </button>
                    </div>
                    {showFilters && (
                      <label className="category-select">
                        Categoria
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                        >
                          <option value="all">Todas as áreas</option>
                          {categories.map((c) => (
                            <option key={c}>{c}</option>
                          ))}
                        </select>
                      </label>
                    )}
                  </div>
                  <div className="posts-grid">
                    {feed.map((p) => (
                      <PostCard
                        key={p.id}
                        post={p}
                        onOpen={openPost}
                        onSupport={support}
                      />
                    ))}
                  </div>
                  {!feed.length && (
                    <Empty text="Nenhuma contribuição encontrada. Tente outra busca." />
                  )}
                </section>
                <aside className="right-rail">
                  <section className="suggestion">
                    <div className="rail-title">
                      <span className="rail-icon">
                        <Link2 size={18} />
                      </span>
                      <h3>Uma conexão possível</h3>
                      <span className="new-dot" />
                    </div>
                    <p>
                      Talentos diferentes.
                      <br />
                      Um desafio em comum.
                    </p>
                    <div className="suggestion-item">
                      <span className="badge blue">Preciso</span>
                      <h4>Otimizar o controle de equipamentos</h4>
                      <small>Administração</small>
                    </div>
                    <div className="compatibility">
                      <span />
                      <Link2 size={16} />
                      <strong>92% de compatibilidade</strong>
                      <span />
                    </div>
                    <div className="suggestion-item">
                      <span className="badge green">Posso cooperar</span>
                      <h4>Automação de inventário e QR Code</h4>
                      <small>Tecnologia</small>
                    </div>
                    <div className="intersector">
                      <Users size={14} />
                      Cooperação intersetorial
                    </div>
                    <button
                      className="btn primary"
                      onClick={() => go("matches")}
                    >
                      Conhecer esse match
                      <ArrowRight size={16} />
                    </button>
                    <small className="protected-small">
                      <ShieldCheck size={13} />
                      Identidades protegidas
                    </small>
                  </section>
                  <section className="idea-note">
                    <Lightbulb size={24} />
                    <h3>Boas ideias não têm cargo.</h3>
                    <p>
                      Aqui, o que importa é o potencial de uma ideia. A autoria
                      pode esperar.
                    </p>
                    <button onClick={() => go("ideas")}>
                      Explore a urna de ideias
                      <ArrowUpRight size={16} />
                    </button>
                  </section>
                  <div className="rail-quote">
                    “Primeiro o mérito,
                    <br />
                    depois a identidade.”
                  </div>
                </aside>
              </div>
            </>
          )}
          {page === "matches" && (
            <>
              {heading(
                "CONEXÕES COM PROPÓSITO",
                "Existe uma combinação possível.",
                "Competências e necessidades se aproximam, mesmo em setores diferentes.",
              )}
              <Protected />
              {state.matches.map(matchCard)}
            </>
          )}
          {page === "ideas" && (
            <>
              {heading(
                "URNA DE IDEIAS",
                "Boas ideias merecem circular.",
                "A ideia deve ser conhecida antes de seu autor.",
              )}
              <div className="button-row space-between">
                <label className="checkbox">
                  <input
                    type="checkbox"
                    checked={mineIdeas}
                    onChange={(e) => setMineIdeas(e.target.checked)}
                  />
                  Somente minhas ideias
                </label>
                <button className="btn primary" onClick={() => publish("idea")}>
                  <Plus size={16} />
                  Propor uma ideia
                </button>
              </div>
              <div className="posts-grid three">
                {state.posts
                  .filter((p) => p.type === "idea" && (!mineIdeas || p.mine))
                  .map((p) => (
                    <PostCard
                      key={p.id}
                      post={p}
                      onOpen={openPost}
                      onSupport={support}
                    />
                  ))}
              </div>
            </>
          )}
          {page === "publications" && (
            <>
              {heading(
                "MEU ESPAÇO",
                "Minhas publicações",
                "Contribuições que abrem caminhos para a cooperação.",
              )}
              <div className="button-row">
                {Object.entries(types).map(([k, v]) => (
                  <button
                    className="btn secondary"
                    key={k}
                    onClick={() => publish(k)}
                  >
                    <Plus size={16} />
                    {v.label}
                  </button>
                ))}
              </div>
              {Object.entries(types).map(([key, t]) => (
                <section key={key}>
                  <h2>{t.label}</h2>
                  {state.posts
                    .filter((p) => p.mine && p.type === key)
                    .map((p) => (
                      <div className="publication-row" key={p.id}>
                        <div>
                          <button
                            className="text-button"
                            onClick={() => openPost(p)}
                          >
                            {p.title}
                          </button>
                          <small>
                            {p.status} · {p.date}
                          </small>
                        </div>
                        <div className="button-row">
                          <button
                            onClick={() =>
                              setModal({ kind: "form", type: p.type, post: p })
                            }
                          >
                            Editar
                          </button>
                          <button
                            onClick={() =>
                              mutate(
                                (s) =>
                                  (s.posts.find((x) => x.id === p.id).status =
                                    p.status === "Encerrada"
                                      ? p.type === "need"
                                        ? "Aberta"
                                        : p.type === "offer"
                                          ? "Disponível"
                                          : "Em discussão"
                                      : "Encerrada"),
                                "Publicação atualizada.",
                              )
                            }
                          >
                            {p.status === "Encerrada" ? "Reabrir" : "Encerrar"}
                          </button>
                          <button
                            className="danger"
                            onClick={() =>
                              setModal({ kind: "delete", id: p.id })
                            }
                          >
                            Excluir
                          </button>
                        </div>
                      </div>
                    ))}
                  {!state.posts.some((p) => p.mine && p.type === key) && (
                    <Empty />
                  )}
                </section>
              ))}
            </>
          )}
          {page === "cooperations" && (
            <>
              {heading(
                "CONSTRUIR EM CONJUNTO",
                "Minhas cooperações",
                "Da primeira conexão a uma transformação concreta.",
              )}
              <div className="tabs wide">
                {[
                  "Interesses enviados",
                  "Interesses recebidos",
                  "Em andamento",
                  "Concluídas",
                ].map((t) => (
                  <button
                    key={t}
                    className={coopTab === t ? "selected" : ""}
                    onClick={() => setCoopTab(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
              {coopTab === "Interesses recebidos" ? (
                <section className="panel">
                  <span className="badge green">Novo interesse</span>
                  <h3>Uma comunicação mais acessível para todos</h3>
                  <p>
                    Participante protegido quer contribuir com a revisão dos
                    materiais.
                  </p>
                  <button
                    className="btn primary"
                    onClick={() => accept(state.matches[1])}
                  >
                    Aceitar e cooperar
                  </button>
                </section>
              ) : (
                <>
                  {state.rooms
                    .filter(
                      (r) =>
                        coopTab === "Interesses enviados" ||
                        r.status ===
                          (coopTab === "Concluídas"
                            ? "Concluída"
                            : "Em andamento"),
                    )
                    .map((r) => (
                      <button
                        className="room-row"
                        key={r.id}
                        onClick={() => {
                          setSelectedRoom(r.id);
                          go("room");
                        }}
                      >
                        <span className="room-icon">
                          <Handshake />
                        </span>
                        <div>
                          <strong>{r.title}</strong>
                          <small>
                            {r.status} · Cooperação{" "}
                            {r.identity === "revealed"
                              ? "identificada"
                              : "protegida"}
                          </small>
                        </div>
                        <ArrowRight size={18} />
                      </button>
                    ))}
                  {!state.rooms.some(
                    (r) =>
                      coopTab === "Interesses enviados" ||
                      r.status ===
                        (coopTab === "Concluídas"
                          ? "Concluída"
                          : "Em andamento"),
                  ) && (
                    <Empty text="Sua próxima cooperação começa com um match." />
                  )}
                </>
              )}
            </>
          )}
          {page === "room" &&
            (room ? (
              <>
                {heading(
                  "SALA DE COOPERAÇÃO",
                  room.title,
                  "Participante A + Participante B · Uma conexão entre setores",
                )}
                <Protected>
                  {room.identity === "revealed"
                    ? "Cooperação identificada · Consentimento registrado pelas duas partes."
                    : "Cooperação protegida · A identidade aparece somente com consentimento."}
                </Protected>
                <div className="two-cols room-layout">
                  <section className="panel">
                    <h2>Conversa</h2>
                    <div className="messages">
                      {room.messages.map((m) => (
                        <div
                          className={
                            "message " +
                            (m.author === "Participante A" ? "mine" : "")
                          }
                          key={m.id}
                        >
                          <small>
                            {room.identity === "revealed"
                              ? m.author === "Participante A"
                                ? "Usuário de Demonstração"
                                : "Cooperador de Demonstração"
                              : m.author}
                          </small>
                          <p>{m.text}</p>
                        </div>
                      ))}
                    </div>
                    <form
                      className="message-form"
                      onSubmit={(e) => {
                        e.preventDefault();
                        const f = e.currentTarget;
                        const text = new FormData(f).get("message").trim();
                        if (!text) return;
                        act(() =>
                          mockApi.room(room.id, (r) => {
                            r.messages.push({
                              id: crypto.randomUUID(),
                              author: "Participante A",
                              text,
                            });
                            r.history.push(
                              "Mensagem enviada pelo Participante A.",
                            );
                          }),
                        );
                        f.reset();
                      }}
                    >
                      <input
                        name="message"
                        required
                        aria-label="Mensagem"
                        placeholder="Escreva uma mensagem…"
                      />
                      <button
                        className="btn primary"
                        aria-label="Enviar mensagem"
                      >
                        <Send size={17} />
                      </button>
                    </form>
                    <h3>Arquivos simulados</h3>
                    {room.files.map((f, i) => (
                      <p key={i}>
                        <Paperclip size={14} />
                        {f} <small>· referência local, sem upload</small>
                      </p>
                    ))}
                    <label className="file-button">
                      <Paperclip size={16} />
                      Adicionar arquivo
                      <input
                        type="file"
                        onChange={(e) => {
                          const f = e.target.files[0];
                          if (f)
                            act(
                              () =>
                                mockApi.room(room.id, (r) => {
                                  r.files.push(f.name);
                                  r.history.push(
                                    "Arquivo simulado adicionado.",
                                  );
                                }),
                              "Arquivo adicionado como referência.",
                            );
                        }}
                      />
                    </label>
                  </section>
                  <section className="panel">
                    <span className="badge green">{room.status}</span>
                    <h3>Próximos passos</h3>
                    {room.tasks.map((t) => (
                      <label className="task" key={t.id}>
                        <input
                          type="checkbox"
                          checked={t.done}
                          onChange={() =>
                            act(() =>
                              mockApi.room(
                                room.id,
                                (r) =>
                                  (r.tasks.find((x) => x.id === t.id).done =
                                    !t.done),
                              ),
                            )
                          }
                        />
                        {t.text}
                      </label>
                    ))}
                    <form
                      className="message-form"
                      onSubmit={(e) => {
                        e.preventDefault();
                        const f = e.currentTarget;
                        const text = new FormData(f).get("task").trim();
                        if (text)
                          act(() =>
                            mockApi.room(room.id, (r) =>
                              r.tasks.push({
                                id: crypto.randomUUID(),
                                text,
                                done: false,
                              }),
                            ),
                          );
                        f.reset();
                      }}
                    >
                      <input
                        name="task"
                        aria-label="Nova tarefa"
                        placeholder="Nova tarefa"
                        required
                      />
                      <button
                        className="icon-btn"
                        aria-label="Adicionar tarefa"
                      >
                        <Plus />
                      </button>
                    </form>
                    <p>
                      <Clock size={15} /> Prazo: {room.deadline}
                    </p>
                    <p>
                      <Coins size={15} /> Recompensa: {room.reward} créditos
                    </p>
                    {room.status !== "Concluída" ? (
                      <button
                        className="btn primary full"
                        onClick={() =>
                          act(
                            () => mockApi.finish(room.id),
                            `Cooperação concluída. ${room.reward} créditos transferidos ao cooperador.`,
                          )
                        }
                      >
                        Concluir cooperação
                        <Check size={16} />
                      </button>
                    ) : (
                      <div className="protection">
                        Cooperação concluída. {room.reward} créditos
                        transferidos ao cooperador.
                      </div>
                    )}
                    <hr />
                    <h3>Identidade e consentimento</h3>
                    {room.identity === "protected" && (
                      <button
                        className="btn secondary full"
                        disabled={!state.privacy.requests}
                        onClick={() =>
                          act(() =>
                            mockApi.room(room.id, (r) => {
                              r.identity = "pending";
                              r.history.push(
                                "Participante A solicitou revelação e consentiu em compartilhar sua identidade.",
                              );
                            }),
                          )
                        }
                      >
                        Solicitar revelação de identidade
                      </button>
                    )}
                    {room.identity === "pending" && (
                      <div className="consent">
                        <p>
                          Simular resposta do Participante B. Aceitar revela os
                          nomes fictícios às duas partes.
                        </p>
                        <div className="button-row">
                          <button
                            className="btn primary"
                            onClick={() =>
                              act(() =>
                                mockApi.room(room.id, (r) => {
                                  r.identity = "revealed";
                                  r.history.push(
                                    "Participante B aceitou. Consentimento bilateral registrado.",
                                  );
                                }),
                              )
                            }
                          >
                            Aceitar
                          </button>
                          <button
                            className="btn secondary"
                            onClick={() =>
                              act(() =>
                                mockApi.room(room.id, (r) => {
                                  r.identity = "protected";
                                  r.history.push(
                                    "Solicitação recusada. Identidades continuam protegidas.",
                                  );
                                }),
                              )
                            }
                          >
                            Recusar
                          </button>
                        </div>
                      </div>
                    )}
                    {room.identity === "revealed" && (
                      <p>
                        Usuário de Demonstração ↔ Cooperador de Demonstração
                      </p>
                    )}
                    <h3>Histórico</h3>
                    <ul className="history">
                      {room.history.map((h, i) => (
                        <li key={i}>{h}</li>
                      ))}
                    </ul>
                  </section>
                </div>
              </>
            ) : (
              <Empty text="Selecione uma sala em Minhas cooperações." />
            ))}
          {page === "dashboard" && <Dashboard state={state} />}
          {page === "wallet" && (
            <>
              {heading(
                "CARTEIRA COOPERA",
                "Reconhecer também é cooperar.",
                "Créditos recompensam cooperações. Pontos reconhecem contribuições.",
              )}
              <div className="wallet-grid">
                <section className="balance">
                  <span>SEU SALDO DISPONÍVEL</span>
                  <strong>
                    {state.wallet.balance.toLocaleString("pt-BR")}{" "}
                    <small>créditos</small>
                  </strong>
                  <p>
                    <ShieldCheck size={16} />
                    Recompensas com identidade protegida
                  </p>
                </section>
                <section className="panel">
                  <small>PONTOS DE CONTRIBUIÇÃO</small>
                  <h2>480 pontos</h2>
                  <p>
                    Reconhecimento sem valor financeiro. Não alteram alcance,
                    prioridade ou peso do voto. Sem ranking público.
                  </p>
                </section>
              </div>
              <div className="mini-metrics panel">
                {[
                  [
                    "Créditos recebidos",
                    state.wallet.transactions
                      .filter((t) => t.amount > 0)
                      .reduce((a, t) => a + t.amount, 0),
                  ],
                  [
                    "Créditos enviados",
                    -state.wallet.transactions
                      .filter((t) => t.amount < 0)
                      .reduce((a, t) => a + t.amount, 0),
                  ],
                  ["Recompensas pendentes", state.wallet.pending],
                  ["Créditos bloqueados", state.wallet.locked],
                ].map(([l, v]) => (
                  <div key={l}>
                    <strong>{v}</strong>
                    <small>{l}</small>
                  </div>
                ))}
              </div>
              <section className="panel">
                <div className="section-heading">
                  <h2>Histórico e extrato</h2>
                  <button
                    className="btn secondary"
                    onClick={() => {
                      const blob = new Blob(
                        [
                          "Data;Descrição;Créditos\n" +
                            state.wallet.transactions
                              .map(
                                (t) =>
                                  `${t.date};${t.label.replaceAll(";", ",")};${t.amount}`,
                              )
                              .join("\n"),
                        ],
                        { type: "text/csv;charset=utf-8" },
                      );
                      const a = document.createElement("a");
                      a.href = URL.createObjectURL(blob);
                      a.download = "coopera-extrato.csv";
                      a.click();
                      URL.revokeObjectURL(a.href);
                    }}
                  >
                    <Download size={16} />
                    Exportar extrato
                  </button>
                </div>
                {state.wallet.transactions.map((t) => (
                  <div className="transaction" key={t.id}>
                    <span className="transaction-icon">
                      <Coins size={18} />
                    </span>
                    <div>
                      <strong>{t.label}</strong>
                      <small>{t.date}</small>
                    </div>
                    <b className={t.amount > 0 ? "positive" : ""}>
                      {t.amount > 0 ? "+" : ""}
                      {t.amount}
                    </b>
                  </div>
                ))}
              </section>
            </>
          )}
          {page === "profile" && (
            <>
              {heading(
                "MEU PERFIL",
                "Uma identidade. Contextos diferentes.",
                "Responsabilidade preservada, exposição controlada.",
              )}
              <div className="two-cols">
                <section className="panel">
                  <span className="badge blue">IDENTIDADE CADASTRADA</span>
                  <h2>{state.user.name}</h2>
                  <p>
                    Utilizada internamente para autenticação, segurança e
                    responsabilização.
                  </p>
                  <small>
                    Dados inteiramente fictícios nesta demonstração.
                  </small>
                </section>
                <section className="panel">
                  <span className="badge green">IDENTIDADE PÚBLICA</span>
                  <h2>Participante protegido</h2>
                  <p>
                    Utilizada nas contribuições quando a identificação não é
                    necessária.
                  </p>
                  <Protected>
                    Nome, cargo e posição hierárquica não acompanham publicações
                    públicas.
                  </Protected>
                </section>
              </div>
            </>
          )}
          {page === "privacy" && (
            <>
              {heading(
                "PRIVACIDADE POR PRINCÍPIO",
                "Você decide quando se identificar.",
                "Primeiro a necessidade, a capacidade ou a ideia. A identidade, somente quando necessária.",
              )}
              <section className="panel">
                {[
                  ["protected", "Manter identidade protegida por padrão"],
                  ["requests", "Permitir solicitação de revelação"],
                  [
                    "profile",
                    "Permitir compartilhar informações do perfil após consentimento",
                  ],
                ].map(([key, label]) => (
                  <label className="setting-row" key={key}>
                    <span>
                      {label}
                      <small>
                        {key === "protected"
                          ? "As publicações desta demonstração permanecem protegidas. A revelação ocorre apenas na sala, com consentimento."
                          : "Preferência simulada, salva neste navegador."}
                      </small>
                    </span>
                    <input
                      type="checkbox"
                      role="switch"
                      checked={state.privacy[key]}
                      onChange={(e) =>
                        mutate(
                          (s) => (s.privacy[key] = e.target.checked),
                          "Preferência salva.",
                        )
                      }
                    />
                  </label>
                ))}
              </section>
              <div className="two-cols">
                <section className="panel">
                  <h2>Consentimentos e revelações</h2>
                  {state.rooms
                    .filter((r) => r.identity !== "protected")
                    .map((r) => (
                      <p key={r.id}>
                        {r.title} ·{" "}
                        {r.identity === "revealed"
                          ? "Consentimento bilateral registrado"
                          : "Aguardando consentimento"}
                      </p>
                    ))}
                  {!state.rooms.some((r) => r.identity !== "protected") && (
                    <p>Nenhum consentimento ou revelação registrado.</p>
                  )}
                </section>
                <section className="panel">
                  <h2>Sessões</h2>
                  <p>
                    <span className="live-dot" />
                    Navegador atual · Sessão demo local
                  </p>
                  <small>Não há autenticação nem transmissão de dados.</small>
                </section>
              </div>
            </>
          )}
          {page === "settings" && (
            <>
              {heading(
                "CONFIGURAÇÕES",
                "Seu ambiente de demonstração.",
                "Experimente os fluxos e recomece quando quiser.",
              )}
              <section className="panel">
                <h2>Dados salvos neste navegador</h2>
                <p>
                  Publicações, conversas, avaliações, votos e créditos persistem
                  no localStorage.
                </p>
                <button
                  className="btn secondary danger"
                  onClick={() => setModal({ kind: "reset" })}
                >
                  Reiniciar demonstração
                </button>
              </section>
            </>
          )}
          {(page === "reviews" || page === "votes") && (
            <>
              {heading(
                page === "reviews"
                  ? "AVALIAÇÃO CEGA"
                  : "PARTICIPAÇÃO HORIZONTAL",
                page === "reviews"
                  ? "Primeiro o mérito, depois a identidade."
                  : "Uma pessoa. Uma participação.",
                page === "reviews"
                  ? "Avalie o potencial coletivo sem conhecer a autoria."
                  : "Registro de participação separado do conteúdo do voto.",
              )}
              <div className="posts-grid">
                {state.posts
                  .filter((p) => p.type === "idea")
                  .map((p) => (
                    <section className="panel" key={p.id}>
                      <span className="badge gold">Participante protegido</span>
                      <h2>{p.title}</h2>
                      <p>{p.description}</p>
                      <button
                        className="btn primary"
                        onClick={() =>
                          setModal({
                            kind: page === "reviews" ? "review" : "vote",
                            id: p.id,
                          })
                        }
                      >
                        {page === "reviews"
                          ? state.reviews[p.id]
                            ? "Ver / editar avaliação"
                            : "Avaliar ideia"
                          : state.votes[p.id]
                            ? "Ver resultado"
                            : "Participar da votação"}
                      </button>
                    </section>
                  ))}
              </div>
            </>
          )}
          {page === "ombudsman" && (
            <>
              {heading(
                "APLICAÇÕES → OUVIDORIA",
                "Escuta responsável, identidade protegida.",
                "Uma aplicação do princípio de proteção do Coopera.",
              )}
              <section className="panel">
                <div className="flow">
                  {[
                    "Manifestante",
                    "Coopera",
                    "Ouvidoria / Triagem",
                    "Setor responsável",
                    "Providência",
                    "Resposta",
                  ].map((v, i) => (
                    <React.Fragment key={v}>
                      <span>{v}</span>
                      {i < 5 && <ArrowRight size={18} />}
                    </React.Fragment>
                  ))}
                </div>
                <Protected>
                  O setor recebe o problema e as informações necessárias, sem
                  receber automaticamente a identidade do manifestante.
                </Protected>
                <p>
                  Fluxo demonstrativo. Esta tela não recebe manifestações reais.
                </p>
              </section>
            </>
          )}
        </>
      )}
      {feedback && (
        <div className="toast" role="status">
          <CheckCircle2 size={19} />
          {feedback}
          <button aria-label="Fechar mensagem" onClick={() => setFeedback("")}>
            ×
          </button>
        </div>
      )}
      {modal && (
        <Modal
          title={
            {
              form: modal.post ? "Editar publicação" : "Uma nova contribuição",
              post: "Contribuição da comunidade",
              compatibility: "Uma conexão com potencial",
              login: "Entre para participar",
              delete: "Excluir publicação?",
              reset: "Reiniciar demonstração?",
              review: "Avaliação cega",
              vote: "Votação protegida",
            }[modal.kind]
          }
          close={() => setModal(null)}
        >
          {modal.kind === "form" && (
            <PostForm
              post={modal.post}
              type={modal.type}
              onSave={(p) => {
                act(
                  () => mockApi.publish(p),
                  "Publicação salva com identidade protegida.",
                );
                setModal(null);
              }}
            />
          )}
          {modal.kind === "login" && (
            <>
              <Logo className="login-logo" decorative />
              <p>
                Experimente todos os fluxos com uma conta fictícia. Não é
                necessário cadastro.
              </p>
              <button
                className="btn primary"
                onClick={() => {
                  mutate(
                    (s) => (s.authenticated = true),
                    "Bem-vindo à demonstração.",
                  );
                  setModal(null);
                }}
              >
                Entrar como usuário demo
              </button>
            </>
          )}
          {modal.kind === "compatibility" && (
            <>
              <div className="compat-score">{modal.match.score}%</div>
              <h3>Por que combinam?</h3>
              <p>
                Competências em comum: {modal.match.tags.join(", ")}. A
                necessidade e a oferta pertencem a setores diferentes.
              </p>
              <Protected />
              <p>A compatibilidade é ilustrativa, baseada em dados mockados.</p>
              <button
                className="btn primary"
                onClick={() => accept(modal.match)}
              >
                Quero cooperar
                <ArrowRight size={17} />
              </button>
            </>
          )}
          {modal.kind === "post" && post && (
            <>
              <span className={"badge " + types[post.type].color}>
                {types[post.type].label} · {post.category}
              </span>
              <h2>{post.title}</h2>
              <p>{post.description}</p>
              <div className="tags">
                {post.tags.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
              <p>
                {post.status} · {post.matches} matches
                {post.reward > 0 && ` · ${post.reward} créditos de recompensa`}
              </p>
              {[
                ["Competências", post.skills],
                ["Recursos", post.resources],
                ["Urgência", post.urgency],
                ["Prazo", post.deadline],
                ["Localização", post.location],
                ["Disponibilidade", post.availability],
                ["Contribuição", post.kind],
              ]
                .filter(([, v]) => v)
                .map(([l, v]) => (
                  <p key={l}>
                    <strong>{l}:</strong> {v}
                  </p>
                ))}
              <Protected>Participante protegido</Protected>
              {post.type === "idea" ? (
                <>
                  <div className="button-row">
                    <button
                      className="btn secondary"
                      onClick={() => support(post)}
                    >
                      <Heart size={16} />
                      {state.supported.includes(post.id)
                        ? "Apoiado"
                        : "Apoiar"}{" "}
                      · {post.supports}
                    </button>
                    <button
                      className="btn secondary"
                      onClick={() =>
                        requireUser(() =>
                          setModal({ kind: "review", id: post.id }),
                        )
                      }
                    >
                      Avaliar
                    </button>
                    <button
                      className="btn primary"
                      onClick={() =>
                        requireUser(() =>
                          setModal({ kind: "vote", id: post.id }),
                        )
                      }
                    >
                      Votar
                    </button>
                    <button
                      className="btn secondary"
                      onClick={() =>
                        requireUser(() =>
                          mutate((s) => {
                            if (!s.collaborators.includes(post.id))
                              s.collaborators.push(post.id);
                          }, "Você se tornou colaborador desta ideia."),
                        )
                      }
                    >
                      {state.collaborators.includes(post.id)
                        ? "Você é colaborador"
                        : "Quero colaborar"}
                    </button>
                  </div>
                  <h3>Conversa sobre a ideia</h3>
                  {(state.comments[post.id] || []).map((c, i) => (
                    <div className="comment" key={i}>
                      <small>Participante protegido · {c.kind}</small>
                      <p>{c.text}</p>
                    </div>
                  ))}
                  <form
                    className="form"
                    onSubmit={(e) => {
                      e.preventDefault();
                      const form = e.currentTarget;
                      const data = Object.fromEntries(new FormData(form));
                      requireUser(() => {
                        mutate((s) => {
                          s.comments[post.id] ||= [];
                          s.comments[post.id].push(data);
                        }, "Contribuição registrada.");
                        form.reset();
                      });
                    }}
                  >
                    <select name="kind" aria-label="Tipo de contribuição">
                      <option>Comentário</option>
                      <option>Pergunta</option>
                      <option>Contribuição</option>
                    </select>
                    <textarea
                      name="text"
                      required
                      placeholder="Acrescente uma perspectiva…"
                      aria-label="Sua contribuição"
                    />
                    <button className="btn primary">Enviar contribuição</button>
                  </form>
                </>
              ) : (
                <button
                  className="btn primary"
                  onClick={() => {
                    setModal(null);
                    go("matches");
                  }}
                >
                  Explorar matches
                  <ArrowRight size={16} />
                </button>
              )}
            </>
          )}
          {modal.kind === "review" && (
            <form
              className="form"
              onSubmit={(e) => {
                e.preventDefault();
                const values = Object.fromEntries(
                  new FormData(e.currentTarget),
                );
                act(
                  () => mockApi.review(modal.id, values),
                  "Avaliação salva. A autoria permanece protegida.",
                );
                setModal(null);
              }}
            >
              <Protected>Primeiro o mérito, depois a identidade.</Protected>
              <h3>{post?.title}</h3>
              {[
                "Benefício coletivo",
                "Viabilidade",
                "Impacto",
                "Urgência",
                "Custo estimado",
              ].map((c) => (
                <label className="rating" key={c}>
                  {c}
                  <select
                    name={c}
                    defaultValue={state.reviews[modal.id]?.[c] ?? 5}
                  >
                    {Array.from({ length: 11 }, (_, i) => (
                      <option key={i} value={i}>
                        {i} / 10
                      </option>
                    ))}
                  </select>
                </label>
              ))}
              <small>
                Custo estimado: 0 = custo mínimo; 10 = custo elevado.
              </small>
              <button className="btn primary">Salvar avaliação</button>
            </form>
          )}
          {modal.kind === "vote" && (
            <>
              <Protected>
                Votação protegida · Todos os votos têm o mesmo peso.
              </Protected>
              <h3>{post?.title}</h3>
              <div className="two-cols">
                <div className="vote-box">
                  <LockKeyhole size={20} />
                  <h4>Registro de participação</h4>
                  <p>
                    {state.votes[modal.id]
                      ? "Sua participação foi registrada."
                      : "Você ainda não participou."}
                  </p>
                </div>
                <div className="vote-box">
                  <ShieldCheck size={20} />
                  <h4>Conteúdo do voto</h4>
                  <p>
                    Apenas totais agregados. Nenhuma alternativa é vinculada ao
                    participante.
                  </p>
                </div>
              </div>
              {state.votes[modal.id] ? (
                <>
                  {["Implementar", "Realizar um piloto", "Reavaliar"].map(
                    (label, i) => (
                      <div className="result-row" key={label}>
                        <span>{label}</span>
                        <strong>
                          {(state.voteTotals?.[modal.id] || [12, 5, 3])[i]}{" "}
                          votos
                        </strong>
                      </div>
                    ),
                  )}
                </>
              ) : (
                <div className="form">
                  <p>Como devemos avançar com esta ideia?</p>
                  {["Implementar", "Realizar um piloto", "Reavaliar"].map(
                    (label, i) => (
                      <button
                        className="btn secondary"
                        key={label}
                        onClick={() =>
                          act(
                            () => mockApi.vote(modal.id, i),
                            "Voto registrado de forma protegida.",
                          )
                        }
                      >
                        {label}
                        <ArrowRight size={16} />
                      </button>
                    ),
                  )}
                </div>
              )}
            </>
          )}
          {modal.kind === "delete" && (
            <>
              <p>Esta publicação será removida da demonstração.</p>
              <button
                className="btn primary"
                onClick={() => {
                  mutate(
                    (s) => (s.posts = s.posts.filter((p) => p.id !== modal.id)),
                    "Publicação excluída.",
                  );
                  setModal(null);
                }}
              >
                Confirmar exclusão
              </button>
            </>
          )}
          {modal.kind === "reset" && (
            <>
              <p>
                Isso remove as alterações locais e restaura os exemplos
                iniciais, incluindo votos, conversas e carteira.
              </p>
              <button
                className="btn primary"
                onClick={() => {
                  act(() => mockApi.reset(), "Demonstração reiniciada.");
                  setModal(null);
                  setSelectedRoom(null);
                  go("home");
                }}
              >
                Restaurar dados iniciais
              </button>
            </>
          )}
        </Modal>
      )}
    </Shell>
  );
}

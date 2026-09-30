import React from "react";
export default function Dashboard({ state }) {
  const done = state.rooms.filter((r) => r.status === "Concluída").length;
  return (
    <>
      <div className="page-heading">
        <div className="eyebrow">NOSSO IMPACTO</div>
        <h1>Quando cooperamos, avançamos.</h1>
        <p>Resultados coletivos. Cada conexão faz parte dessa história.</p>
      </div>
      <div className="metrics">
        {[
          ["Cooperações concluídas", 427 + done],
          ["Conexões intersetoriais", 83 + state.rooms.length],
          [
            "Ideias apresentadas",
            state.posts.filter((p) => p.type === "idea").length + 64,
          ],
          [
            "Créditos distribuídos",
            (
              12400 +
              state.wallet.transactions
                .filter((t) => t.date === "Agora")
                .reduce((a, t) => a + t.amount, 0)
            ).toLocaleString("pt-BR"),
          ],
        ].map(([label, value]) => (
          <div className="metric" key={label}>
            <small>{label}</small>
            <strong>{value}</strong>
            <span>Construído pela comunidade</span>
          </div>
        ))}
      </div>
      <div className="two-cols">
        <section className="panel">
          <h2>Conexões além dos setores</h2>
          <p>Conhecimento circulando em todas as direções.</p>
          <svg
            className="network"
            viewBox="0 0 460 260"
            role="img"
            aria-label="Rede de cooperação entre TI, Engenharia, Pessoas, Qualidade, Administração e Assistência"
          >
            <g stroke="var(--coopera-connection)" strokeWidth="2">
              {[
                [95, 45, 360, 45],
                [95, 45, 95, 215],
                [360, 45, 360, 215],
                [95, 130, 360, 130],
                [95, 215, 360, 215],
                [95, 45, 360, 215],
                [360, 45, 95, 215],
              ].map((l, i) => (
                <line key={i} x1={l[0]} y1={l[1]} x2={l[2]} y2={l[3]} />
              ))}
            </g>
            {[
              ["TI", 95, 45],
              ["Engenharia", 360, 45],
              ["Pessoas", 95, 130],
              ["Qualidade", 360, 130],
              ["Administração", 95, 215],
              ["Assistência", 360, 215],
            ].map(([label, x, y]) => (
              <g key={label}>
                <rect
                  x={x - 66}
                  y={y - 20}
                  width="132"
                  height="40"
                  rx="10"
                  fill="var(--coopera-blue-soft)"
                />
                <text
                  x={x}
                  y={y + 5}
                  textAnchor="middle"
                  fill="var(--coopera-primary)"
                  fontSize="13"
                >
                  {label}
                </text>
              </g>
            ))}
          </svg>
        </section>
        <section className="panel">
          <h2>Onde podemos fazer a diferença</h2>
          <p>Áreas com maior demanda</p>
          {[
            ["Administração", 82],
            ["Assistência", 66],
            ["Tecnologia", 48],
            ["Engenharia", 35],
          ].map(([n, v]) => (
            <div className="bar-row" key={n}>
              <span>{n}</span>
              <div>
                <i style={{ width: v + "%" }} />
              </div>
              <b>{v}</b>
            </div>
          ))}
          <h3>Competências mais procuradas</h3>
          <div className="tags">
            <span>Automação</span>
            <span>Comunicação</span>
            <span>Análise de dados</span>
          </div>
        </section>
      </div>
      <section className="panel">
        <h2>O movimento da comunidade</h2>
        <div className="mini-metrics">
          {[
            [
              "Necessidades abertas",
              state.posts.filter(
                (p) => p.type === "need" && p.status !== "Encerrada",
              ).length,
            ],
            [
              "Ofertas disponíveis",
              state.posts.filter((p) => p.type === "offer").length,
            ],
            ["Matches sugeridos", state.matches.length],
            ["Matches aceitos", state.rooms.length],
            ["Cooperações iniciadas", state.rooms.length],
            ["Propostas implementadas", 16],
            ["Tempo médio até match", "2,4 dias"],
            ["Resolvidas na semana", 12 + done],
          ].map(([l, v]) => (
            <div key={l}>
              <strong>{v}</strong>
              <small>{l}</small>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

import React from "react";
import { Protected } from "../components/UI";
import { categories, types } from "../mock/data";
export default function PostForm({ post, type, onSave }) {
  return (
    <form
      className="form"
      onSubmit={(e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.currentTarget));
        onSave({
          ...post,
          ...data,
          type,
          tags: data.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
          reward: Number(data.reward || 0),
        });
      }}
    >
      <p>
        {type === "idea"
          ? "A ideia deve ser conhecida antes de seu autor."
          : "Uma boa conexão começa com uma contribuição."}
      </p>
      <label>
        Título
        <input
          name="title"
          required
          maxLength={120}
          defaultValue={post?.title}
          placeholder={
            type === "need"
              ? "O que você precisa?"
              : type === "offer"
                ? "Com o que você pode cooperar?"
                : "Que ideia você gostaria de propor?"
          }
        />
      </label>
      <label>
        Descrição
        <textarea
          name="description"
          required
          rows={4}
          defaultValue={post?.description}
          placeholder="Conte um pouco mais para a comunidade…"
        />
      </label>
      <div className="form-grid">
        <label>
          Categoria
          <select name="category" defaultValue={post?.category}>
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <label>
          Tags, separadas por vírgula
          <input
            name="tags"
            defaultValue={post?.tags.join(", ")}
            placeholder="Ex.: automação, inventário"
          />
        </label>
        {type === "need" ? (
          <>
            <label>
              Competências necessárias
              <input name="skills" defaultValue={post?.skills} />
            </label>
            <label>
              Recursos necessários
              <input name="resources" defaultValue={post?.resources} />
            </label>
            <label>
              Urgência
              <select name="urgency" defaultValue={post?.urgency}>
                {["Baixa", "Média", "Alta"].map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </label>
            <label>
              Prazo
              <input
                type="date"
                name="deadline"
                defaultValue={post?.deadline}
              />
            </label>
            <label>
              Localização (opcional)
              <input name="location" defaultValue={post?.location} />
            </label>
            <label>
              Recompensa em créditos (opcional)
              <input
                type="number"
                min="0"
                max="100000"
                name="reward"
                defaultValue={post?.reward}
              />
            </label>
          </>
        ) : type === "offer" ? (
          <>
            <label>
              Tipo de contribuição
              <select name="kind" defaultValue={post?.kind}>
                {[
                  "Conhecimento",
                  "Competência",
                  "Recurso",
                  "Serviço",
                  "Disponibilidade",
                  "Solução",
                ].map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </label>
            <label>
              Disponibilidade
              <input
                name="availability"
                defaultValue={post?.availability}
                placeholder="Ex.: 4 horas por semana"
              />
            </label>
          </>
        ) : null}
      </div>
      <Protected>
        Identidade protegida. Nome, cargo e posição hierárquica não serão
        apresentados automaticamente.
      </Protected>
      <button className="btn primary" type="submit">
        {post
          ? "Salvar alterações"
          : "Publicar " + types[type].label.toLowerCase()}
      </button>
    </form>
  );
}

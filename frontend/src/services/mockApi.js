import { initialState } from "../mock/data.js";
const KEY = "coopera-demo-v2";
let memory;
export const mockApi = {
  load() {
    try {
      memory = JSON.parse(localStorage.getItem(KEY)) || initialState();
    } catch {
      memory = initialState();
    }
    return memory;
  },
  save(state) {
    localStorage.setItem(KEY, JSON.stringify(state));
    memory = state;
    return state;
  },
  reset() {
    return this.save(initialState());
  },
  mutate(fn) {
    const next = structuredClone(memory || this.load());
    fn(next);
    return this.save(next);
  },
  requireUser(s) {
    if (!s.authenticated)
      throw new Error("Entre como usuário demo para continuar.");
  },
  publish(post) {
    return this.mutate((s) => {
      this.requireUser(s);
      if (post.id) {
        const index = s.posts.findIndex((p) => p.id === post.id && p.mine);
        if (index < 0) throw Error("Publicação indisponível.");
        s.posts[index] = { ...s.posts[index], ...post };
      } else
        s.posts.unshift({
          ...post,
          id: crypto.randomUUID(),
          mine: true,
          date: "Agora",
          matches: 0,
          supports: 0,
          status:
            post.type === "need"
              ? "Aberta"
              : post.type === "offer"
                ? "Disponível"
                : "Em discussão",
        });
    });
  },
  accept(id) {
    return this.mutate((s) => {
      this.requireUser(s);
      if (s.rooms.some((r) => r.matchId === id)) return;
      const m = s.matches.find((m) => m.id === id);
      if (!m) throw Error("Match indisponível.");
      const need = s.posts.find((p) => p.id === m.need);
      if (!need || !s.posts.some((p) => p.id === m.offer))
        throw Error("Uma publicação deste match foi removida.");
      s.rooms.push({
        id: crypto.randomUUID(),
        matchId: id,
        title: need.title,
        reward: need.reward,
        deadline: need.deadline || "2026-10-30",
        status: "Em andamento",
        identity: "protected",
        messages: [
          {
            id: "welcome",
            author: "Participante B",
            text: "Olá! Podemos começar alinhando o que precisamos resolver?",
          },
        ],
        tasks: [
          { id: "a", text: "Alinhar necessidade e escopo", done: false },
          { id: "b", text: "Compartilhar uma primeira solução", done: false },
        ],
        files: [],
        history: ["Match aceito. Cooperação protegida iniciada."],
      });
      s.interests.push({ matchId: id, status: "Enviado" });
    });
  },
  room(id, fn) {
    return this.mutate((s) => {
      this.requireUser(s);
      const r = s.rooms.find((r) => r.id === id);
      if (r) fn(r, s);
    });
  },
  finish(id) {
    return this.room(id, (r, s) => {
      if (r.status === "Concluída") return;
      r.status = "Concluída";
      r.history.push(
        "Cooperação concluída. Recompensa transferida ao cooperador.",
      );
      if (r.reward) {
        s.wallet.balance += Number(r.reward);
        s.wallet.pending = Math.max(0, s.wallet.pending - r.reward);
        s.wallet.transactions.unshift({
          id: crypto.randomUUID(),
          amount: Number(r.reward),
          label: "Recompensa: " + r.title,
          date: "Agora",
        });
      }
    });
  },
  review(id, values) {
    return this.mutate((s) => {
      this.requireUser(s);
      s.reviews[id] = values;
    });
  },
  vote(id, choice) {
    return this.mutate((s) => {
      this.requireUser(s);
      if (s.votes[id]) throw Error("Sua participação já foi registrada.");
      s.votes[id] = { participated: true };
      s.voteTotals ||= {};
      s.voteTotals[id] ||= [12, 5, 3];
      s.voteTotals[id][choice]++;
    });
  },
};

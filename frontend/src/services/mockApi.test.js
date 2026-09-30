import test from "node:test";
import assert from "node:assert/strict";
import { mockApi } from "./mockApi.js";
const storage = new Map();
globalThis.localStorage = {
  getItem: (k) => storage.get(k) || null,
  setItem: (k, v) => storage.set(k, v),
};
test("publicações, edição e persistência sem identidade pública", () => {
  mockApi.reset();
  let s = mockApi.publish({
    type: "need",
    title: "Teste",
    description: "Descrição",
    tags: ["Teste"],
    reward: 50,
  });
  const id = s.posts[0].id;
  assert.equal(mockApi.load().posts[0].title, "Teste");
  mockApi.publish({ id, title: "Editado" });
  assert.equal(mockApi.load().posts[0].title, "Editado");
  for (const post of mockApi.load().posts) {
    assert.equal(post.name, undefined);
    assert.equal(post.author, undefined);
  }
});
test("match idempotente, mensagens, recompensa única e restauração", () => {
  mockApi.reset();
  let s = mockApi.accept("m1");
  const id = s.rooms[0].id;
  mockApi.accept("m1");
  assert.equal(mockApi.load().rooms.length, 1);
  mockApi.room(id, (r) =>
    r.messages.push({ author: "Participante A", text: "Olá" }),
  );
  assert.equal(mockApi.load().rooms[0].messages.at(-1).text, "Olá");
  mockApi.finish(id);
  mockApi.finish(id);
  assert.equal(mockApi.load().wallet.balance, 1550);
  assert.equal(mockApi.load().rooms[0].identity, "protected");
  s = mockApi.reset();
  assert.equal(s.wallet.balance, 1250);
  assert.equal(s.rooms.length, 0);
});
test("voto protegido, uma participação e avaliações persistentes", () => {
  mockApi.reset();
  mockApi.vote("i1", 1);
  assert.deepEqual(mockApi.load().votes.i1, { participated: true });
  assert.equal(mockApi.load().voteTotals.i1[1], 6);
  assert.throws(() => mockApi.vote("i1", 0));
  mockApi.review("i1", { Impacto: 9 });
  assert.equal(mockApi.load().reviews.i1.Impacto, 9);
});
test("visitante não publica, aceita match, avalia ou vota", () => {
  mockApi.reset();
  mockApi.mutate((s) => (s.authenticated = false));
  assert.throws(() => mockApi.publish({ title: "Bloqueado" }));
  assert.throws(() => mockApi.accept("m1"));
  assert.throws(() => mockApi.review("i1", {}));
  assert.throws(() => mockApi.vote("i1", 0));
  mockApi.reset();
});

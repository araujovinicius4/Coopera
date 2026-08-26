import test from 'node:test';
import assert from 'node:assert/strict';
import { scoreMatch, rankMatches } from '../src/services/matchingService.js';
const need = { type:'need', category_slug:'transporte', modality:'in_person', title:'Transportar um móvel', description:'Preciso levar uma mesa', region:'Centro', urgency:'high' };
test('tipos iguais ou categorias diferentes não combinam', () => {
  assert.equal(scoreMatch(need, {...need}).score, 0);
  assert.equal(scoreMatch(need, {...need,type:'offer',category_slug:'objetos'}).score, 0);
});
test('matching explica e ordena critérios úteis', () => {
  const strong = {...need,type:'offer',title:'Transporte de móvel',description:'Posso levar uma mesa',created_at:'2026-01-01'};
  const weak = {...need,type:'offer',title:'Carona',description:'Tenho carro',region:'Outro',modality:'either',created_at:'2026-01-02'};
  const result = rankMatches(need,[weak,strong]);
  assert.equal(result[0].title, strong.title);
  assert.ok(result[0].match.reasons.includes('Descrições relacionadas'));
});

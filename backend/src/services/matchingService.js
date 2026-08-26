const words = (text = '') => new Set(text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').match(/[a-z0-9]{4,}/g) || []);

export function scoreMatch(source, candidate) {
  if (source.type === candidate.type || source.category_slug !== candidate.category_slug) return { score: 0, reasons: [] };
  let score = 55;
  const reasons = ['Categoria compatível'];
  if (source.modality === candidate.modality || source.modality === 'either' || candidate.modality === 'either') { score += 15; reasons.push('Modalidade compatível'); }
  const shared = [...words(`${source.title} ${source.description}`)].filter((word) => words(`${candidate.title} ${candidate.description}`).has(word));
  if (shared.length) { score += Math.min(15, shared.length * 5); reasons.push('Descrições relacionadas'); }
  if (source.region && candidate.region && source.region.toLowerCase() === candidate.region.toLowerCase()) { score += 10; reasons.push('Mesma região'); }
  if (source.urgency === 'high' || candidate.urgency === 'high') { score += 5; reasons.push('Tempo relevante'); }
  return { score: Math.min(score, 100), reasons };
}

export function rankMatches(source, candidates) {
  return candidates.map((item) => ({ ...item, match: scoreMatch(source, item) })).filter((item) => item.match.score > 0).sort((a,b) => b.match.score - a.match.score || String(b.created_at).localeCompare(String(a.created_at)));
}

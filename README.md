# COOPERA

Protótipo frontend navegável: **necessidades encontram capacidades**. A urna conecta necessidades, ofertas e ideias, com participação horizontal e identidade protegida.

## Executar

Requer Node.js 20.19+ ou 22.12+ e npm.

```sh
npm install
npm run dev
```

Abra http://localhost:5173. O comando inicia exclusivamente o Vite, sem backend, banco, credenciais ou configuração de ambiente.

```sh
npm run build   # frontend/dist
npm run preview
npm test       # regras de persistência e fluxos da API mockada
```

## Telas e experiência

- **Urna Coopera:** três ações centrais, feed horizontal, busca, filtros por tipo e categoria.
- **Publicações:** cadastrar necessidades, capacidades e propostas; visualizar, editar, encerrar, reabrir e excluir contribuições próprias.
- **Matches:** compatibilidade ilustrativa, explicação e conexão entre setores.
- **Cooperações:** interesses enviados/recebidos, salas, conversa, tarefas, referências a arquivos, prazo, histórico e conclusão.
- **Consentimento:** solicitar revelação, simular aceitação ou recusa da outra parte; nomes fictícios só aparecem após aceitação.
- **Ideias:** apoio, comentários, perguntas, contribuições, colaboradores, avaliação cega e votação protegida.
- **Carteira:** saldo, entradas, saídas, créditos pendentes/bloqueados, extrato CSV e recompensa creditada ao concluir uma cooperação.
- **Impacto coletivo:** indicadores agregados, competências procuradas e rede entre áreas, sem ranking individual.
- **Perfil, privacidade, configurações e notificações.** Aplicação secundária de Ouvidoria com fluxo ilustrativo.

### Roteiro de demonstração

1. Abra Matches e a compatibilidade entre inventário e QR Code.
2. Clique em **Quero cooperar** e envie uma mensagem na sala protegida.
3. Marque tarefas, anexe uma referência de arquivo e experimente solicitar revelação.
4. Simule a resposta do Participante B: recusar mantém a proteção; aceitar registra consentimento bilateral.
5. Conclua a cooperação. Os 300 créditos são adicionados uma única vez à carteira do cooperador demo.
6. Confira carteira e impacto coletivo.
7. Publique uma ideia, abra seu card, comente, avalie e vote.
8. No menu do usuário, escolha Sair para experimentar o visitante; use Entrar como usuário demo para retornar.

## Estrutura e tecnologias

React, Vite, JavaScript, HTML5, CSS e lucide-react. Sem TypeScript.

```text
frontend/
  src/
    components/UI.jsx          # modal acessível, cards e estados vazios
    layouts/Shell.jsx          # navegação e menus
    pages/PostForm.jsx         # formulários de contribuição
    pages/Dashboard.jsx        # impacto coletivo
    mock/data.js               # dados iniciais fictícios
    services/mockApi.js        # operações e persistência
    services/mockApi.test.js   # testes de regras do mock
    hooks/useDemo.js           # estado e feedback
    App.jsx                   # telas e fluxos
    main.jsx
    styles.css
    responsive.css
```

O backend e os arquivos de infraestrutura que já existiam no repositório foram preservados, mas estão fora dos workspaces e dos comandos desta versão. Nenhum backend foi implementado nesta etapa. O frontend não os utiliza.

## Dados e privacidade

O estado é persistido na chave `coopera-demo-v2` do localStorage: sessão demo, publicações, matches aceitos, salas, mensagens, tarefas, avaliações, votos, carteira, consentimentos e preferências. **Configurações → Reiniciar demonstração → Restaurar dados iniciais** restaura os exemplos.

Objetos públicos não contêm nome, cargo ou identidade do autor; `mine` representa apenas a propriedade simulada da contribuição. O perfil interno fica separado. O voto guarda um marcador de participação separado dos totais por alternativa, sem vincular escolha ao usuário. Não há proteção criptográfica nem segurança de produção: o armazenamento local é inspecionável.

## Limitações intencionais

- Tudo é fictício e local ao navegador; não há autenticação real, API externa, servidor de aplicação ou banco.
- Matches, notificações e parte dos indicadores são exemplos fixos. Indicadores de cooperações e recompensas refletem também as ações locais.
- Conversa não tem interlocutor remoto. O consentimento do outro participante é simulado explicitamente.
- Arquivos armazenam somente o nome como referência; não são enviados nem persistidos como conteúdo.
- Créditos não têm valor monetário. A conclusão demonstra recebimento pelo cooperador, sem liquidação financeira ou transferência real.
- Preferências de perfil são ilustrativas; publicações continuam protegidas e revelação exige consentimento na sala.
- Pontos são demonstrativos e não alteram visibilidade, voto ou prioridade.
- Fontes web têm fallback local para funcionamento sem acesso ao Google Fonts.

## Evolução para uma API

Substitua as operações de `services/mockApi.js` por chamadas assíncronas à futura API e adapte `useDemo` para aguardar respostas e representar carregamento/erro. Migre as mutações genéricas para operações de domínio no servidor. Mantenha os contratos de apresentação dos componentes. A API futura deve aplicar autenticação, autorização, separação de identidades, consentimento, voto protegido e integridade das recompensas no servidor; o frontend mockado não constitui uma barreira de segurança.

## Validação realizada

- `npm install` e `npm run build` concluídos com sucesso.
- `npm test`: publicação/edição persistente, separação da identidade pública, aceite idempotente, mensagens, recompensa única, reset, voto único e bloqueio de ações do visitante.
- Playwright/Chromium: jornada de match → conversa → recusa de revelação → conclusão → carteira; publicação de ideia → avaliação → voto → recarga → reset, sem erros JavaScript.
- Responsividade verificada em 320, 360, 390, 430, 768, 1024 e 1440 px em 13 telas e no formulário, sem overflow horizontal.

Para repetir os testes de navegador:

```sh
npx playwright install chromium
npm run test:e2e
```

O teste inicia o Vite automaticamente ou utiliza a instância local existente.

## Identidade visual COOPERA

Refatoração exclusivamente visual aplicada à interface existente: Home/Urna, navegação, publicações, matches, salas de cooperação, ideias, avaliações, votos, carteira, dashboard, perfil, privacidade, configurações, notificações e Ouvidoria.

Os tokens ficam em `frontend/src/styles/tokens.css`:

| Papel | Cor |
| --- | --- |
| Azul institucional | `#14568B` |
| Azul de necessidades | `#176BB0` |
| Azul claro | `#EAF4FC` |
| Verde de cooperação | `#22734B` |
| Verde claro | `#EDF7EF` |
| Ideias / inovação | `#70539A` |
| Lavanda clara | `#F3EEF9` |
| Fundo | `#F7FAFC` |
| Superfície | `#FFFFFF` |
| Texto / texto secundário | `#243E52` / `#586E7E` |

Também foram centralizados raios (8, 14 e 22 px), sombras, bordas, foco e cores semânticas de sucesso, aviso e perigo. Foram mantidas DM Sans e Manrope, com textos mais legíveis, controles tocáveis e foco visível. As combinações principais de texto/fundo verificadas superam contraste 4,5:1.

### Logo oficial

A logo oficial está em `public/coopera-logo.png` na raiz do repositório. `frontend/vite.config.js` configura essa pasta como `publicDir`, garantindo a URL `/coopera-logo.png` em desenvolvimento e no build. O componente `frontend/src/components/Logo.jsx` utiliza exclusivamente essa imagem, com proporção preservada, `height: auto` e `object-fit: contain`.

A logo aparece no cabeçalho, na navegação lateral e na tela/modal de entrada demo. As ocorrências de login são decorativas para evitar leitura redundante. O componente aceita `compact`, `className` e `decorative`; o tamanho pode ser ajustado pela variável CSS `--logo-width`. No cabeçalho, são 180 px no desktop, 160 px no mobile e 140 px nas telas de até 360 px. A Home mantém a mensagem institucional sem acrescentar outra logo ao banner.

O favicon aguarda um símbolo oficial reduzido. Há uma indicação em `frontend/index.html`, sem referência a arquivo inexistente e sem utilizar a logo horizontal como ícone.

### Preservação e regressão

Mocks, mockApi, hook de estado e persistência foram preservados. A única interação adicionada é o CTA da Home que rola até o feed existente; não altera a rota ou os dados.

Os testes em `frontend/tests/visual-regression.spec.js` complementam a suíte anterior: publicação de necessidade/oferta/ideia, pesquisa, sessão visitante/demo, carteira, dashboard, preferência de privacidade persistente, saída/nova entrada e reset. Incluem menus móveis e restauração do foco ao fechar um modal com Escape. A suíte anterior valida match, mensagens, avaliação, voto, recompensa e sete larguras de tela.

# Basket Admin - Sistema de Gerenciamento de Ligas de Basquete

Painel administrativo desenvolvido com Next.js 16 para gerenciamento de ligas de basquete.

## 🚀 Tecnologias

- **Next.js 16** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **shadcn/ui** - Componentes UI
- **Lucide React** - Ícones
- **JWT Authentication** - Autenticação via tokens

## 📁 Estrutura do Projeto

```
front-basket/
├── app/                              # App Router (Next.js 16)
│   ├── (auth)/                       # Route Group para autenticação
│   │   ├── login/                    # Página de login
│   │   └── forgot-password/          # Recuperação de senha
│   │
│   ├── (dashboard)/                  # Route Group para dashboard (protegido)
│   │   ├── dashboard/                # Dashboard principal
│   │   ├── ligas/                    # Gestão de ligas
│   │   ├── times/                    # Gestão de times
│   │   ├── jogadores/                # Gestão de jogadores
│   │   ├── jogos/                    # Gestão de jogos
│   │   ├── categorias/               # Gestão de categorias
│   │   ├── analytics/                # Analytics/Relatórios
│   │   └── configuracoes/            # Configurações
│   │
│   ├── actions/                      # Server Actions
│   │   ├── auth-actions.ts
│   │   └── user-actions.ts
│   │
│   ├── layout.tsx                    # Root layout
│   ├── page.tsx                      # Home (redireciona)
│   ├── loading.tsx                   # Loading global
│   └── not-found.tsx                 # Página 404
│
├── components/                       # Componentes React
│   ├── ui/                           # Componentes shadcn/ui
│   └── admin/                        # Componentes específicos do admin
│       └── layout/
│           ├── sidebar.tsx           # Barra lateral
│           ├── navbar.tsx            # Barra de navegação
│           └── header.tsx            # Cabeçalho das páginas
│
├── lib/                              # Utilitários e helpers
│   ├── utils.ts                      # Funções utilitárias
│   ├── api.ts                        # Cliente de API e serviços
│   ├── auth.ts                       # Funções de autenticação
│   └── constants.ts                  # Constantes
│
├── hooks/                            # Custom React Hooks
│   └── use-media-query.ts
│
├── types/                            # TypeScript types/interfaces
│   └── index.ts                      # Tipos baseados na API
│
└── middleware.ts                     # Middleware para autenticação
```

## 🔌 Integração com API

Este projeto está integrado com a **Basket API** que fornece os seguintes endpoints:

### Autenticação
- `POST /auth/sign-in` - Autentica usuário e retorna JWT token

### Ligas
- `GET /leagues` - Lista todas as ligas
- `GET /leagues/{id}` - Busca liga por ID
- `POST /leagues` - Cria nova liga
- `GET /leagues/{leagueId}/standings` - Tabela de classificação
- `GET /leagues/{leagueId}/player-stats/top-scorers` - Top scorers
- `GET /leagues/{leagueId}/player-stats/three-point-leaders` - Líderes de 3 pontos

### Times
- `POST /teams` - Cria novo time
- `GET /teams/{id}` - Busca time por ID
- `GET /teams/{teamId}/players` - Lista jogadores do time
- `GET /teams/{teamId}/categories` - Lista categorias do time

### Jogadores
- `POST /players` - Cria novo jogador
- `GET /teams/{teamId}/category/{categoryId}/players` - Lista jogadores por time/categoria

### Jogos
- `POST /games` - Agenda novo jogo
- `GET /games/league/{leagueId}` - Lista jogos de uma liga
- `GET /games/{gameId}/stats` - Estatísticas do jogo
- `POST /games/{gameId}/stats` - Registra estatísticas

### Categorias
- `POST /categories` - Cria nova categoria

### Associações
- `POST /teams/{teamId}/player/{playerId}/category/{categoryId}` - Adiciona jogador ao time
- `POST /leagues/{leagueId}/teams/{teamId}` - Adiciona time à liga

Documentação completa da API disponível em: `http://localhost:8080/swagger-ui/index.html#/`

## 🎯 Funcionalidades Implementadas

### ✅ Autenticação
- ✅ Login com JWT token
- ✅ Middleware de proteção de rotas
- ✅ Gerenciamento de sessão

### ✅ Dashboard
- ✅ Visão geral com estatísticas de ligas
- ✅ Lista de ligas recentes

### ✅ Ligas
- ✅ Listagem de ligas
- ✅ Visualização de detalhes (estrutura preparada)

### ✅ Estrutura de Páginas
- ✅ Página de Times (estrutura criada)
- ✅ Página de Jogadores (estrutura criada)
- ✅ Página de Jogos (estrutura criada)
- ✅ Página de Categorias (estrutura criada)
- ✅ Página de Analytics (estrutura criada)
- ✅ Página de Configurações (estrutura criada)

## 🔄 Próximos Passos

- [ ] Implementar CRUD completo de Ligas (criar, editar, deletar)
- [ ] Implementar CRUD completo de Times
- [ ] Implementar CRUD completo de Jogadores
- [ ] Implementar CRUD completo de Jogos
- [ ] Implementar registro de estatísticas de jogos
- [ ] Implementar tabelas de classificação
- [ ] Implementar rankings de jogadores
- [ ] Implementar gráficos e visualizações
- [ ] Implementar upload de imagens (logos, fotos)
- [ ] Adicionar filtros e busca avançada

## 🏃 Como Executar

1. **Instale as dependências:**

```bash
npm install
# ou
yarn install
```

2. **Configure as variáveis de ambiente:**

Crie um arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

3. **Execute o servidor de desenvolvimento:**

```bash
npm run dev
# ou
yarn dev
```

4. **Acesse a aplicação:**

Abra [http://localhost:3000](http://localhost:3000) no navegador

5. **Faça login:**

Use as credenciais do backend para autenticar (o token JWT será armazenado automaticamente)

## 📝 Notas Importantes

### Autenticação

A autenticação está integrada com a API backend:
- O token JWT é armazenado no `localStorage`
- O middleware protege rotas e redireciona para login se não autenticado
- O token é enviado automaticamente em todas as requisições API

### Cliente de API

O cliente de API em `lib/api.ts` está configurado para:
- Adicionar automaticamente o token JWT nos headers
- Tratar erros de autenticação (401)
- Fornecer serviços específicos para cada entidade

### Tipos TypeScript

Todos os tipos em `types/index.ts` estão baseados na especificação OpenAPI da Basket API, garantindo type-safety completo.

## 🔐 Variáveis de Ambiente

| Variável | Descrição | Valor Padrão |
|----------|-----------|--------------|
| `NEXT_PUBLIC_API_URL` | URL base da API backend | `http://localhost:8080` |

## 📚 Recursos

- [Documentação Next.js](https://nextjs.org/docs)
- [App Router](https://nextjs.org/docs/app)
- [Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [shadcn/ui](https://ui.shadcn.com)
- [Basket API Swagger](http://localhost:8080/swagger-ui/index.html#/)

## 📄 Licença

Este projeto é privado.
# 🛒 WagSales - E-commerce Moderno

<div align="center">

![Angular](https://img.shields.io/badge/Angular-20-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Material](https://img.shields.io/badge/Material-20-757575?style=for-the-badge&logo=material-design&logoColor=white)

**E-commerce frontend-heavy com foco em UX/UI moderna, acessibilidade e performance**

[Demo](#) • [Documentação](#) • [Reportar Bug](https://github.com/seu-usuario/wagSales/issues)

</div>

---

## 📋 Sobre o Projeto

WagSales é um projeto de e-commerce desenvolvido com **Angular 20** (versão mais recente) com foco em:

- ✨ **Modernidade**: Standalone Components, Signals, SSR
- ♿ **Acessibilidade**: WCAG 2.1 AA, ARIA labels, keyboard navigation
- ⚡ **Performance**: Lazy loading, PWA, Lighthouse 90+
- 🎨 **UX/UI**: Design moderno com TailwindCSS + Material Design
- 📱 **Responsividade**: Mobile-first approach

### 🎯 Stack Tecnológica

#### Frontend (70%)
- **Framework**: Angular 20 com SSR (Server-Side Rendering)
- **Linguagem**: TypeScript 5.0+
- **Estilização**: TailwindCSS 3.4 + SCSS
- **Componentes UI**: Angular Material 20
- **State Management**: Angular Signals (moderno!)
- **Gerenciamento de Formulários**: Reactive Forms
- **Animações**: Angular Animations + Tailwind transitions

#### Backend (30%)
- **Firebase** (Auth, Firestore, Storage)
- **API REST** simulada (planejado)

---

## 🚀 Funcionalidades Planejadas

### ✅ Fase 1 - Fundação (ATUAL)
- [x] Setup do projeto com Angular 20
- [x] Configuração TailwindCSS + Angular Material
- [x] Design System (cores, tipografia, componentes base)
- [x] Dark Mode com Signals
- [x] Estrutura de pastas escalável
- [ ] Header responsivo + navegação
- [ ] Footer + newsletter

### 🔄 Fase 2 - Catálogo de Produtos
- [ ] Homepage com hero section animado
- [ ] Grid de produtos responsivo com lazy loading
- [ ] Filtros avançados (preço, categoria, marca)
- [ ] Busca inteligente com autocomplete
- [ ] Página de produto rica (galeria, variações, reviews)
- [ ] Quick View modal
- [ ] Wishlist persistente

### 🔄 Fase 3 - Carrinho & Checkout
- [ ] Mini-cart dropdown animado
- [ ] Página do carrinho completa
- [ ] Cupom de desconto
- [ ] Checkout multi-step (dados → endereço → pagamento)
- [ ] Validação em tempo real
- [ ] Cálculo de frete

### 🔄 Fase 4 - Autenticação & Perfil
- [ ] Login/Registro com Firebase Auth
- [ ] Dashboard do cliente
- [ ] Histórico de pedidos
- [ ] Rastreamento de pedidos
- [ ] Gerenciar endereços múltiplos
- [ ] Editar perfil

### 🔄 Fase 5 - Features Avançadas
- [ ] Sistema de reviews com fotos
- [ ] Comparador de produtos
- [ ] PWA (Progressive Web App)
- [ ] Internacionalização (PT/EN)
- [ ] Notificações toast
- [ ] Skeleton loaders

---

## 📁 Estrutura do Projeto

```
wagSales/
├── src/
│   ├── app/
│   │   ├── core/                  # Serviços singleton, guards, interceptors
│   │   │   ├── guards/            # Route guards
│   │   │   ├── interceptors/      # HTTP interceptors
│   │   │   ├── services/          # Serviços de negócio
│   │   │   │   └── theme.service.ts   # Dark mode com Signals
│   │   │   └── models/            # Interfaces e tipos
│   │   │
│   │   ├── shared/                # Componentes reutilizáveis
│   │   │   ├── components/        # Botões, cards, inputs, etc
│   │   │   ├── directives/        # Diretivas customizadas
│   │   │   ├── pipes/             # Pipes customizados
│   │   │   └── ui/                # Design system components
│   │   │
│   │   ├── features/              # Features principais (standalone)
│   │   │   ├── home/              # Homepage
│   │   │   ├── products/          # Catálogo e detalhes
│   │   │   ├── cart/              # Carrinho de compras
│   │   │   ├── checkout/          # Processo de checkout
│   │   │   ├── auth/              # Login/Registro
│   │   │   └── profile/           # Área do cliente
│   │   │
│   │   ├── layout/                # Componentes de layout
│   │   │   ├── header/            # Cabeçalho
│   │   │   ├── footer/            # Rodapé
│   │   │   └── sidebar/           # Menu lateral
│   │   │
│   │   └── app.routes.ts          # Rotas da aplicação
│   │
│   ├── assets/                    # Imagens, fontes, etc
│   ├── styles/                    # Estilos globais
│   └── environments/              # Variáveis de ambiente
│
├── tailwind.config.js             # Configuração TailwindCSS
├── angular.json                   # Configuração Angular CLI
└── package.json
```

---

## 🛠️ Como Executar

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Angular CLI (`npm install -g @angular/cli`)

### Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/wagSales.git

# Entre na pasta
cd wagSales

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm start
```

A aplicação estará disponível em `http://localhost:4200`

### Scripts Disponíveis

```bash
npm start          # Inicia servidor de desenvolvimento
npm run build      # Build de produção
npm run build:ssr  # Build com SSR
npm test           # Executa testes unitários
npm run lint       # Executa linter
npm run format     # Formata código com Prettier
```

---

## 🎨 Design System

### Cores Principais

- **Primary**: `#0ea5e9` (Sky Blue) - Ações principais
- **Secondary**: `#d946ef` (Fuchsia) - Destaques secundários
- **Accent**: `#f97316` (Orange) - Promoções e alertas
- **Success**: `#22c55e` (Green)
- **Error**: `#ef4444` (Red)

### Tipografia

- **Font Family**: Inter (Google Fonts)
- **Heading**: 600-700 weight
- **Body**: 400-500 weight

### Componentes Base

O projeto inclui classes utility no TailwindCSS:

- `.btn-primary`, `.btn-secondary`, `.btn-outline`, `.btn-ghost`
- `.card`, `.card-hover`
- `.badge-primary`, `.badge-success`, `.badge-error`
- `.skeleton` (loading states)

---

## ♿ Acessibilidade

Este projeto segue as diretrizes **WCAG 2.1 nível AA**:

- ✅ ARIA labels em todos componentes interativos
- ✅ Navegação completa por teclado
- ✅ Contraste de cores adequado (4.5:1 mínimo)
- ✅ Focus visible para keyboard navigation
- ✅ Screen reader friendly
- ✅ Redução de movimento para `prefers-reduced-motion`

---

## 🚀 Performance

Otimizações aplicadas:

- **Lazy Loading**: Módulos carregados sob demanda
- **Virtual Scrolling**: Para listas longas
- **Image Lazy Loading**: Imagens carregadas quando visíveis
- **SSR**: Server-Side Rendering para SEO
- **PWA**: Service Workers para cache offline
- **Tree Shaking**: Remoção de código não utilizado
- **Code Splitting**: Divisão do bundle

**Meta**: Lighthouse Score 90+ em todas categorias

---

## 📝 Commits Semânticos

Este projeto segue o padrão [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: adiciona nova funcionalidade
fix: corrige um bug
docs: atualiza documentação
style: formatação, ponto e vírgula, etc
refactor: refatoração de código
test: adiciona ou corrige testes
chore: tarefas de manutenção
```

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Siga os passos:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feat/nova-feature`)
3. Commit suas mudanças (`git commit -m 'feat: adiciona nova feature'`)
4. Push para a branch (`git push origin feat/nova-feature`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👨‍💻 Autor

**Seu Nome**

- GitHub: [@seu-usuario](https://github.com/seu-usuario)
- LinkedIn: [Seu Perfil](https://linkedin.com/in/seu-perfil)

---

<div align="center">

**⭐ Se este projeto te ajudou, considere dar uma estrela!**

</div>

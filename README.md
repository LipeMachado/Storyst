# Storyst: Plataforma de Gestão e Análise de Clientes para Lojas de Brinquedos

## Visão Geral do Projeto

**Storyst** é uma solução **full-stack** completa projetada para otimizar a gestão de clientes e vendas em lojas de brinquedos. O projeto compreende uma **API REST robusta** e um **painel de controle interativo**, desenvolvidos com o objetivo de demonstrar o domínio de tecnologias modernas, aplicação de boas práticas de engenharia de software e raciocínio lógico na construção de uma aplicação escalável e de alto desempenho.

### Funcionalidades Principais

* **Gestão de Clientes (CRUD Completo):** Cadastro, listagem, edição e exclusão de clientes, com opções de filtro por nome ou e-mail.
* **Autenticação Segura:** Proteção de todas as rotas da API via JSON Web Tokens (JWT).
* **Registro de Vendas:** Capacidade de registrar vendas e associá-las a clientes específicos.
* **Métricas de Vendas Detalhadas:**
    * Total de vendas diárias.
    * Identificação do cliente com maior volume de vendas.
    * Identificação do cliente com a maior média de valor por venda.
    * Identificação do cliente com a maior frequência de compra (maior número de dias únicos com vendas).
* **Painel de Controle Intuitivo:**
    * Visualização de dados de clientes, incluindo o processamento e a normalização de estruturas de dados complexas recebidas da API.
    * Exibição de gráficos interativos para as estatísticas de vendas.
    * Destaques visuais para os clientes de alta performance.
    * Recurso visual inovador: indicação da primeira letra do alfabeto não presente no nome completo do cliente.

---

## Tecnologias Utilizadas

A arquitetura do **Storyst** foi construída com um conjunto de tecnologias modernas e amplamente reconhecidas no mercado, garantindo performance, escalabilidade e manutenibilidade.

### 🚀 Backend (API REST)

Desenvolvido em **Node.js** utilizando o framework **Express.js**, com foco em uma API RESTful eficiente.

* **Node.js:** Ambiente de execução assíncrono para JavaScript, ideal para aplicações de rede escaláveis.
* **Express.js:** Framework minimalista e flexível que acelera o desenvolvimento de APIs e rotas.
* **PostgreSQL:** Banco de dados relacional robusto e confiável, utilizado para persistência de dados de clientes e vendas.
* **Supabase:** Plataforma de código aberto que oferece um serviço gerenciado de PostgreSQL, facilitando a configuração e o acesso ao banco de dados.
* **Prisma ORM:** ORM de próxima geração que simplifica as interações com o banco de dados através de um cliente de consulta seguro e gerado automaticamente, promovendo a tipagem e reduzindo erros.
* **Docker:** Ferramenta essencial para conteinerização, garantindo que o ambiente do backend seja consistente desde o desenvolvimento até a produção, facilitando o deploy.
* **Jest & Supertest:** Conjunto de ferramentas para testes automatizados (unitários e de integração), assegurando a qualidade e a robustez da API.
* **jsonwebtoken (JWT) & bcryptjs:** Fundamentais para a implementação de um sistema de autenticação e autorização seguro.

### 🌐 Frontend (Painel de Controle)

Construído com **React.js**, focado em uma interface de usuário moderna, responsiva e acessível.

* **React.js:** Biblioteca JavaScript declarativa para a construção de interfaces de usuário reativas e componentizadas.
* **Vite:** Ferramenta de build extremamente rápida que otimiza o desenvolvimento e a experiência do desenvolvedor (DX).
* **Tailwind CSS:** Framework CSS utility-first que permite a construção de designs personalizados e responsivos de forma ágil e eficiente.
* **Shadcn/ui:** Coleção de componentes UI elegantes e acessíveis, construídos com Radix UI e estilizados com Tailwind CSS, acelerando o desenvolvimento da interface.
* **React Router:** Biblioteca padrão para roteamento de aplicações SPA (Single Page Application) em React.

### ☁️ Deployment

Para um deployment eficiente e escalável, o projeto utiliza plataformas de nuvem modernas.

* **Railway:** Escolhido para hospedar o backend conteinerizado (Docker), devido à sua simplicidade, performance e generoso plano gratuito para projetos de demonstração.
* **Vercel:** Utilizado para o deployment do frontend React, conhecida por sua automação de build, alta performance e integração contínua com repositórios Git.

---

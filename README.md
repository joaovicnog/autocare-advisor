# 🚗 AutoCare Advisor

O **AutoCare Advisor** é uma aplicação web que gera um **checklist personalizado de inspeção preventiva veicular** com base na descrição livre de um carro e seu tipo de uso.

O usuário descreve o veículo em linguagem natural (modelo, ano, tipo de uso, quilometragem etc.), e o sistema analisa as informações usando um backend com IA para produzir um **checklist técnico priorizado**, incluindo justificativas e fontes.

---

## ✨ Funcionalidades

* 🔍 **Análise do Veículo em Linguagem Natural**  
  O usuário pode descrever o veículo livremente — sem formulários rígidos.

* 📋 **Checklist Preventivo Priorizado**  
  Os itens são organizados por nível de importância:

  * **Crítico**
  * **Importante**
  * **Recomendado**

* 🧠 **Justificativas Técnicas**  
  Cada item do checklist inclui uma explicação do *porquê* ele é importante para aquele perfil específico de veículo.

* 📚 **Fontes Técnicas**  
  O sistema pode fornecer referências que sustentam as recomendações de manutenção.

* 👤 **Autenticação de Usuário**  
  Usuários podem se cadastrar e fazer login via Supabase Auth.

* ☁️ **Processamento com IA Serverless**  
  A análise do veículo é realizada por uma Edge Function do Supabase.

---

## 🧱 Tecnologias Utilizadas

**Frontend**

* React 18 + TypeScript
* Vite
* Tailwind CSS
* shadcn/ui + Radix UI
* React Hook Form + Zod
* TanStack React Query
* React Router DOM

**Backend / Serviços**

* Supabase (Autenticação e Edge Functions)
* Edge Function `analyze-vehicle` (análise veicular com IA)

**Testes**

* Vitest
* Testing Library

---

## 📂 Estrutura do Projeto

```
src/
│
├── components/          # Componentes de interface (formulários, resultados, layout)
├── pages/               # Páginas de rota (Index, Login, Signup)
├── integrations/
│   └── supabase/        # Cliente Supabase e tipos gerados
├── lib/
│   └── vehicleParser.ts # Tipos e lógica de normalização dos dados do veículo
├── hooks/               # Hooks customizados do React
└── main.tsx             # Ponto de entrada da aplicação
```

---

## 🧠 Como Funciona

1. O usuário insere uma descrição do veículo (exemplo:
   *“Corolla 2014, uso principalmente urbano, 120.000 km”*).

2. O frontend envia esse texto para a Edge Function do Supabase:

   ```ts
   supabase.functions.invoke('analyze-vehicle', {
     body: { description }
   })
   ```

3. A Edge Function retorna dados estruturados contendo:

   * Informações do veículo
   * Itens do checklist por prioridade
   * Justificativas técnicas
   * Fontes

4. O frontend então:

   * Normaliza as informações do veículo (`normalizeVehicleInfo`)
   * Exibe o checklist categorizado
   * Permite que o usuário revise os itens com clareza

---

## 🔧 Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_SUPABASE_URL=seu_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=sua_supabase_anon_key
```

Essas variáveis são necessárias para:

* Autenticação de usuários
* Chamada da Edge Function `analyze-vehicle`

---

## 🏗️ Arquitetura do Sistema

Abaixo estão os diagramas de arquitetura do **AutoCare Advisor**, seguindo o modelo C4.

### 🌍 Diagrama de Contexto

Mostra como o sistema se relaciona com usuários e serviços externos.

![Diagrama de Contexto do AutoCare Advisor](docs/diagrams/contexto-autocare-advisor.svg)

---

### 🧱 Diagrama de Containers

Apresenta os principais blocos técnicos da aplicação e como eles se comunicam.

![Diagrama de Containers do AutoCare Advisor](docs/diagrams/container-autocare-advisor.svg)

---

## ▶️ Executando Localmente

Instale as dependências:

```bash
npm install
```

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

A aplicação estará disponível em:

```
http://localhost:8080
```

---

## 🏗️ Build para Produção

```bash
npm run build
npm run preview
```

---

## 🧪 Executando os Testes

```bash
npm run test
```

Modo de observação:

```bash
npm run test:watch
```

---

## 🔌 Edge Function do Supabase

Este frontend depende de uma Edge Function chamada:

```
analyze-vehicle
```

Ela deve:

* Receber um JSON no formato `{ description: string }`
* Retornar dados estruturados compatíveis com:

```ts
interface ChecklistResult {
  vehicleInfo: VehicleInfo;
  criticos: ChecklistItem[];
  importantes: ChecklistItem[];
  recomendados: ChecklistItem[];
  fontes?: TechnicalSource[];
}
```

---

## 🚀 Melhorias Futuras

* Salvar histórico de checklists por usuário
* Lembretes de manutenção baseados em tempo/quilometragem
* Suporte a motocicletas e veículos pesados

---

## 👨‍💻 Autores

Projeto desenvolvido por:

- João Victor Nogueira de Souza  
- Marinel Borges Almeida

---

## 📄 Licença

Este projeto é para fins educacionais e de demonstração.

---

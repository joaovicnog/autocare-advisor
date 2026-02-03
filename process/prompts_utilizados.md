# Documentação de Prompts Utilizados — Sistema de Inspeção Veicular Preventiva

> **Observação:** O documento expõe os prompts utilizados, incluindo os que não funcionaram. Houve também outros prompts testados no Copilot do VSCode, mas devido à quantidade e frustração por estourar o limite de uso, o chat foi deletado sem intenção.

---

## 1. Prompts Utilizados — Corpo Principal do Projeto

### Prompt 1
```text
Você é um Sistema de Suporte à Inspeção Veicular Preventiva baseado em múltiplos especialistas automotivos.

O usuário irá descrever livremente seu veículo e o tipo de uso pretendido.
Sua tarefa é interpretar as informações fornecidas e assumir valores razoáveis quando algo não for explicitamente informado.

Descrição do usuário:
"{texto digitado pelo usuário}"

Com base em boas práticas gerais de manutenção automotiva amplamente utilizadas na indústria e descritas em manuais técnicos e guias de fabricantes, execute as etapas abaixo:

- Identifique, a partir do texto, o modelo aproximado do veículo, idade estimada e tipo de uso.
- Gere um CHECKLIST DE INSPEÇÃO PREVENTIVA dividido em:
  - Itens Críticos
  - Itens Importantes
  - Itens Recomendados
- Forneça JUSTIFICATIVAS TÉCNICAS explicando por que os principais itens devem ser verificados para esse perfil de veículo e uso.

Use linguagem clara, técnica, mas acessível para um proprietário de veículo.
```

### Prompt 2 (Inserido sem querer)
```text
Você é um Sistema de Suporte à Inspeção Veicular Preventiva baseado em múltiplos especialistas automotivos.

O usuário irá descrever livremente seu veículo e o tipo de uso pretendido. Sua tarefa é interpretar as informações fornecidas e assumir valores razoáveis quando algo não for explicitamente informado.

Descrição do usuário:
"{mensagem do usuário}"

Com base em boas práticas gerais de manutenção automotiva amplamente utilizadas na indústria e descritas em manuais técnicos e guias de fabricantes, execute as etapas abaixo:

1. Identifique, a partir do texto, o modelo aproximado do veículo, idade estimada e tipo de uso.
2. Gere um CHECKLIST DE INSPEÇÃO PREVENTIVA dividido em:
   - Itens Críticos
   - Itens Importantes
   - Itens Recomendados
3. Forneça JUSTIFICATIVAS TÉCNICAS explicando por que os principais itens devem ser verificados para esse perfil de veículo e uso.

Use linguagem clara, técnica, mas acessível para um proprietário de veículo.
```

### Prompt 3 (Ajustes Técnicos)
```text
Preciso adicionar chave da OpenAI para não retornar apenas respostas genéricas.
```

### Prompt 4 (Integração de Fontes Confiáveis)
```text
Adicione SERPER_API_KEY=(key) para retornar respostas com fontes confiáveis e técnicas.
```

### Prompt 5 (Login e Problemas de Ano/Idade)
```text
Adicione função de login com usuário e senha e confirmação via e-mail.
Verifique porque Ano e Idade não aparecem nunca independente da entrada.
```

---

## 2. Prompts Não Utilizados — Outras Fontes (GPT / Claude / Gemini)

### Supabase + Sistema Completo
```sql
-- Tabela principal de análises
CREATE TABLE analises_veiculares (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  modelo text NOT NULL,
  ano smallint NOT NULL,
  tipo_uso text NOT NULL,
  distancia_km int,
  resultado jsonb NOT NULL,
  tokens_usados int,
  tempo_ms int,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT unique_analise UNIQUE (modelo, ano, tipo_uso, distancia_km)
);

-- Índices para performance
CREATE INDEX idx_analises_modelo ON analises_veiculares(modelo, ano);
CREATE INDEX idx_analises_created ON analises_veiculares(created_at DESC);
```

### FUNCIONALIDADES
```text
O sistema deve ter:

1. Formulário de entrada com campos:
    - Modelo do veículo (text)
    - Ano (number, 1990 até ano atual)
    - Tipo de uso (select: viagem_longa, cidade, carga, off_road)
    - Distância em km (number, 1-9999)

2. Botão "Gerar Análise Preventiva" que:
    - Valida os dados (modelo com mínimo 3 caracteres, ano válido, distância > 0)
    - Verifica cache no Supabase (evita chamadas duplicadas)
    - Se não houver cache, chama a API do Claude
    - Salva resultado no Supabase
    - Exibe os resultados

3. Exibição de resultados em duas seções:
    - Checklist de Inspeção: 3 categorias (Críticos 🔴, Importantes 🟡, Recomendados 🟢)
    - Justificativas Técnicas: explicações detalhadas dos itens principais
```

### INTEGRAÇÃO COM CLAUDE API
```text
Use este prompt para chamar a API do Claude (modelo: claude-sonnet-4-20250514):

Prompt 2

Configurações da API:
- max_tokens: 800
- temperature: 0.3
```

### DESIGN
```text
- Background: gradient dark (slate-900 to blue-900)
- Cards: white com backdrop-blur
- Botão principal: gradient blue (600 to 700)
- Categorias do checklist:
    - Críticos: fundo red-50, borda red-300
    - Importantes: fundo yellow-50, borda yellow-300
    - Recomendados: fundo green-50, borda green-300
- Justificativas: borda esquerda blue-500, fundo blue-50
```

### FLUXO DE DADOS
```text
1. Usuário preenche formulário
2. Sistema valida dados
3. Sistema busca cache no Supabase (unique constraint: modelo + ano + tipo_uso + distancia_km)
4. Se cache existe: retorna resultado imediatamente
5. Se não existe cache:
    - Chama API do Claude com prompt otimizado
    - Parseia resposta JSON
    - Salva no Supabase com metadados (tokens_usados, tempo_ms)
    - Retorna resultado
6. Interface exibe checklist e justificativas
```

### VALIDAÇÕES
```text
- Modelo: mínimo 3 caracteres, máximo 50
- Ano: entre 1990 e ano atual
- Tipo de uso: apenas valores permitidos (viagem_longa, cidade, carga, off_road)
- Distância: entre 1 e 9999 km
- Mostrar mensagem de erro se validação falhar
```

### ESTADOS DA UI
```text
- Loading: mostrar spinner e texto "Analisando..."
- Error: mostrar mensagem em vermelho com ícone ⚠️
- Success: mostrar resultados animados (fade-in)
- Botão desabilitado quando: loading=true OU dados inválidos
```

### FORMATAÇÃO DO TIPO DE USO
```text
Converter internamente:
- viagem_longa → "Viagem longa em rodovia"
- cidade → "Uso urbano"
- carga → "Transporte de carga"
- off_road → "Uso off-road"
```

### PARSER DE RESPOSTA
```json
Se parsing falhar, retorne:
{
  "criticos": [{"item": "Erro ao processar análise", "por": "Tente novamente"}],
  "importantes": [],
  "recomendados": [],
  "justificativas": []
}
```

### REQUISITOS TÉCNICOS
```text
- TypeScript com strict mode
- React hooks (useState, useCallback, useMemo)
- Supabase client configurado
- Tailwind CSS para estilização
- Responsive (mobile-first)
- Acessibilidade (labels, aria-labels)

Crie a aplicação completa e funcional seguindo estas especificações.
```

### LOVABLE PROMPTS PROJETO DESCARTADO
```text
Crie uma aplicação web simples chamada "Sistema de Suporte à Inspeção Veicular Preventiva".

A aplicação deve simular um assistente automotivo inteligente conversacional, utilizando um modelo de IA externo (como Gemini com acesso a informações técnicas amplamente disponíveis).

### Interface

- Um campo de texto grande estilo chat com o rótulo:
"Descreva seu veículo e como você pretende usá-lo"
- Placeholder de exemplo:
"Ex: Tenho um Corolla 2015 e vou viajar 800 km com a família."
- Um botão:
"Analisar Veículo"
- Área de resposta abaixo exibindo a resposta da IA de forma organizada.

A interface deve ser simples, limpa e em português do Brasil.

### Comportamento da IA (lógica principal)

O usuário envia mensagem para o modelo de IA usando o prompt base:

- ETAPA 1 — Análise Inicial
  1. Interprete a descrição do usuário e identifique:
      - Modelo aproximado do veículo
      - Idade estimada
      - Tipo de uso (urbano, rodoviário, severo, etc.)
  2. Gere CHECKLIST DE INSPEÇÃO PREVENTIVA dividido em:
      - Itens Críticos
      - Itens Importantes
      - Itens Recomendados
  3. Forneça JUSTIFICATIVAS TÉCNICAS
  4. Inclua seção "Fontes consultadas"

- ETAPA 2 — Interação de Refinamento
  - Faça UMA pergunta adicional relacionada a histórico de manutenção, tempo desde a última revisão, sintomas recentes ou uso severo
  - Ajuste recomendações com base na resposta do usuário

Use linguagem clara e acessível.

### Requisitos Técnicos
- Resposta formatada com títulos e listas
- Chat conversacional
- Sem login ou banco de dados
- Pronto para deploy
- Código isolado para integração com modelo de IA

O output final deve entregar checklist imprimível e fontes precisas com links, input de texto fixo embaixo e prompt final sem perguntas adicionais.
```

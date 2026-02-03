# 📖 User Stories - AutoCare Advisor

## Visão Geral
Este documento descreve as user stories do projeto AutoCare Advisor, um sistema de inspeção preventiva veicular que gera checklists personalizados baseados em descrições livres de veículos.

---

## US-001: Criar Conta de Usuário

**Como** um novo usuário interessado em verificar a saúde do meu veículo,  
**Eu quero** me cadastrar no sistema com email e senha,  
**Para que** eu possa acessar a aplicação e gerar checklists personalizados.

### Critérios de Aceitação
- [ ] Formulário de signup com campos: email, senha, confirmação de senha
- [ ] Validação de email (formato válido)
- [ ] Validação de senha (mínimo 8 caracteres)
- [ ] Confirmação de email antes de ativar a conta
- [ ] Mensagem de erro clara se email já existe
- [ ] Redirecionamento para login após signup bem-sucedido
- [ ] Integração com Supabase Auth

---

## US-002: Login no Sistema

**Como** um usuário cadastrado,  
**Eu quero** fazer login com meu email e senha,  
**Para que** eu possa acessar meus dados e gerar novas análises.

### Critérios de Aceitação
- [ ] Formulário de login com email e senha
- [ ] Botão "Entrar" que valida credenciais
- [ ] Mensagem de erro para credenciais inválidas
- [ ] Persistência de sessão (manter logado)
- [ ] Redirecionamento para a página principal após login
- [ ] Link para recuperação de senha
- [ ] Integração com Supabase Auth

---

## US-003: Logout do Sistema

**Como** um usuário logado,  
**Eu quero** fazer logout da aplicação,  
**Para que** eu possa sair de minha conta e proteger minha privacidade.

### Critérios de Aceitação
- [ ] Botão "Sair" visível no header
- [ ] Logout limpa a sessão
- [ ] Redirecionamento para página de login
- [ ] Cookies/tokens removidos
- [ ] Confirmar logout (modal opcional)

---

## US-004: Descrever Veículo em Linguagem Natural

**Como** um proprietário de veículo,  
**Eu quero** descrever meu carro livremente em linguagem natural,  
**Para que** o sistema compreenda as características específicas do meu veículo sem formulários complexos.

### Critérios de Aceitação
- [ ] Campo de texto de entrada com placeholder informativo
- [ ] Aceita descrições livres (modelo, ano, quilometragem, tipo de uso, combustível)
- [ ] Mínimo de 10 caracteres para submissão
- [ ] Máximo de 1000 caracteres
- [ ] Botão "Analisar" para submeter
- [ ] Exemplos de descrições válidas mostrados
- [ ] Indicador de caracteres digitados (contador)

---

## US-005: Gerar Checklist Personalizado

**Como** um proprietário de veículo,  
**Eu quero** enviar a descrição do meu veículo e receber um checklist personalizado,  
**Para que** eu saiba quais manutenções são prioritárias para meu perfil específico.

### Critérios de Aceitação
- [ ] Chamada à Edge Function com sucesso
- [ ] Análise leva máximo 10 segundos (com feedback de carregamento)
- [ ] Retorna checklist estruturado por prioridades
- [ ] Informações do veículo normalizadas (modelo, ano, uso, quilometragem)
- [ ] Tratamento de erros com mensagens claras
- [ ] Integração com Serper API para fontes técnicas (quando disponível)
- [ ] Integração com Google Gemini para análise de IA

---

## US-006: Visualizar Checklist por Prioridade

**Como** um proprietário de veículo,  
**Eu quero** ver os itens de manutenção organizados por prioridade (Crítico → Importante → Recomendado),  
**Para que** eu saiba quais manutenções fazer primeiro.

### Critérios de Aceitação
- [ ] Três seções distintas: Crítico, Importante, Recomendado
- [ ] Código de cor para cada prioridade
- [ ] Ícones indicando prioridade
- [ ] Contador de itens por categoria
- [ ] Expansível/colapsável por seção
- [ ] Ordem dos itens dentro de cada categoria mantida
- [ ] Design responsivo (mobile, tablet, desktop)

---

## US-007: Visualizar Justificativa Técnica

**Como** um proprietário de veículo,  
**Eu quero** ver a justificativa técnica para cada item do checklist,  
**Para que** eu entenda por que aquele item é importante para meu veículo específico.

### Critérios de Aceitação
- [ ] Cada item mostra justificativa clara e acessível
- [ ] Linguagem técnica mas compreensível para não-especialistas
- [ ] Justificativa considera o perfil do veículo (idade, uso, quilometragem)
- [ ] Máximo de 150 caracteres por justificativa (ou expandível)
- [ ] Ícone de informação para expandir justificativa

---

## US-008: Visualizar Fontes Técnicas

**Como** um proprietário de veículo,  
**Eu quero** ver referências técnicas (artigos, manuais) que sustentam as recomendações,  
**Para que** eu possa aprofundar meu conhecimento e confiar nas recomendações.

### Critérios de Aceitação
- [ ] Seção "Fontes" no final do checklist
- [ ] Links clickáveis para artigos/manuais técnicos
- [ ] Título, URL e resumo de cada fonte
- [ ] Fontes obtidas via Serper API (busca técnica)
- [ ] Máximo 5 fontes apresentadas
- [ ] Links abrem em nova aba
- [ ] Indicação de fontes confiáveis (ícone de check)

---

## US-009: Marcar Item como Concluído

**Como** um proprietário de veículo,  
**Eu quero** marcar itens do checklist como concluído,  
**Para que** eu acompanhe o progresso da manutenção do meu veículo.

### Critérios de Aceitação
- [ ] Checkbox ao lado de cada item
- [ ] Clique marca/desmarca o item
- [ ] Estilo visual muda (risco/opacidade) quando marcado
- [ ] Progresso geral atualiza em tempo real
- [ ] Estado persiste durante a sessão
- [ ] Animação suave ao marcar/desmarcar

---

## US-010: Visualizar Progresso Geral

**Como** um proprietário de veículo,  
**Eu quero** ver o percentual de conclusão do checklist,  
**Para que** eu saiba quanto da manutenção preventiva já foi realizado.

### Critérios de Aceitação
- [ ] Barra de progresso visual (0-100%)
- [ ] Texto mostrando "X de Y itens concluídos"
- [ ] Atualização em tempo real ao marcar itens
- [ ] Cores visuais (verde quando alto, amarelo médio, vermelho baixo)
- [ ] Posição destacada no topo do checklist

---

## US-011: Imprimir Checklist

**Como** um proprietário de veículo,  
**Eu quero** imprimir o checklist para levar ao mecânico,  
**Para que** eu tenha uma cópia física para consulta e compartilhamento.

### Critérios de Aceitação
- [ ] Botão "Imprimir" visível
- [ ] Layout otimizado para impressão (sem elementos desnecessários)
- [ ] Includes: informações do veículo, todos os itens, justificativas
- [ ] Cores mantidas na impressão
- [ ] Sem quebras de página no meio de seções
- [ ] Cabeçalho com título e data

---

## US-012: Nova Análise

**Como** um proprietário de veículo,  
**Eu quero** fazer uma nova análise com descrição diferente,  
**Para que** eu possa comparar checklists de diferentes perfis ou corrigir informações anteriores.

### Critérios de Aceitação
- [ ] Botão "Nova Análise" após checklist gerado
- [ ] Reset do formulário de entrada
- [ ] Limpa o checklist anterior
- [ ] Retorna ao campo de input com foco
- [ ] Confirmação se houver itens marcados (modal)

---

## US-013: Visualizar Informações Normalizadas do Veículo

**Como** um proprietário de veículo,  
**Eu quero** ver como o sistema interpretou minha descrição (modelo, ano, tipo de uso, etc.),  
**Para que** eu confirme se a análise foi feita com dados corretos.

### Critérios de Aceitação
- [ ] Card no topo do checklist mostrando: Modelo, Ano, Quilometragem, Tipo de Uso, Combustível
- [ ] Dados normalizados e formatados
- [ ] Ícone de edição para corrigir (opcional)
- [ ] Destaque visual diferenciado
- [ ] Função `normalizeVehicleInfo` aplicada corretamente

---

## US-014: Tratamento de Erro - Descrição Inválida

**Como** um proprietário de veículo,  
**Eu quero** receber feedback claro quando envio uma descrição inválida,  
**Para que** eu entenda o que preciso corrigir e tentar novamente.

### Critérios de Aceitação
- [ ] Mensagem de erro clara e em português
- [ ] Sugestão de correção (ex: "Adicione o ano do veículo")
- [ ] Toast/alert não intrusivo
- [ ] Campo de input permanece focado
- [ ] Botão de tentar novamente disponível

---

## US-015: Tratamento de Erro - Falha na Conexão

**Como** um proprietário de veículo,  
**Eu quero** ser informado se houver problema de conexão,  
**Para que** eu saiba se o problema é meu ou do sistema.

### Critérios de Aceitação
- [ ] Mensagem: "Erro de conexão. Verifique sua internet."
- [ ] Sugestão de ações (verificar WiFi, tentar novamente)
- [ ] Botão "Tentar Novamente" disponível
- [ ] Sem perda de dados (descrição permanece)
- [ ] Log de erro no console

---

## US-016: Responsividade Mobile

**Como** um usuário em smartphone,  
**Eu quero** usar a aplicação confortavelmente em tela pequena,  
**Para que** eu possa gerar e consultar checklists em qualquer lugar.

### Critérios de Aceitação
- [ ] Layout adaptado para telas < 640px
- [ ] Texto legível sem zoom
- [ ] Botões com tamanho mínimo de 44x44px
- [ ] Sem scroll horizontal
- [ ] Toques responsivos
- [ ] Imagens escaladas apropriadamente
- [ ] Testado em dispositivos reais

---

## US-017: Design Acessível

**Como** um usuário com deficiência visual,  
**Eu quero** navegar a aplicação usando leitores de tela,  
**Para que** eu tenha acesso às mesmas funcionalidades.

### Critérios de Aceitação
- [ ] Semântica HTML correta (headings, buttons, inputs)
- [ ] Labels associados com inputs
- [ ] ARIA attributes onde necessário
- [ ] Contraste de cores suficiente (WCAG AA)
- [ ] Teclado navegável (Tab, Enter, Space)
- [ ] Testado com NVDA/JAWS

---

## US-018: Autenticação Protegida

**Como** um proprietário de veículo,  
**Eu quero** que minhas análises sejam protegidas por autenticação,  
**Para que** apenas eu possa acessar meus dados.

### Critérios de Aceitação
- [ ] Página não-autenticada redireciona para login
- [ ] ProtectedRoute implementado corretamente
- [ ] Tokens JWT seguros
- [ ] Sessão expira após inatividade (opcional)
- [ ] Refresh token funciona
- [ ] Logout limpa dados sensíveis

---

## US-019: Histórico de Análises (Futura)

**Como** um proprietário de veículo,  
**Eu quero** ver o histórico de análises anteriores,  
**Para que** eu possa comparar evolução da manutenção do meu veículo ao longo do tempo.

### Critérios de Aceitação
- [ ] Lista de análises anteriores com data e hora
- [ ] Clique em análise recarrega aquele checklist
- [ ] Pode deletar análises antigas
- [ ] Limite de 50 análises por usuário
- [ ] Ordenado por data (mais recente primeiro)

---

## US-020: Lembretes de Manutenção (Futura)

**Como** um proprietário de veículo,  
**Eu quero** receber lembretes de manutenção baseados em tempo ou quilometragem,  
**Para que** eu não esqueça de realizar as manutenções importantes.

### Critérios de Aceitação
- [ ] Configurar lembrete em dias/km
- [ ] Notificação por email
- [ ] Desabilitar lembretes individuais
- [ ] Dashboard mostrando próximos lembretes
- [ ] Sincronização com calendário (Google/Outlook)

---

## US-021: Suporte a Múltiplos Veículos (Futura)

**Como** um proprietário com vários veículos,  
**Eu quero** gerenciar checklists para múltiplos veículos,  
**Para que** eu possa monitorar a manutenção de todos eles em um só lugar.

### Critérios de Aceitação
- [ ] Criar perfil por veículo
- [ ] Nomear veículos (ex: "Corolla Viagem", "Gol Cidade")
- [ ] Alternar entre veículos rapidamente
- [ ] Dashboard com visão geral de todos
- [ ] Histórico por veículo separado

---

## US-022: Exportar Checklist em PDF

**Como** um proprietário de veículo,  
**Eu quero** exportar o checklist como PDF,  
**Para que** eu tenha um documento permanente para arquivo e compartilhamento.

### Critérios de Aceitação
- [ ] Botão "Exportar PDF"
- [ ] PDF contém todas as informações (veículo, itens, justificativas, fontes)
- [ ] Formatação profissional
- [ ] Nome do arquivo com data e modelo do veículo
- [ ] Logo do AutoCare Advisor no PDF

---

## Mapa de Dependências

```
US-001 (Signup)
├─ US-002 (Login) ✓
│  ├─ US-018 (Autenticação)
│  ├─ US-004 (Descrever) ✓
│  │  ├─ US-005 (Gerar Checklist) ✓
│  │  │  ├─ US-006 (Visualizar) ✓
│  │  │  ├─ US-007 (Justificativas) ✓
│  │  │  ├─ US-008 (Fontes) ✓
│  │  │  ├─ US-013 (Info Normalizadas) ✓
│  │  │  └─ US-014 (Erro Descrição)
│  │  └─ US-009 (Marcar Concluído) ✓
│  │     └─ US-010 (Progresso) ✓
│  ├─ US-011 (Imprimir) ✓
│  ├─ US-012 (Nova Análise) ✓
│  └─ US-022 (Export PDF)
├─ US-016 (Responsivo) ✓
├─ US-017 (Acessível) ✓
├─ US-015 (Erro Conexão)
├─ US-019 (Histórico - Futura)
├─ US-020 (Lembretes - Futura)
└─ US-021 (Múltiplos Veículos - Futura)

✓ = Implementado/Em andamento
```

---

## Priorização (MoSCoW)

### MUST (Essencial)
- US-001: Signup
- US-002: Login
- US-004: Descrever Veículo
- US-005: Gerar Checklist
- US-006: Visualizar por Prioridade
- US-009: Marcar Concluído
- US-010: Visualizar Progresso

### SHOULD (Importante)
- US-003: Logout
- US-007: Justificativas
- US-008: Fontes Técnicas
- US-012: Nova Análise
- US-013: Info Normalizadas
- US-016: Responsivo
- US-017: Acessível
- US-018: Autenticação

### COULD (Desejável)
- US-011: Imprimir
- US-014: Erro Descrição
- US-015: Erro Conexão
- US-022: Export PDF

### WONT (Futuro)
- US-019: Histórico
- US-020: Lembretes
- US-021: Múltiplos Veículos

---

## Métricas de Sucesso

| User Story | Métrica | Meta |
|-----------|---------|------|
| US-004 | Tempo input/submit | < 2 segundos |
| US-005 | Tempo análise | < 10 segundos |
| US-006 | Carregamento página | < 1 segundo |
| US-007 | Compreensão (survey) | > 85% |
| US-009 | Interação click | 100ms |
| US-010 | Precisão progresso | 100% |
| US-016 | Compatibilidade | 95%+ dispositivos |
| US-017 | Acessibilidade | WCAG AA |

---
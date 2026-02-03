import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const systemPrompt = `Você é um Sistema de Suporte à Inspeção Veicular Preventiva com múltiplos especialistas automotivos.

Sua tarefa é interpretar descrições de veículos e gerar um checklist de inspeção personalizado, utilizando informações técnicas de fontes confiáveis quando disponíveis.

**INSTRUÇÕES:**
1. Identifique o modelo aproximado, idade estimada e tipo de uso do veículo
2. Gere um checklist dividido em três categorias de prioridade
3. Forneça justificativas técnicas acessíveis para cada item
4. IMPORTANTE: Incorpore informações das fontes técnicas fornecidas quando relevantes

**FORMATO DE RESPOSTA (JSON OBRIGATÓRIO):**
{
  "vehicleInfo": {
    "modelo": "string",
    "anoEstimado": "string", 
    "tipoUso": "string",
    "combustivel": "string",
    "quilometragemEstimada": "string"
  },
  "criticos": [
    {
      "item": "Nome do item",
      "descricao": "Descrição breve",
      "justificativa": "Por que verificar este item é crítico para este perfil de veículo",
      "fonte": "Nome da fonte técnica (se aplicável)"
    }
  ],
  "importantes": [
    {
      "item": "Nome do item",
      "descricao": "Descrição breve",
      "justificativa": "Por que este item é importante",
      "fonte": "Nome da fonte técnica (se aplicável)"
    }
  ],
  "recomendados": [
    {
      "item": "Nome do item",
      "descricao": "Descrição breve",
      "justificativa": "Por que este item é recomendado",
      "fonte": "Nome da fonte técnica (se aplicável)"
    }
  ],
  "fontes": [
    {
      "titulo": "Título da fonte",
      "url": "URL da fonte",
      "descricao": "Breve descrição do conteúdo relevante"
    }
  ]
}

**REGRAS:**
- Retorne APENAS o JSON, sem texto adicional
- Itens críticos: 5-8 itens (segurança e funcionamento essencial)
- Itens importantes: 5-8 itens (prevenção de falhas e custos)
- Itens recomendados: 4-6 itens (conforto e durabilidade)
- Personalize os itens com base no tipo de uso (urbano, estrada, comercial, rural, etc.)
- Para veículos mais antigos (>10 anos), enfatize verificações de corrosão e desgaste
- Para uso intenso (comercial, estrada de terra), priorize suspensão e sistema de arrefecimento
- Use linguagem técnica mas acessível
- Cite as fontes técnicas quando a informação vier de pesquisa`;

async function searchTechnicalSources(query: string, serperApiKey: string): Promise<any[]> {
  try {
    const searchQuery = `${query} manutenção preventiva inspeção veicular checklist técnico`;
    
    const response = await fetch("https://google.serper.dev/search", {
      method: "POST",
      headers: {
        "X-API-KEY": serperApiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q: searchQuery,
        gl: "br",
        hl: "pt-br",
        num: 5,
      }),
    });

    if (!response.ok) {
      console.error("Serper API error:", response.status);
      return [];
    }

    const data = await response.json();
    
    // Extract relevant results
    const sources = (data.organic || []).slice(0, 5).map((result: any) => ({
      titulo: result.title,
      url: result.link,
      snippet: result.snippet,
    }));

    return sources;
  } catch (error) {
    console.error("Error searching technical sources:", error);
    return [];
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { description } = await req.json();
    
    if (!description || typeof description !== "string") {
      return new Response(
        JSON.stringify({ error: "Descrição do veículo é obrigatória" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const SERPER_API_KEY = Deno.env.get("SERPER_API_KEY");
    
    // Search for technical sources if Serper API key is available
    let technicalSources: any[] = [];
    let sourcesContext = "";
    
    if (SERPER_API_KEY) {
      console.log("Searching technical sources for:", description);
      technicalSources = await searchTechnicalSources(description, SERPER_API_KEY);
      
      if (technicalSources.length > 0) {
        sourcesContext = `\n\n**FONTES TÉCNICAS ENCONTRADAS (use para enriquecer suas recomendações):**\n${technicalSources.map((s, i) => 
          `${i + 1}. ${s.titulo}\n   URL: ${s.url}\n   Resumo: ${s.snippet}`
        ).join("\n\n")}`;
        
        console.log(`Found ${technicalSources.length} technical sources`);
      }
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Descrição do veículo: ${description}${sourcesContext}` },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Limite de requisições excedido. Tente novamente em alguns minutos." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Créditos de IA esgotados. Adicione mais créditos na sua conta." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content in AI response");
    }

    // Parse the JSON from the AI response
    let checklist;
    try {
      // Try to extract JSON from the response (in case there's extra text)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        checklist = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      throw new Error("Falha ao processar resposta da IA");
    }

    // Add checked: false to all items
    if (checklist.criticos) {
      checklist.criticos = checklist.criticos.map((item: any) => ({ ...item, checked: false }));
    }
    if (checklist.importantes) {
      checklist.importantes = checklist.importantes.map((item: any) => ({ ...item, checked: false }));
    }
    if (checklist.recomendados) {
      checklist.recomendados = checklist.recomendados.map((item: any) => ({ ...item, checked: false }));
    }

    // Add sources if not already included by AI
    if (!checklist.fontes && technicalSources.length > 0) {
      checklist.fontes = technicalSources.map(s => ({
        titulo: s.titulo,
        url: s.url,
        descricao: s.snippet
      }));
    }

    return new Response(JSON.stringify(checklist), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("analyze-vehicle error:", error);
    const message = error instanceof Error ? error.message : "Erro desconhecido";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

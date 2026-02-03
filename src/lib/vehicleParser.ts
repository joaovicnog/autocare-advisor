export interface VehicleInfo {
  modelo: string;
  ano: string;
  idadeEstimada: string;
  tipoUso: string;
  quilometragem?: string;
  combustivel?: string;
}

export interface ChecklistItem {
  item: string;
  descricao: string;
  justificativa: string;
  checked: boolean;
  fonte?: string;
}

export interface TechnicalSource {
  titulo: string;
  url: string;
  descricao: string;
}

export interface ChecklistResult {
  vehicleInfo: VehicleInfo;
  criticos: ChecklistItem[];
  importantes: ChecklistItem[];
  recomendados: ChecklistItem[];
  fontes?: TechnicalSource[];
}

const modelos = [
  'gol', 'palio', 'uno', 'civic', 'corolla', 'fiesta', 'ka', 'hb20', 'onix', 'prisma',
  'fox', 'polo', 'virtus', 'jetta', 'cruze', 'cobalt', 'spin', 'tracker', 'creta',
  'compass', 'renegade', 'kicks', 't-cross', 'hr-v', 'argo', 'cronos', 'mobi', 'toro',
  'hilux', 's10', 'ranger', 'amarok', 'strada', 'saveiro', 'montana', 'fiat', 'volkswagen',
  'chevrolet', 'ford', 'honda', 'toyota', 'hyundai', 'jeep', 'nissan', 'renault', 'peugeot',
  'citroen', 'mitsubishi', 'bmw', 'mercedes', 'audi', 'volvo', 'kia', 'chery', 'jac',
  'caoa chery', 'ram', 'dodge', 'land rover', 'jaguar', 'porsche', 'subaru', 'suzuki'
];

const tiposUso = {
  urbano: ['cidade', 'urbano', 'dia a dia', 'trabalho', 'curtas distâncias', 'trânsito', 'diário'],
  estrada: ['viagem', 'estrada', 'rodovia', 'longas distâncias', 'viagens', 'rodoviário'],
  misto: ['misto', 'cidade e estrada', 'variado'],
  comercial: ['comercial', 'entregas', 'uber', '99', 'app', 'táxi', 'frete', 'carga'],
  offroad: ['terra', 'off-road', 'fazenda', 'rural', 'campo', 'trilha']
};

export function parseVehicleDescription(texto: string): VehicleInfo {
  const textoLower = texto.toLowerCase();
  
  // Identificar modelo
  let modelo = 'Não identificado';
  for (const m of modelos) {
    if (textoLower.includes(m)) {
      modelo = m.charAt(0).toUpperCase() + m.slice(1);
      break;
    }
  }

  // Identificar ano
  const anoMatch = texto.match(/\b(19|20)\d{2}\b/);
  const anoAtual = new Date().getFullYear();
  let ano = anoMatch ? anoMatch[0] : 'Não informado';
  let idadeEstimada = 'Não calculada';
  
  if (anoMatch) {
    const anoNumero = parseInt(anoMatch[0]);
    const idade = anoAtual - anoNumero;
    if (idade <= 3) idadeEstimada = 'Novo (até 3 anos)';
    else if (idade <= 7) idadeEstimada = 'Seminovo (4-7 anos)';
    else if (idade <= 12) idadeEstimada = 'Usado (8-12 anos)';
    else idadeEstimada = 'Antigo (mais de 12 anos)';
  }

  // Identificar tipo de uso
  let tipoUso = 'Misto (padrão)';
  for (const [tipo, palavras] of Object.entries(tiposUso)) {
    for (const palavra of palavras) {
      if (textoLower.includes(palavra)) {
        tipoUso = tipo.charAt(0).toUpperCase() + tipo.slice(1);
        break;
      }
    }
  }

  // Quilometragem
  const kmMatch = texto.match(/(\d{1,3}(?:\.\d{3})*|\d+)\s*(?:km|quilômetros|mil km)/i);
  let quilometragem = kmMatch ? kmMatch[0] : undefined;

  // Combustível
  let combustivel: string | undefined;
  if (textoLower.includes('flex')) combustivel = 'Flex';
  else if (textoLower.includes('diesel')) combustivel = 'Diesel';
  else if (textoLower.includes('gasolina')) combustivel = 'Gasolina';
  else if (textoLower.includes('etanol') || textoLower.includes('álcool')) combustivel = 'Etanol';
  else if (textoLower.includes('elétrico')) combustivel = 'Elétrico';
  else if (textoLower.includes('híbrido')) combustivel = 'Híbrido';

  return { modelo, ano, idadeEstimada, tipoUso, quilometragem, combustivel };
}

export function generateChecklist(info: VehicleInfo): ChecklistResult {
  const isOld = info.idadeEstimada.includes('Antigo') || info.idadeEstimada.includes('Usado');
  const isHighMileage = info.quilometragem?.includes('100') || info.quilometragem?.includes('mil');
  const isCommercial = info.tipoUso.toLowerCase().includes('comercial');
  const isOffroad = info.tipoUso.toLowerCase().includes('offroad');
  const isRoad = info.tipoUso.toLowerCase().includes('estrada');

  const criticos: ChecklistItem[] = [
    {
      item: 'Sistema de Freios',
      descricao: 'Verificar pastilhas, discos, fluido e flexíveis de freio',
      justificativa: 'O sistema de freios é crítico para a segurança. Pastilhas desgastadas podem aumentar a distância de frenagem em até 50%. Fluido velho absorve umidade e reduz eficiência.',
      checked: false
    },
    {
      item: 'Pneus',
      descricao: 'Verificar profundidade dos sulcos (mín. 1,6mm), desgaste irregular e pressão',
      justificativa: 'Pneus são o único contato do veículo com o solo. Sulcos rasos aumentam risco de aquaplanagem. Pressão incorreta afeta frenagem e estabilidade.',
      checked: false
    },
    {
      item: 'Direção e Suspensão',
      descricao: 'Verificar folgas, ruídos e vazamentos no sistema',
      justificativa: 'Componentes desgastados comprometem a dirigibilidade e podem causar perda de controle. Pivôs e terminais com folga são perigosos.',
      checked: false
    },
    {
      item: 'Iluminação',
      descricao: 'Testar faróis, lanternas, setas, luz de freio e ré',
      justificativa: 'Iluminação deficiente reduz visibilidade e dificulta que outros motoristas vejam seu veículo. É item de segurança obrigatório.',
      checked: false
    },
    {
      item: 'Nível de Óleo do Motor',
      descricao: 'Verificar nível e condição do óleo lubrificante',
      justificativa: 'Motor sem óleo adequado sofre desgaste prematuro e pode fundir. Óleo escuro demais indica necessidade de troca.',
      checked: false
    }
  ];

  const importantes: ChecklistItem[] = [
    {
      item: 'Sistema de Arrefecimento',
      descricao: 'Verificar nível do líquido de arrefecimento, mangueiras e radiador',
      justificativa: 'Superaquecimento pode causar danos graves ao motor, como empenamento do cabeçote. Mangueiras ressecadas podem estourar.',
      checked: false
    },
    {
      item: 'Bateria',
      descricao: 'Verificar carga, terminais e fixação',
      justificativa: 'Bateria fraca pode deixá-lo na mão. Terminais oxidados causam mau contato. Vida útil média é de 2-3 anos.',
      checked: false
    },
    {
      item: 'Correias (Dentada/Acessórios)',
      descricao: 'Inspecionar estado, rachaduras e tensão das correias',
      justificativa: 'Correia dentada rompida pode causar dano catastrófico ao motor (válvulas x pistões). Troca preventiva é essencial.',
      checked: false
    },
    {
      item: 'Filtro de Ar',
      descricao: 'Verificar estado e necessidade de substituição',
      justificativa: 'Filtro sujo reduz entrada de ar, aumentando consumo de combustível e reduzindo potência do motor.',
      checked: false
    },
    {
      item: 'Limpadores e Lavador',
      descricao: 'Testar funcionamento das palhetas e reservatório do lavador',
      justificativa: 'Palhetas desgastadas prejudicam visibilidade em dias de chuva, aumentando risco de acidentes.',
      checked: false
    }
  ];

  const recomendados: ChecklistItem[] = [
    {
      item: 'Sistema de Escapamento',
      descricao: 'Verificar vazamentos, fixações e estado do catalisador',
      justificativa: 'Vazamentos causam ruídos, poluição excessiva e podem permitir entrada de gases tóxicos na cabine.',
      checked: false
    },
    {
      item: 'Alinhamento e Balanceamento',
      descricao: 'Verificar se há vibração no volante ou desgaste irregular dos pneus',
      justificativa: 'Desalinhamento causa desgaste irregular dos pneus e aumento do consumo. Desbalanceamento gera vibração.',
      checked: false
    },
    {
      item: 'Cabine (Cintos e Airbags)',
      descricao: 'Verificar funcionamento dos cintos de segurança e luz de airbag',
      justificativa: 'Itens de segurança passiva que salvam vidas em colisões. Luz de airbag acesa indica problema no sistema.',
      checked: false
    },
    {
      item: 'Ar Condicionado',
      descricao: 'Testar funcionamento, temperatura e odores',
      justificativa: 'Sistema com pouco gás trabalha forçado. Filtro de cabine sujo pode causar alergias e mau cheiro.',
      checked: false
    },
    {
      item: 'Documentação',
      descricao: 'Verificar licenciamento, IPVA e seguro obrigatório (DPVAT)',
      justificativa: 'Documentação irregular gera multas e pode resultar em apreensão do veículo.',
      checked: false
    }
  ];

  // Adicionar itens específicos baseado no perfil
  if (isOld) {
    criticos.push({
      item: 'Inspeção de Corrosão',
      descricao: 'Verificar pontos de ferrugem na carroceria, longarinas e assoalho',
      justificativa: 'Veículos mais antigos são suscetíveis à corrosão estrutural, que pode comprometer a segurança.',
      checked: false
    });
  }

  if (isCommercial) {
    importantes.unshift({
      item: 'Embreagem',
      descricao: 'Verificar curso do pedal, patinação e ruídos',
      justificativa: 'Uso intensivo em tráfego urbano (para-anda) acelera desgaste da embreagem. Patinação indica necessidade de troca.',
      checked: false
    });
  }

  if (isRoad) {
    importantes.push({
      item: 'Estepe e Macaco',
      descricao: 'Verificar calibragem do estepe e funcionamento do macaco',
      justificativa: 'Em viagens, ter estepe calibrado e ferramentas funcionando é essencial para emergências.',
      checked: false
    });
  }

  if (isOffroad) {
    importantes.push({
      item: 'Proteções Inferiores',
      descricao: 'Verificar estado das proteções de cárter e diferencial',
      justificativa: 'Uso em terrenos irregulares exige proteção extra dos componentes mecânicos contra impactos.',
      checked: false
    });
  }

  return {
    vehicleInfo: info,
    criticos,
    importantes,
    recomendados
  };
}

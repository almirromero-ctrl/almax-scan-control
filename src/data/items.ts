export type ItemCategory = "Peça/Ferramenta" | "EPI" | "Consumível";

export interface Item {
  id: string;
  code: string;
  name: string;
  category: ItemCategory;
  unit: string;
  currentStock: number;
  minStock: number;
  observation?: string;
}

export const initialItems: Item[] = [
  {
    id: "1",
    code: "PF001",
    name: "Parafuso métrico M6 × 20",
    category: "Peça/Ferramenta",
    unit: "un",
    currentStock: 250,
    minStock: 50,
    observation: "peça de fixação"
  },
  {
    id: "2",
    code: "PF002",
    name: "Porca métrica M6",
    category: "Peça/Ferramenta",
    unit: "un",
    currentStock: 180,
    minStock: 40,
    observation: "complemento de parafuso"
  },
  {
    id: "3",
    code: "FR003",
    name: "Chave combinada 10mm",
    category: "Peça/Ferramenta",
    unit: "un",
    currentStock: 12,
    minStock: 5,
    observation: "mão de obra manutenção"
  },
  {
    id: "4",
    code: "FR004",
    name: "Martelo de maçariqueira",
    category: "Peça/Ferramenta",
    unit: "un",
    currentStock: 8,
    minStock: 3,
    observation: "manutenção/calderaria"
  },
  {
    id: "5",
    code: "FR005",
    name: "Serra tico-tico",
    category: "Peça/Ferramenta",
    unit: "un",
    currentStock: 5,
    minStock: 2,
    observation: "corte peças chapas"
  },
  {
    id: "6",
    code: "FR006",
    name: "Lima (kit)",
    category: "Peça/Ferramenta",
    unit: "un",
    currentStock: 15,
    minStock: 5,
    observation: "acabamento peças usinagem"
  },
  {
    id: "7",
    code: "EPI007",
    name: "Óculos de proteção (EPI)",
    category: "EPI",
    unit: "par",
    currentStock: 45,
    minStock: 20,
    observation: "proteção ocular"
  },
  {
    id: "8",
    code: "EPI008",
    name: "Máscara respiratória descartável",
    category: "EPI",
    unit: "un",
    currentStock: 120,
    minStock: 50,
    observation: "proteção pó/fumaça"
  },
  {
    id: "9",
    code: "EPI009",
    name: "Luvas de vaqueta",
    category: "EPI",
    unit: "par",
    currentStock: 65,
    minStock: 30,
    observation: "proteção mãos"
  },
  {
    id: "10",
    code: "EPI010",
    name: "Botina de segurança com bico de aço",
    category: "EPI",
    unit: "par",
    currentStock: 28,
    minStock: 15,
    observation: "proteção pés"
  },
  {
    id: "11",
    code: "EPI011",
    name: "Capacete de segurança",
    category: "EPI",
    unit: "un",
    currentStock: 35,
    minStock: 20,
    observation: "proteção cabeça"
  },
  {
    id: "12",
    code: "EPI012",
    name: "Protetor auricular",
    category: "EPI",
    unit: "par",
    currentStock: 52,
    minStock: 25,
    observation: "proteção auditiva"
  },
  {
    id: "13",
    code: "EPI013",
    name: "Avental de raspa",
    category: "EPI",
    unit: "un",
    currentStock: 18,
    minStock: 10,
    observation: "proteção corpo contra faísca"
  },
  {
    id: "14",
    code: "EPI014",
    name: "Cinto de segurança",
    category: "EPI",
    unit: "un",
    currentStock: 8,
    minStock: 5,
    observation: "trabalhos em altura"
  },
  {
    id: "15",
    code: "CNS015",
    name: "Óleo de corte / fluido lubrificante",
    category: "Consumível",
    unit: "litro",
    currentStock: 75,
    minStock: 30,
    observation: "suporte para máquinas"
  },
  {
    id: "16",
    code: "CNS016",
    name: "Disco de corte de metal",
    category: "Consumível",
    unit: "un",
    currentStock: 42,
    minStock: 20,
    observation: "uso para esmerilhadeira"
  },
  {
    id: "17",
    code: "FR017",
    name: "Escova de aço (kit)",
    category: "Peça/Ferramenta",
    unit: "un",
    currentStock: 22,
    minStock: 10,
    observation: "limpeza peças etc."
  }
];

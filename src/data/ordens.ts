export interface Ordem {
  id: string;
  veiculo: string;
  servico: string;
  status: string;
  prioridade: string;
  data: string;
  valor: string;
  observacoes?: string;
}

export const ordensIniciais: Ordem[] = [
  { id: "OS-2024-0147", veiculo: "Scania R450 — ABC-1D23", servico: "Troca de embreagem", status: "em_andamento", prioridade: "alta", data: "19/03/2026", valor: "R$ 4.850,00" },
  { id: "OS-2024-0146", veiculo: "Volvo FH 540 — XYZ-9K87", servico: "Revisão completa", status: "concluida", prioridade: "normal", data: "18/03/2026", valor: "R$ 2.300,00" },
  { id: "OS-2024-0145", veiculo: "Carreta Randon — QRS-4F56", servico: "Troca de lonas de freio", status: "pendente", prioridade: "alta", data: "17/03/2026", valor: "R$ 1.200,00" },
  { id: "OS-2024-0144", veiculo: "Mercedes Actros — LMN-7H01", servico: "Troca de óleo e filtros", status: "concluida", prioridade: "normal", data: "16/03/2026", valor: "R$ 890,00" },
  { id: "OS-2024-0143", veiculo: "DAF XF — GHI-2B34", servico: "Alinhamento e balanceamento", status: "em_andamento", prioridade: "normal", data: "15/03/2026", valor: "R$ 650,00" },
  { id: "OS-2024-0142", veiculo: "Scania R450 — ABC-1D23", servico: "Troca de pneus (6 eixos)", status: "pendente", prioridade: "urgente", data: "14/03/2026", valor: "R$ 12.400,00" },
];
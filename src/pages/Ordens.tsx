import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Search, CheckCircle, Clock, Wrench } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

interface Ordem {
  id: string;
  veiculo: string;
  servico: string;
  status: string;
  prioridade: string;
  data: string;
  valor: string;
}

const ordensIniciais: Ordem[] = [
  { id: "OS-2024-0147", veiculo: "Scania R450 — ABC-1D23", servico: "Troca de embreagem", status: "em_andamento", prioridade: "alta", data: "19/03/2026", valor: "R$ 4.850,00" },
  { id: "OS-2024-0146", veiculo: "Volvo FH 540 — XYZ-9K87", servico: "Revisão completa", status: "concluida", prioridade: "normal", data: "18/03/2026", valor: "R$ 2.300,00" },
  { id: "OS-2024-0145", veiculo: "Carreta Randon — QRS-4F56", servico: "Troca de lonas de freio", status: "pendente", prioridade: "alta", data: "17/03/2026", valor: "R$ 1.200,00" },
  { id: "OS-2024-0144", veiculo: "Mercedes Actros — LMN-7H01", servico: "Troca de óleo e filtros", status: "concluida", prioridade: "normal", data: "16/03/2026", valor: "R$ 890,00" },
  { id: "OS-2024-0143", veiculo: "DAF XF — GHI-2B34", servico: "Alinhamento e balanceamento", status: "em_andamento", prioridade: "normal", data: "15/03/2026", valor: "R$ 650,00" },
  { id: "OS-2024-0142", veiculo: "Scania R450 — ABC-1D23", servico: "Troca de pneus (6 eixos)", status: "pendente", prioridade: "urgente", data: "14/03/2026", valor: "R$ 12.400,00" },
];

const veiculosDisponiveis = [
  "Scania R450 — ABC-1D23",
  "Volvo FH 540 — XYZ-9K87",
  "Carreta Randon — QRS-4F56",
  "Mercedes Actros — LMN-7H01",
  "DAF XF — GHI-2B34",
  "Carreta Librelato — DEF-5G78",
];

const statusConfig: Record<string, { label: string; className: string; icon: typeof CheckCircle }> = {
  pendente: { label: "Pendente", className: "bg-warning/15 text-warning border-warning/30", icon: Clock },
  em_andamento: { label: "Em Andamento", className: "bg-info/15 text-info border-info/30", icon: Wrench },
  concluida: { label: "Concluída", className: "bg-success/15 text-success border-success/30", icon: CheckCircle },
};

const prioridadeConfig: Record<string, string> = {
  normal: "bg-muted text-muted-foreground",
  alta: "bg-warning/15 text-warning border-warning/30",
  urgente: "bg-destructive/15 text-destructive border-destructive/30",
};

export default function OrdensPage() {
  const [ordens, setOrdens] = useState<Ordem[]>(ordensIniciais);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [veiculo, setVeiculo] = useState("");
  const [servico, setServico] = useState("");
  const [prioridade, setPrioridade] = useState("");
  const [valor, setValor] = useState("");
  const [observacoes, setObservacoes] = useState("");

  const resetForm = () => {
    setVeiculo("");
    setServico("");
    setPrioridade("");
    setValor("");
    setObservacoes("");
  };

  const handleSubmit = () => {
    if (!veiculo || !servico || !prioridade) {
      toast({ title: "Preencha os campos obrigatórios", description: "Veículo, serviço e prioridade são obrigatórios.", variant: "destructive" });
      return;
    }

    const hoje = new Date();
    const dataFormatada = `${String(hoje.getDate()).padStart(2, "0")}/${String(hoje.getMonth() + 1).padStart(2, "0")}/${hoje.getFullYear()}`;
    const dia = String(hoje.getDate()).padStart(2, "0");
    const mes = String(hoje.getMonth() + 1).padStart(2, "0");
    const ano = hoje.getFullYear();
    const hora = `${String(hoje.getHours()).padStart(2, "0")}${String(hoje.getMinutes()).padStart(2, "0")}`;
    const nomeVeiculo = veiculo.split(" — ")[0].replace(/\s+/g, "");
    const novoId = `${nomeVeiculo}-OS-${dia}-${mes}-${ano}-${hora}`;

    const novaOrdem: Ordem = {
      id: novoId,
      veiculo,
      servico,
      status: "pendente",
      prioridade,
      data: dataFormatada,
      valor: valor || "A orçar",
    };

    setOrdens([novaOrdem, ...ordens]);
    setDialogOpen(false);
    resetForm();
    toast({ title: "Ordem criada com sucesso!", description: `${novoId} foi adicionada.` });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Ordens de Serviço</h2>
            <p className="text-muted-foreground mt-1">Gerencie todas as ordens de manutenção</p>
          </div>
          <Button onClick={() => setDialogOpen(true)} className="bg-accent text-accent-foreground hover:bg-accent/90 active:scale-[0.97] transition-all">
            <Plus className="h-4 w-4 mr-2" />
            Nova Ordem
          </Button>
        </div>

        <div className="relative max-w-sm animate-fade-in">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar por número ou veículo..." className="pl-9" />
        </div>

        <Card className="animate-fade-up shadow-sm" style={{ animationDelay: "100ms" }}>
          <CardHeader>
            <CardTitle className="text-lg">Todas as Ordens</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="pb-3 pr-4 font-medium">Ordem</th>
                    <th className="pb-3 pr-4 font-medium">Veículo</th>
                    <th className="pb-3 pr-4 font-medium">Serviço</th>
                    <th className="pb-3 pr-4 font-medium">Prioridade</th>
                    <th className="pb-3 pr-4 font-medium">Status</th>
                    <th className="pb-3 pr-4 font-medium">Valor</th>
                    <th className="pb-3 font-medium">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {ordens.map((o) => {
                    const sc = statusConfig[o.status];
                    return (
                      <tr key={o.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors cursor-pointer active:bg-muted">
                        <td className="py-3 pr-4 font-mono text-xs font-medium">{o.id}</td>
                        <td className="py-3 pr-4">{o.veiculo}</td>
                        <td className="py-3 pr-4">{o.servico}</td>
                        <td className="py-3 pr-4">
                          <Badge variant="outline" className={prioridadeConfig[o.prioridade]}>
                            {o.prioridade.charAt(0).toUpperCase() + o.prioridade.slice(1)}
                          </Badge>
                        </td>
                        <td className="py-3 pr-4">
                          <Badge variant="outline" className={sc.className}>
                            <sc.icon className="h-3 w-3 mr-1" />
                            {sc.label}
                          </Badge>
                        </td>
                        <td className="py-3 pr-4 tabular-nums font-medium">{o.valor}</td>
                        <td className="py-3 tabular-nums">{o.data}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialog Nova Ordem */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Nova Ordem de Serviço</DialogTitle>
            <DialogDescription>Preencha os dados para criar uma nova ordem de manutenção.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="veiculo">Veículo *</Label>
              <Select value={veiculo} onValueChange={setVeiculo}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o veículo" />
                </SelectTrigger>
                <SelectContent>
                  {veiculosDisponiveis.map((v) => (
                    <SelectItem key={v} value={v}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="servico">Serviço *</Label>
              <Input id="servico" placeholder="Ex: Troca de embreagem" value={servico} onChange={(e) => setServico(e.target.value)} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="prioridade">Prioridade *</Label>
                <Select value={prioridade} onValueChange={setPrioridade}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="alta">Alta</SelectItem>
                    <SelectItem value="urgente">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="valor">Valor estimado</Label>
                <Input id="valor" placeholder="R$ 0,00" value={valor} onChange={(e) => setValor(e.target.value)} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="obs">Observações</Label>
              <Textarea id="obs" placeholder="Detalhes adicionais sobre o serviço..." value={observacoes} onChange={(e) => setObservacoes(e.target.value)} rows={3} />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => { setDialogOpen(false); resetForm(); }}>Cancelar</Button>
            <Button onClick={handleSubmit} className="bg-accent text-accent-foreground hover:bg-accent/90">Criar Ordem</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}

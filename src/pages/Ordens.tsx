import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Search, CheckCircle, Clock, Wrench, Pencil, Trash2, Eye, Minus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { ordensIniciais, type Ordem } from "@/data/ordens";

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
  const [busca, setBusca] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [viewIndex, setViewIndex] = useState<number | null>(null);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const [veiculo, setVeiculo] = useState("");
  const [servico, setServico] = useState("");
  const [prioridade, setPrioridade] = useState("");
  const [valor, setValor] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [statusEdit, setStatusEdit] = useState("");

  const resetForm = () => {
    setVeiculo("");
    setServico("");
    setPrioridade("");
    setValor("");
    setObservacoes("");
    setStatusEdit("");
    setEditIndex(null);
  };

  const openEdit = (i: number) => {
    const o = ordens[i];
    setVeiculo(o.veiculo);
    setServico(o.servico);
    setPrioridade(o.prioridade);
    setValor(o.valor);
    setObservacoes(o.observacoes || "");
    setStatusEdit(o.status);
    setEditIndex(i);
    setDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!veiculo || !servico || !prioridade) {
      toast({ title: "Preencha os campos obrigatórios", description: "Veículo, defeito e prioridade são obrigatórios.", variant: "destructive" });
      return;
    }

    if (editIndex !== null) {
      setOrdens((prev) =>
        prev.map((o, i) =>
          i === editIndex
            ? { ...o, veiculo, servico, prioridade, valor: valor || "A orçar", observacoes, status: statusEdit || o.status }
            : o
        )
      );
      setDialogOpen(false);
      resetForm();
      toast({ title: "Ordem atualizada com sucesso!" });
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
      observacoes,
    };

    setOrdens([novaOrdem, ...ordens]);
    setDialogOpen(false);
    resetForm();
    toast({ title: "Ordem criada com sucesso!", description: `${novoId} foi adicionada.` });
  };

  const handleDelete = () => {
    if (deleteIndex === null) return;
    const id = ordens[deleteIndex].id;
    setOrdens((prev) => prev.filter((_, i) => i !== deleteIndex));
    setDeleteIndex(null);
    toast({ title: "Ordem excluída", description: `${id} foi removida.` });
  };

  const ordensFiltradas = ordens.filter(
    (o) =>
      o.id.toLowerCase().includes(busca.toLowerCase()) ||
      o.veiculo.toLowerCase().includes(busca.toLowerCase()) ||
      o.servico.toLowerCase().includes(busca.toLowerCase())
  );

  const viewOrdem = viewIndex !== null ? ordens[viewIndex] : null;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Ordens de Serviço</h2>
            <p className="text-muted-foreground mt-1">Gerencie todas as ordens de manutenção</p>
          </div>
          <Button onClick={() => { resetForm(); setDialogOpen(true); }} className="bg-accent text-accent-foreground hover:bg-accent/90 active:scale-[0.97] transition-all">
            <Plus className="h-4 w-4 mr-2" />
            Nova Ordem
          </Button>
        </div>

        <div className="relative max-w-sm animate-fade-in">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar por número, veículo ou defeito..." className="pl-9" value={busca} onChange={(e) => setBusca(e.target.value)} />
        </div>

        {/* Desktop table */}
        <Card className="animate-fade-up shadow-sm hidden md:block" style={{ animationDelay: "100ms" }}>
          <CardHeader>
            <CardTitle className="text-lg">Todas as Ordens ({ordensFiltradas.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="pb-3 pr-4 font-medium">Ordem</th>
                    <th className="pb-3 pr-4 font-medium">Veículo</th>
                    <th className="pb-3 pr-4 font-medium">Defeito</th>
                    <th className="pb-3 pr-4 font-medium">Prioridade</th>
                    <th className="pb-3 pr-4 font-medium">Status</th>
                    <th className="pb-3 pr-4 font-medium">Valor</th>
                    <th className="pb-3 pr-4 font-medium">Data</th>
                    <th className="pb-3 font-medium text-right">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {ordensFiltradas.map((o) => {
                    const sc = statusConfig[o.status];
                    const realIndex = ordens.indexOf(o);
                    return (
                      <tr key={o.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
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
                        <td className="py-3 pr-4 tabular-nums">{o.data}</td>
                        <td className="py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setViewIndex(realIndex)}>
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(realIndex)}>
                              <Pencil className="h-4 w-4 text-muted-foreground" />
                            </Button>
                            <Button size="icon" className="h-8 w-8 bg-destructive hover:bg-destructive/90 text-destructive-foreground" onClick={() => setDeleteIndex(realIndex)}>
                              <Minus className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {ordensFiltradas.length === 0 && (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-muted-foreground">Nenhuma ordem encontrada.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Mobile cards */}
        <div className="md:hidden space-y-3">
          <h3 className="text-lg font-semibold">Todas as Ordens ({ordensFiltradas.length})</h3>
          {ordensFiltradas.map((o) => {
            const sc = statusConfig[o.status];
            const realIndex = ordens.indexOf(o);
            return (
              <Card key={o.id} className="shadow-sm">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-mono text-xs font-medium">{o.id}</p>
                      <p className="text-sm font-medium mt-1">{o.veiculo}</p>
                    </div>
                    <Badge variant="outline" className={sc.className}>
                      <sc.icon className="h-3 w-3 mr-1" />
                      {sc.label}
                    </Badge>
                  </div>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between"><span className="text-muted-foreground">Defeito</span><span>{o.servico}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Prioridade</span><Badge variant="outline" className={prioridadeConfig[o.prioridade]}>{o.prioridade.charAt(0).toUpperCase() + o.prioridade.slice(1)}</Badge></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Valor</span><span className="font-medium tabular-nums">{o.valor}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Data</span><span className="tabular-nums">{o.data}</span></div>
                  </div>
                  <div className="flex items-center justify-end gap-1 pt-2 border-t">
                    <Button variant="ghost" size="sm" className="h-8 gap-1" onClick={() => setViewIndex(realIndex)}>
                      <Eye className="h-3.5 w-3.5" /> Ver
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 gap-1" onClick={() => openEdit(realIndex)}>
                      <Pencil className="h-3.5 w-3.5" /> Editar
                    </Button>
                    <Button size="sm" className="h-8 gap-1 bg-destructive hover:bg-destructive/90 text-destructive-foreground" onClick={() => setDeleteIndex(realIndex)}>
                      <Minus className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
          {ordensFiltradas.length === 0 && (
            <p className="text-center text-muted-foreground py-8">Nenhuma ordem encontrada.</p>
          )}
        </div>
      </div>

      {/* Dialog Criar / Editar */}
      <Dialog open={dialogOpen} onOpenChange={(v) => { setDialogOpen(v); if (!v) resetForm(); }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editIndex !== null ? "Editar Ordem de Serviço" : "Nova Ordem de Serviço"}</DialogTitle>
            <DialogDescription>{editIndex !== null ? "Atualize os dados da ordem." : "Preencha os dados para criar uma nova ordem."}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Veículo *</Label>
              <Select value={veiculo} onValueChange={setVeiculo}>
                <SelectTrigger><SelectValue placeholder="Selecione o veículo" /></SelectTrigger>
                <SelectContent>
                  {veiculosDisponiveis.map((v) => (<SelectItem key={v} value={v}>{v}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Defeito *</Label>
              <Input placeholder="Ex: Embreagem patinando" value={servico} onChange={(e) => setServico(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Prioridade *</Label>
                <Select value={prioridade} onValueChange={setPrioridade}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="alta">Alta</SelectItem>
                    <SelectItem value="urgente">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Valor estimado</Label>
                <Input placeholder="R$ 0,00" value={valor} onChange={(e) => setValor(e.target.value)} />
              </div>
            </div>
            {editIndex !== null && (
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={statusEdit} onValueChange={setStatusEdit}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pendente">Pendente</SelectItem>
                    <SelectItem value="em_andamento">Em Andamento</SelectItem>
                    <SelectItem value="concluida">Concluída</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="space-y-2">
              <Label>Serviço executado</Label>
              <Textarea placeholder="Descreva o serviço realizado..." value={observacoes} onChange={(e) => setObservacoes(e.target.value)} rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setDialogOpen(false); resetForm(); }}>Cancelar</Button>
            <Button onClick={handleSubmit} className="bg-accent text-accent-foreground hover:bg-accent/90">
              {editIndex !== null ? "Salvar Alterações" : "Criar Ordem"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Visualizar */}
      <Dialog open={viewIndex !== null} onOpenChange={() => setViewIndex(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Detalhes da Ordem</DialogTitle>
          </DialogHeader>
          {viewOrdem && (
            <div className="space-y-3 py-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">ID</span><span className="font-mono font-medium">{viewOrdem.id}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Veículo</span><span>{viewOrdem.veiculo}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Defeito</span><span>{viewOrdem.servico}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Prioridade</span><Badge variant="outline" className={prioridadeConfig[viewOrdem.prioridade]}>{viewOrdem.prioridade}</Badge></div>
              <div className="flex justify-between items-center"><span className="text-muted-foreground">Status</span><Badge variant="outline" className={statusConfig[viewOrdem.status].className}>{statusConfig[viewOrdem.status].label}</Badge></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Valor</span><span className="font-medium">{viewOrdem.valor}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Data</span><span>{viewOrdem.data}</span></div>
              {viewOrdem.observacoes && <div><span className="text-muted-foreground block mb-1">Serviço executado</span><p className="bg-muted rounded-md p-3">{viewOrdem.observacoes}</p></div>}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewIndex(null)}>Fechar</Button>
            <Button onClick={() => { if (viewIndex !== null) { openEdit(viewIndex); setViewIndex(null); } }} className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Pencil className="h-4 w-4 mr-2" /> Editar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Confirmar Exclusão */}
      <Dialog open={deleteIndex !== null} onOpenChange={() => setDeleteIndex(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Excluir Ordem</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir a ordem <strong>{deleteIndex !== null ? ordens[deleteIndex]?.id : ""}</strong>? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteIndex(null)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleDelete}>Excluir</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}

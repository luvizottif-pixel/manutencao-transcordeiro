import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

interface Veiculo {
  placa: string;
  modelo: string;
  tipo: string;
  ano: number;
  cliente: string;
  status: string;
}

const veiculosIniciais: Veiculo[] = [
  { placa: "ABC-1D23", modelo: "Scania R450", tipo: "Cavalo Mecânico", ano: 2022, cliente: "Transportes Silva", status: "ativo" },
  { placa: "XYZ-9K87", modelo: "Volvo FH 540", tipo: "Cavalo Mecânico", ano: 2021, cliente: "Logística Norte", status: "em_manutencao" },
  { placa: "QRS-4F56", modelo: "Randon SR BA", tipo: "Carreta", ano: 2020, cliente: "Transportes Silva", status: "ativo" },
  { placa: "LMN-7H01", modelo: "Mercedes Actros 2651", tipo: "Cavalo Mecânico", ano: 2023, cliente: "Frota Express", status: "ativo" },
  { placa: "GHI-2B34", modelo: "DAF XF 530", tipo: "Cavalo Mecânico", ano: 2022, cliente: "Rodoviário Sul", status: "em_manutencao" },
  { placa: "DEF-5G78", modelo: "Librelato SBBP", tipo: "Carreta", ano: 2019, cliente: "Logística Norte", status: "inativo" },
];

const statusMap: Record<string, { label: string; className: string }> = {
  ativo: { label: "Ativo", className: "bg-success/15 text-success border-success/30" },
  em_manutencao: { label: "Em Manutenção", className: "bg-warning/15 text-warning border-warning/30" },
  inativo: { label: "Inativo", className: "bg-muted text-muted-foreground" },
};

export default function VeiculosPage() {
  const [veiculos, setVeiculos] = useState<Veiculo[]>(veiculosIniciais);
  const [busca, setBusca] = useState("");
  const [open, setOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const [placa, setPlaca] = useState("");
  const [modelo, setModelo] = useState("");
  const [tipo, setTipo] = useState("");
  const [ano, setAno] = useState("");
  const [cliente, setCliente] = useState("");
  const [statusVeiculo, setStatusVeiculo] = useState("");

  const resetForm = () => {
    setPlaca(""); setModelo(""); setTipo(""); setAno(""); setCliente(""); setStatusVeiculo(""); setEditIndex(null);
  };

  const openEdit = (i: number) => {
    const v = veiculos[i];
    setPlaca(v.placa); setModelo(v.modelo); setTipo(v.tipo); setAno(String(v.ano)); setCliente(v.cliente); setStatusVeiculo(v.status);
    setEditIndex(i);
    setOpen(true);
  };

  const handleSubmit = () => {
    if (!placa || !modelo || !tipo || !ano || !cliente) {
      toast({ title: "Preencha todos os campos", variant: "destructive" });
      return;
    }

    if (editIndex !== null) {
      setVeiculos((prev) =>
        prev.map((v, i) =>
          i === editIndex ? { ...v, placa, modelo, tipo, ano: Number(ano), cliente, status: statusVeiculo || v.status } : v
        )
      );
      setOpen(false); resetForm();
      toast({ title: "Veículo atualizado com sucesso!" });
      return;
    }

    const novo: Veiculo = { placa, modelo, tipo, ano: Number(ano), cliente, status: "ativo" };
    setVeiculos((prev) => [novo, ...prev]);
    setOpen(false); resetForm();
    toast({ title: "Veículo cadastrado com sucesso!" });
  };

  const handleDelete = () => {
    if (deleteIndex === null) return;
    const p = veiculos[deleteIndex].placa;
    setVeiculos((prev) => prev.filter((_, i) => i !== deleteIndex));
    setDeleteIndex(null);
    toast({ title: "Veículo removido", description: `Placa ${p} foi excluída.` });
  };

  const veiculosFiltrados = veiculos.filter(
    (v) =>
      v.placa.toLowerCase().includes(busca.toLowerCase()) ||
      v.modelo.toLowerCase().includes(busca.toLowerCase()) ||
      v.cliente.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Veículos</h2>
            <p className="text-muted-foreground mt-1">Cavalos mecânicos, carretas e caminhões cadastrados</p>
          </div>
          <Button onClick={() => { resetForm(); setOpen(true); }} className="bg-accent text-accent-foreground hover:bg-accent/90 active:scale-[0.97] transition-all">
            <Plus className="h-4 w-4 mr-2" />
            Novo Veículo
          </Button>
        </div>

        <div className="relative max-w-sm animate-fade-in">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar por placa, modelo ou cliente..." className="pl-9" value={busca} onChange={(e) => setBusca(e.target.value)} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {veiculosFiltrados.map((v) => {
            const s = statusMap[v.status];
            const realIndex = veiculos.indexOf(v);
            return (
              <Card key={v.placa} className="animate-fade-up shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{v.modelo}</CardTitle>
                    <Badge variant="outline" className={s.className}>{s.label}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Placa</span>
                    <span className="font-mono font-medium">{v.placa}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tipo</span>
                    <span>{v.tipo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ano</span>
                    <span className="tabular-nums">{v.ano}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cliente</span>
                    <span>{v.cliente}</span>
                  </div>
                  <div className="flex items-center justify-end gap-1 pt-2 border-t">
                    <Button variant="ghost" size="sm" className="h-8 gap-1" onClick={() => openEdit(realIndex)}>
                      <Pencil className="h-3.5 w-3.5" /> Editar
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 gap-1 text-destructive hover:text-destructive" onClick={() => setDeleteIndex(realIndex)}>
                      <Trash2 className="h-3.5 w-3.5" /> Excluir
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
          {veiculosFiltrados.length === 0 && (
            <p className="col-span-full text-center text-muted-foreground py-8">Nenhum veículo encontrado.</p>
          )}
        </div>
      </div>

      {/* Dialog Criar / Editar */}
      <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm(); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editIndex !== null ? "Editar Veículo" : "Novo Veículo"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Placa</Label>
              <Input placeholder="Ex: ABC-1D23" value={placa} onChange={(e) => setPlaca(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Modelo</Label>
              <Input placeholder="Ex: Scania R450" value={modelo} onChange={(e) => setModelo(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select value={tipo} onValueChange={setTipo}>
                <SelectTrigger><SelectValue placeholder="Selecione o tipo" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cavalo Mecânico">Cavalo Mecânico</SelectItem>
                  <SelectItem value="Carreta">Carreta</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Ano</Label>
              <Input type="number" placeholder="Ex: 2024" value={ano} onChange={(e) => setAno(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Cliente</Label>
              <Input placeholder="Ex: Transportes Silva" value={cliente} onChange={(e) => setCliente(e.target.value)} />
            </div>
            {editIndex !== null && (
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={statusVeiculo} onValueChange={setStatusVeiculo}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ativo">Ativo</SelectItem>
                    <SelectItem value="em_manutencao">Em Manutenção</SelectItem>
                    <SelectItem value="inativo">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setOpen(false); resetForm(); }}>Cancelar</Button>
            <Button onClick={handleSubmit} className="bg-accent text-accent-foreground hover:bg-accent/90">
              {editIndex !== null ? "Salvar Alterações" : "Cadastrar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Confirmar Exclusão */}
      <Dialog open={deleteIndex !== null} onOpenChange={() => setDeleteIndex(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Excluir Veículo</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o veículo <strong>{deleteIndex !== null ? veiculos[deleteIndex]?.modelo : ""}</strong> ({deleteIndex !== null ? veiculos[deleteIndex]?.placa : ""})? Esta ação não pode ser desfeita.
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

import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
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
  const [open, setOpen] = useState(false);
  const [placa, setPlaca] = useState("");
  const [modelo, setModelo] = useState("");
  const [tipo, setTipo] = useState("");
  const [ano, setAno] = useState("");
  const [cliente, setCliente] = useState("");

  const handleSubmit = () => {
    if (!placa || !modelo || !tipo || !ano || !cliente) {
      toast({ title: "Preencha todos os campos", variant: "destructive" });
      return;
    }

    const novo: Veiculo = {
      placa,
      modelo,
      tipo,
      ano: Number(ano),
      cliente,
      status: "ativo",
    };

    setVeiculos((prev) => [novo, ...prev]);
    setOpen(false);
    setPlaca("");
    setModelo("");
    setTipo("");
    setAno("");
    setCliente("");
    toast({ title: "Veículo cadastrado com sucesso!" });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Veículos</h2>
            <p className="text-muted-foreground mt-1">Cavalos mecânicos, carretas e caminhões cadastrados</p>
          </div>
          <Button
            onClick={() => setOpen(true)}
            className="bg-accent text-accent-foreground hover:bg-accent/90 active:scale-[0.97] transition-all"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Veículo
          </Button>
        </div>

        <div className="relative max-w-sm animate-fade-in">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar por placa ou modelo..." className="pl-9" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {veiculos.map((v, i) => {
            const s = statusMap[v.status];
            return (
              <Card
                key={v.placa}
                className="animate-fade-up shadow-sm hover:shadow-md transition-shadow cursor-pointer active:scale-[0.98]"
                style={{ animationDelay: `${i * 70}ms` }}
              >
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
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Novo Veículo</DialogTitle>
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
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
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
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={handleSubmit} className="bg-accent text-accent-foreground hover:bg-accent/90">Cadastrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}

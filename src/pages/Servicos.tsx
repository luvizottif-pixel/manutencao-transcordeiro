import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Wrench, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface Servico {
  id: number;
  nome: string;
  descricao: string;
  precoBase: string;
  categoria: string;
  ativo: boolean;
}

const categoriasIniciais = ["Mecânica", "Elétrica", "Funilaria", "Pneus", "Lubrificação", "Outros"];

const servicosIniciais: Servico[] = [
  { id: 1, nome: "Troca de Óleo", descricao: "Troca de óleo do motor e filtro", precoBase: "350,00", categoria: "Lubrificação", ativo: true },
  { id: 2, nome: "Alinhamento", descricao: "Alinhamento de direção", precoBase: "200,00", categoria: "Pneus", ativo: true },
  { id: 3, nome: "Revisão Elétrica", descricao: "Revisão completa do sistema elétrico", precoBase: "500,00", categoria: "Elétrica", ativo: true },
  { id: 4, nome: "Troca de Pastilhas de Freio", descricao: "Substituição das pastilhas de freio", precoBase: "450,00", categoria: "Mecânica", ativo: true },
];

export default function Servicos() {
  const [servicos, setServicos] = useState<Servico[]>(servicosIniciais);
  const [open, setOpen] = useState(false);
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [precoBase, setPrecoBase] = useState("");
  const [categoria, setCategoria] = useState(categoriasIniciais[0]);
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!nome.trim()) {
      toast({ title: "Erro", description: "Informe o nome do serviço.", variant: "destructive" });
      return;
    }
    const novo: Servico = {
      id: Date.now(),
      nome: nome.trim(),
      descricao: descricao.trim(),
      precoBase: precoBase.trim() || "0,00",
      categoria,
      ativo: true,
    };
    setServicos((prev) => [novo, ...prev]);
    setNome(""); setDescricao(""); setPrecoBase(""); setCategoria(categoriasIniciais[0]);
    setOpen(false);
    toast({ title: "Serviço cadastrado!", description: `"${novo.nome}" foi adicionado.` });
  };

  const toggleAtivo = (id: number) => {
    setServicos((prev) => prev.map((s) => s.id === id ? { ...s, ativo: !s.ativo } : s));
  };

  const remover = (id: number) => {
    setServicos((prev) => prev.filter((s) => s.id !== id));
    toast({ title: "Serviço removido." });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Serviços</h1>
            <p className="text-muted-foreground">Gerencie os serviços oferecidos pela oficina.</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="mr-2 h-4 w-4" /> Novo Serviço</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Cadastrar Serviço</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <Label>Nome do Serviço</Label>
                  <Input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: Troca de Óleo" />
                </div>
                <div className="space-y-2">
                  <Label>Descrição</Label>
                  <Textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Descreva o serviço" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Preço Base (R$)</Label>
                    <Input value={precoBase} onChange={(e) => setPrecoBase(e.target.value)} placeholder="0,00" />
                  </div>
                  <div className="space-y-2">
                    <Label>Categoria</Label>
                    <select
                      value={categoria}
                      onChange={(e) => setCategoria(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                    >
                      {categoriasIniciais.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <Button className="w-full" onClick={handleSubmit}>Salvar Serviço</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Wrench className="h-5 w-5" /> Serviços Cadastrados</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Serviço</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Preço Base</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {servicos.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{s.nome}</p>
                        <p className="text-xs text-muted-foreground">{s.descricao}</p>
                      </div>
                    </TableCell>
                    <TableCell><Badge variant="outline">{s.categoria}</Badge></TableCell>
                    <TableCell>R$ {s.precoBase}</TableCell>
                    <TableCell>
                      <Badge
                        variant={s.ativo ? "default" : "secondary"}
                        className="cursor-pointer"
                        onClick={() => toggleAtivo(s.id)}
                      >
                        {s.ativo ? "Ativo" : "Inativo"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => remover(s.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {servicos.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      Nenhum serviço cadastrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

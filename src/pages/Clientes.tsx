import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, Phone, Mail, Truck, Pencil, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

interface Cliente {
  nome: string;
  contato: string;
  telefone: string;
  email: string;
  veiculos: number;
}

const clientesIniciais: Cliente[] = [
  { nome: "Transportes Silva Ltda", contato: "Carlos Silva", telefone: "(11) 98765-4321", email: "carlos@transsilva.com.br", veiculos: 8 },
  { nome: "Logística Norte S.A.", contato: "Mariana Costa", telefone: "(21) 91234-5678", email: "mariana@lognorte.com.br", veiculos: 12 },
  { nome: "Frota Express", contato: "Roberto Almeida", telefone: "(31) 97654-3210", email: "roberto@frotaexpress.com.br", veiculos: 5 },
  { nome: "Rodoviário Sul", contato: "Ana Pereira", telefone: "(41) 93456-7890", email: "ana@rodosul.com.br", veiculos: 9 },
];

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>(clientesIniciais);
  const [busca, setBusca] = useState("");
  const [open, setOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const [nome, setNome] = useState("");
  const [contato, setContato] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");

  const resetForm = () => {
    setNome(""); setContato(""); setTelefone(""); setEmail(""); setEditIndex(null);
  };

  const openEdit = (i: number) => {
    const c = clientes[i];
    setNome(c.nome); setContato(c.contato); setTelefone(c.telefone); setEmail(c.email);
    setEditIndex(i);
    setOpen(true);
  };

  const handleSubmit = () => {
    if (!nome || !contato || !telefone || !email) {
      toast({ title: "Preencha todos os campos", variant: "destructive" });
      return;
    }

    if (editIndex !== null) {
      setClientes((prev) =>
        prev.map((c, i) => i === editIndex ? { ...c, nome, contato, telefone, email } : c)
      );
      setOpen(false); resetForm();
      toast({ title: "Cliente atualizado com sucesso!" });
      return;
    }

    const novo: Cliente = { nome, contato, telefone, email, veiculos: 0 };
    setClientes((prev) => [novo, ...prev]);
    setOpen(false); resetForm();
    toast({ title: "Cliente cadastrado com sucesso!" });
  };

  const handleDelete = () => {
    if (deleteIndex === null) return;
    const n = clientes[deleteIndex].nome;
    setClientes((prev) => prev.filter((_, i) => i !== deleteIndex));
    setDeleteIndex(null);
    toast({ title: "Cliente removido", description: `${n} foi excluído.` });
  };

  const clientesFiltrados = clientes.filter(
    (c) =>
      c.nome.toLowerCase().includes(busca.toLowerCase()) ||
      c.contato.toLowerCase().includes(busca.toLowerCase()) ||
      c.email.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Clientes</h2>
            <p className="text-muted-foreground mt-1">Gerenciamento de clientes e transportadoras</p>
          </div>
          <Button onClick={() => { resetForm(); setOpen(true); }} className="bg-accent text-accent-foreground hover:bg-accent/90 active:scale-[0.97] transition-all">
            <Plus className="h-4 w-4 mr-2" />
            Novo Cliente
          </Button>
        </div>

        <div className="relative max-w-sm animate-fade-in">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar cliente..." className="pl-9" value={busca} onChange={(e) => setBusca(e.target.value)} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {clientesFiltrados.map((c) => {
            const realIndex = clientes.indexOf(c);
            return (
              <Card key={c.nome + realIndex} className="animate-fade-up shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-base">{c.nome}</CardTitle>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Truck className="h-3.5 w-3.5" />
                      <span className="tabular-nums">{c.veiculos}</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{c.contato}</p>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-3.5 w-3.5 shrink-0" />
                    <span>{c.telefone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-3.5 w-3.5 shrink-0" />
                    <span>{c.email}</span>
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
          {clientesFiltrados.length === 0 && (
            <p className="col-span-full text-center text-muted-foreground py-8">Nenhum cliente encontrado.</p>
          )}
        </div>
      </div>

      {/* Dialog Criar / Editar */}
      <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm(); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editIndex !== null ? "Editar Cliente" : "Novo Cliente"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Razão Social / Nome</Label>
              <Input placeholder="Ex: Transportes Silva Ltda" value={nome} onChange={(e) => setNome(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Pessoa de Contato</Label>
              <Input placeholder="Ex: Carlos Silva" value={contato} onChange={(e) => setContato(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Telefone</Label>
              <Input placeholder="Ex: (11) 98765-4321" value={telefone} onChange={(e) => setTelefone(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>E-mail</Label>
              <Input type="email" placeholder="Ex: contato@empresa.com.br" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
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
            <DialogTitle>Excluir Cliente</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir <strong>{deleteIndex !== null ? clientes[deleteIndex]?.nome : ""}</strong>? Esta ação não pode ser desfeita.
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

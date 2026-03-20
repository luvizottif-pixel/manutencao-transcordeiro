import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, Phone, Mail, Truck } from "lucide-react";
import { Input } from "@/components/ui/input";

const clientes = [
  { nome: "Transportes Silva Ltda", contato: "Carlos Silva", telefone: "(11) 98765-4321", email: "carlos@transsilva.com.br", veiculos: 8 },
  { nome: "Logística Norte S.A.", contato: "Mariana Costa", telefone: "(21) 91234-5678", email: "mariana@lognorte.com.br", veiculos: 12 },
  { nome: "Frota Express", contato: "Roberto Almeida", telefone: "(31) 97654-3210", email: "roberto@frotaexpress.com.br", veiculos: 5 },
  { nome: "Rodoviário Sul", contato: "Ana Pereira", telefone: "(41) 93456-7890", email: "ana@rodosul.com.br", veiculos: 9 },
];

export default function ClientesPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Clientes</h2>
            <p className="text-muted-foreground mt-1">Gerenciamento de clientes e transportadoras</p>
          </div>
          <Button className="bg-accent text-accent-foreground hover:bg-accent/90 active:scale-[0.97] transition-all">
            <Plus className="h-4 w-4 mr-2" />
            Novo Cliente
          </Button>
        </div>

        <div className="relative max-w-sm animate-fade-in">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar cliente..." className="pl-9" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {clientes.map((c, i) => (
            <Card
              key={c.nome}
              className="animate-fade-up shadow-sm hover:shadow-md transition-shadow cursor-pointer active:scale-[0.98]"
              style={{ animationDelay: `${i * 80}ms` }}
            >
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
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

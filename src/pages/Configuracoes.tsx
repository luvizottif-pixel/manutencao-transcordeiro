import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Settings, Building2, Bell, Palette } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Configuracoes() {
  const { toast } = useToast();
  const [empresa, setEmpresa] = useState({
    nome: "Transcordeiro",
    cnpj: "00.000.000/0001-00",
    telefone: "(00) 0000-0000",
    email: "contato@transcordeiro.com",
    endereco: "Rua Exemplo, 123 - Centro",
  });
  const [notificacoes, setNotificacoes] = useState({
    email: true,
    osAtrasada: true,
    novoCliente: false,
  });

  const salvar = () => {
    toast({ title: "Configurações salvas!", description: "As alterações foram aplicadas." });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-3xl">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Configurações</h1>
          <p className="text-muted-foreground">Gerencie as configurações do sistema.</p>
        </div>

        {/* Dados da Empresa */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Building2 className="h-5 w-5" /> Dados da Empresa</CardTitle>
            <CardDescription>Informações exibidas nos relatórios e documentos.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nome da Empresa</Label>
                <Input value={empresa.nome} onChange={(e) => setEmpresa({ ...empresa, nome: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>CNPJ</Label>
                <Input value={empresa.cnpj} onChange={(e) => setEmpresa({ ...empresa, cnpj: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Telefone</Label>
                <Input value={empresa.telefone} onChange={(e) => setEmpresa({ ...empresa, telefone: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={empresa.email} onChange={(e) => setEmpresa({ ...empresa, email: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Endereço</Label>
              <Input value={empresa.endereco} onChange={(e) => setEmpresa({ ...empresa, endereco: e.target.value })} />
            </div>
          </CardContent>
        </Card>

        {/* Notificações */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Bell className="h-5 w-5" /> Notificações</CardTitle>
            <CardDescription>Configure as notificações do sistema.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Notificações por Email</p>
                <p className="text-xs text-muted-foreground">Receber alertas por email</p>
              </div>
              <Switch checked={notificacoes.email} onCheckedChange={(v) => setNotificacoes({ ...notificacoes, email: v })} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">OS Atrasadas</p>
                <p className="text-xs text-muted-foreground">Alertar quando uma OS ultrapassar o prazo</p>
              </div>
              <Switch checked={notificacoes.osAtrasada} onCheckedChange={(v) => setNotificacoes({ ...notificacoes, osAtrasada: v })} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Novo Cliente</p>
                <p className="text-xs text-muted-foreground">Notificar ao cadastrar novo cliente</p>
              </div>
              <Switch checked={notificacoes.novoCliente} onCheckedChange={(v) => setNotificacoes({ ...notificacoes, novoCliente: v })} />
            </div>
          </CardContent>
        </Card>

        <Button onClick={salvar} className="w-full md:w-auto">Salvar Configurações</Button>
      </div>
    </DashboardLayout>
  );
}

import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, ClipboardList, Users, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ordensIniciais } from "@/data/ordens";

const totalOrdens = ordensIniciais.length;
const ordensAbertas = ordensIniciais.filter((o) => o.status !== "concluida").length;
const ordensUrgentes = ordensIniciais.filter((o) => o.prioridade === "urgente").length;
const ordensPendentes = ordensIniciais.filter((o) => o.status === "pendente").length;

const stats = [
  { label: "Veículos Cadastrados", value: "34", icon: Truck, change: "+3 este mês" },
  { label: "Ordens Abertas", value: String(ordensAbertas), icon: ClipboardList, change: `${ordensUrgentes} urgentes` },
  { label: "Clientes Ativos", value: "18", icon: Users, change: "+2 este mês" },
  { label: "Manutenções Pendentes", value: String(ordensPendentes), icon: AlertTriangle, change: `de ${totalOrdens} ordens` },
];

const recentOrders = ordensIniciais.slice(0, 5).map((o) => ({
  id: o.id,
  veiculo: o.veiculo,
  servico: o.servico,
  status: o.status,
  data: o.data,
}));

const statusConfig: Record<string, { label: string; className: string; icon: typeof CheckCircle }> = {
  pendente: { label: "Pendente", className: "bg-warning/15 text-warning border-warning/30", icon: Clock },
  em_andamento: { label: "Em Andamento", className: "bg-info/15 text-info border-info/30", icon: Clock },
  concluida: { label: "Concluída", className: "bg-success/15 text-success border-success/30", icon: CheckCircle },
};

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground mt-1">Visão geral da oficina Transcordeiro</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <Card
              key={stat.label}
              className="animate-fade-up shadow-sm hover:shadow-md transition-shadow"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <stat.icon className="h-5 w-5 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Desktop table */}
        <Card className="animate-fade-up shadow-sm hidden md:block" style={{ animationDelay: "320ms" }}>
          <CardHeader>
            <CardTitle className="text-lg">Ordens de Serviço Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="pb-3 pr-4 font-medium">Ordem</th>
                    <th className="pb-3 pr-4 font-medium">Veículo</th>
                    <th className="pb-3 pr-4 font-medium">Serviço</th>
                    <th className="pb-3 pr-4 font-medium">Status</th>
                    <th className="pb-3 font-medium">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => {
                    const sc = statusConfig[order.status];
                    return (
                      <tr key={order.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                        <td className="py-3 pr-4 font-mono text-xs">{order.id}</td>
                        <td className="py-3 pr-4">{order.veiculo}</td>
                        <td className="py-3 pr-4">{order.servico}</td>
                        <td className="py-3 pr-4">
                          <Badge variant="outline" className={sc.className}>
                            <sc.icon className="h-3 w-3 mr-1" />
                            {sc.label}
                          </Badge>
                        </td>
                        <td className="py-3 tabular-nums">{order.data}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Mobile cards */}
        <div className="md:hidden space-y-3">
          <h3 className="text-lg font-semibold">Ordens de Serviço Recentes</h3>
          {recentOrders.map((order) => {
            const sc = statusConfig[order.status];
            return (
              <Card key={order.id} className="shadow-sm">
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-mono text-xs">{order.id}</p>
                      <p className="text-sm font-medium mt-1">{order.veiculo}</p>
                    </div>
                    <Badge variant="outline" className={sc.className}>
                      <sc.icon className="h-3 w-3 mr-1" />
                      {sc.label}
                    </Badge>
                  </div>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between"><span className="text-muted-foreground">Serviço</span><span>{order.servico}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Data</span><span className="tabular-nums">{order.data}</span></div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}

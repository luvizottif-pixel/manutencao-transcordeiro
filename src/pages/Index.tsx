import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, ClipboardList, Users, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const stats = [
  { label: "Veículos Cadastrados", value: "34", icon: Truck, change: "+3 este mês" },
  { label: "Ordens Abertas", value: "12", icon: ClipboardList, change: "4 urgentes" },
  { label: "Clientes Ativos", value: "18", icon: Users, change: "+2 este mês" },
  { label: "Manutenções Pendentes", value: "7", icon: AlertTriangle, change: "3 vencidas" },
];

const recentOrders = [
  { id: "OS-2024-0147", veiculo: "Scania R450 — ABC-1D23", servico: "Troca de embreagem", status: "em_andamento", data: "19/03/2026" },
  { id: "OS-2024-0146", veiculo: "Volvo FH 540 — XYZ-9K87", servico: "Revisão completa", status: "concluida", data: "18/03/2026" },
  { id: "OS-2024-0145", veiculo: "Carreta Randon — QRS-4F56", servico: "Troca de lonas de freio", status: "pendente", data: "17/03/2026" },
  { id: "OS-2024-0144", veiculo: "Mercedes Actros — LMN-7H01", servico: "Troca de óleo e filtros", status: "concluida", data: "16/03/2026" },
  { id: "OS-2024-0143", veiculo: "DAF XF — GHI-2B34", servico: "Alinhamento e balanceamento", status: "em_andamento", data: "15/03/2026" },
];

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

        <Card className="animate-fade-up shadow-sm" style={{ animationDelay: "320ms" }}>
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
      </div>
    </DashboardLayout>
  );
}

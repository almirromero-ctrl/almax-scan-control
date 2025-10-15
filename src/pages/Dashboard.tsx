import { Package, TrendingDown, TrendingUp, AlertCircle } from "lucide-react";
import { StatsCard } from "@/components/StatsCard";
import { Card } from "@/components/ui/card";
import { initialItems } from "@/data/items";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const Dashboard = () => {
  const totalItems = initialItems.length;
  const totalStock = initialItems.reduce((acc, item) => acc + item.currentStock, 0);
  const lowStockItems = initialItems.filter(item => item.currentStock <= item.minStock);
  
  const categoryData = [
    { name: "Peça/Ferramenta", value: initialItems.filter(i => i.category === "Peça/Ferramenta").length },
    { name: "EPI", value: initialItems.filter(i => i.category === "EPI").length },
    { name: "Consumível", value: initialItems.filter(i => i.category === "Consumível").length },
  ];

  const topItems = initialItems
    .sort((a, b) => b.currentStock - a.currentStock)
    .slice(0, 6)
    .map(item => ({
      name: item.name.length > 20 ? item.name.substring(0, 20) + "..." : item.name,
      quantidade: item.currentStock
    }));

  const COLORS = ['hsl(221 83% 53%)', 'hsl(142 76% 36%)', 'hsl(38 92% 50%)'];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Visão geral do almoxarifado</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total de Itens"
            value={totalItems}
            icon={Package}
            trend="+3 este mês"
            trendUp={true}
          />
          <StatsCard
            title="Estoque Total"
            value={totalStock}
            icon={TrendingUp}
            trend="+12% este mês"
            trendUp={true}
          />
          <StatsCard
            title="Itens em Falta"
            value={lowStockItems.length}
            icon={AlertCircle}
            trend="Requer atenção"
            trendUp={false}
          />
          <StatsCard
            title="Movimentações Hoje"
            value={8}
            icon={TrendingDown}
            trend="5 saídas, 3 entradas"
            trendUp={true}
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Bar Chart */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Itens com Maior Estoque</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topItems}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" className="text-xs" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="quantidade" fill="hsl(221 83% 53%)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Pie Chart */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Distribuição por Categoria</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Low Stock Alert */}
        {lowStockItems.length > 0 && (
          <Card className="p-6 border-warning/50 bg-warning/5">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-warning mt-0.5" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-2">Itens com Estoque Baixo</h3>
                <div className="space-y-2">
                  {lowStockItems.map(item => (
                    <div key={item.id} className="flex justify-between items-center text-sm">
                      <span className="text-foreground">{item.name}</span>
                      <span className="text-warning font-medium">
                        {item.currentStock} {item.unit} (mín: {item.minStock})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

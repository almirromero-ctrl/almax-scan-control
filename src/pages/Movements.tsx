import { useState } from "react";
import { ArrowUpCircle, ArrowDownCircle, Calendar, User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type MovementType = "entrada" | "saida";

interface Movement {
  id: string;
  itemName: string;
  itemCode: string;
  type: MovementType;
  quantity: number;
  unit: string;
  user: string;
  date: string;
  time: string;
}

const mockMovements: Movement[] = [
  {
    id: "1",
    itemName: "Óculos de proteção (EPI)",
    itemCode: "EPI007",
    type: "saida",
    quantity: 5,
    unit: "par",
    user: "João Silva",
    date: "2025-10-15",
    time: "09:30"
  },
  {
    id: "2",
    itemName: "Parafuso métrico M6 × 20",
    itemCode: "PF001",
    type: "saida",
    quantity: 50,
    unit: "un",
    user: "Maria Santos",
    date: "2025-10-15",
    time: "10:15"
  },
  {
    id: "3",
    itemName: "Disco de corte de metal",
    itemCode: "CNS016",
    type: "entrada",
    quantity: 20,
    unit: "un",
    user: "Carlos Oliveira",
    date: "2025-10-15",
    time: "11:00"
  },
  {
    id: "4",
    itemName: "Luvas de vaqueta",
    itemCode: "EPI009",
    type: "saida",
    quantity: 10,
    unit: "par",
    user: "Ana Costa",
    date: "2025-10-14",
    time: "14:20"
  },
  {
    id: "5",
    itemName: "Óleo de corte / fluido lubrificante",
    itemCode: "CNS015",
    type: "entrada",
    quantity: 30,
    unit: "litro",
    user: "Pedro Alves",
    date: "2025-10-14",
    time: "15:45"
  }
];

const Movements = () => {
  const [movements] = useState(mockMovements);
  const [activeTab, setActiveTab] = useState("todas");

  const filteredMovements = movements.filter(m => {
    if (activeTab === "todas") return true;
    return m.type === activeTab;
  });

  const MovementCard = ({ movement }: { movement: Movement }) => {
    const isEntrada = movement.type === "entrada";
    
    return (
      <Card className="p-6 hover:shadow-md transition-all duration-300">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge 
                className={isEntrada 
                  ? "bg-success/10 text-success border-success/20" 
                  : "bg-destructive/10 text-destructive border-destructive/20"
                }
              >
                {isEntrada ? (
                  <ArrowUpCircle className="h-3 w-3 mr-1" />
                ) : (
                  <ArrowDownCircle className="h-3 w-3 mr-1" />
                )}
                {isEntrada ? "Entrada" : "Saída"}
              </Badge>
              <span className="text-xs text-muted-foreground font-mono">
                {movement.itemCode}
              </span>
            </div>
            <h3 className="font-semibold text-foreground mb-1">{movement.itemName}</h3>
          </div>
          <div className="text-right">
            <div className={`text-2xl font-bold ${isEntrada ? "text-success" : "text-destructive"}`}>
              {isEntrada ? "+" : "-"}{movement.quantity}
            </div>
            <div className="text-xs text-muted-foreground">{movement.unit}</div>
          </div>
        </div>

        <div className="space-y-2 pt-4 border-t border-border">
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Responsável:</span>
            <span className="text-foreground font-medium">{movement.user}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Data:</span>
            <span className="text-foreground font-medium">
              {new Date(movement.date).toLocaleDateString('pt-BR')} às {movement.time}
            </span>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Movimentações</h1>
              <p className="text-muted-foreground">Histórico de entradas e saídas do estoque</p>
            </div>
            <div className="flex gap-2">
              <Button className="shadow-md">
                <ArrowUpCircle className="h-4 w-4 mr-2" />
                Nova Entrada
              </Button>
              <Button variant="outline" className="shadow-sm">
                <ArrowDownCircle className="h-4 w-4 mr-2" />
                Nova Saída
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="todas">Todas</TabsTrigger>
              <TabsTrigger value="entrada">Entradas</TabsTrigger>
              <TabsTrigger value="saida">Saídas</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card className="p-4 bg-gradient-to-br from-card to-card/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Total de Movimentações</p>
                      <p className="text-2xl font-bold text-foreground">{movements.length}</p>
                    </div>
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <ArrowUpCircle className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </Card>

                <Card className="p-4 bg-gradient-to-br from-success/5 to-success/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Entradas</p>
                      <p className="text-2xl font-bold text-success">
                        {movements.filter(m => m.type === "entrada").length}
                      </p>
                    </div>
                    <div className="p-3 bg-success/10 rounded-lg">
                      <ArrowUpCircle className="h-6 w-6 text-success" />
                    </div>
                  </div>
                </Card>

                <Card className="p-4 bg-gradient-to-br from-destructive/5 to-destructive/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Saídas</p>
                      <p className="text-2xl font-bold text-destructive">
                        {movements.filter(m => m.type === "saida").length}
                      </p>
                    </div>
                    <div className="p-3 bg-destructive/10 rounded-lg">
                      <ArrowDownCircle className="h-6 w-6 text-destructive" />
                    </div>
                  </div>
                </Card>
              </div>

              {/* Movements List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredMovements.map((movement) => (
                  <MovementCard key={movement.id} movement={movement} />
                ))}
              </div>

              {filteredMovements.length === 0 && (
                <Card className="p-12 text-center">
                  <p className="text-muted-foreground">Nenhuma movimentação encontrada</p>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Movements;

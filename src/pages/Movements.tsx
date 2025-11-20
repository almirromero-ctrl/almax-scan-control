import { useState } from "react";
import { ArrowUpCircle, ArrowDownCircle, Calendar, User, Download } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { utils, writeFile } from "xlsx";
import { toast } from "sonner";
import { initialItems } from "@/data/items";

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
  const [movements, setMovements] = useState(mockMovements);
  const [activeTab, setActiveTab] = useState("todas");
  const [isMovementDialogOpen, setIsMovementDialogOpen] = useState(false);
  const [movementType, setMovementType] = useState<MovementType>("entrada");
  const [movementForm, setMovementForm] = useState({
    itemCode: "",
    quantity: 0,
    user: ""
  });

  const filteredMovements = movements.filter(m => {
    if (activeTab === "todas") return true;
    return m.type === activeTab;
  });

  const handleCreateMovement = () => {
    const selectedItem = initialItems.find(item => item.code === movementForm.itemCode);
    if (!selectedItem) {
      toast.error("Item não encontrado!");
      return;
    }

    const now = new Date();
    const newMovement: Movement = {
      id: Date.now().toString(),
      itemName: selectedItem.name,
      itemCode: selectedItem.code,
      type: movementType,
      quantity: movementForm.quantity,
      unit: selectedItem.unit,
      user: movementForm.user,
      date: now.toISOString().split('T')[0],
      time: now.toTimeString().slice(0, 5)
    };

    setMovements([newMovement, ...movements]);
    toast.success(`${movementType === 'entrada' ? 'Entrada' : 'Saída'} registrada com sucesso!`);
    setIsMovementDialogOpen(false);
    setMovementForm({ itemCode: "", quantity: 0, user: "" });
  };

  const openMovementDialog = (type: MovementType) => {
    setMovementType(type);
    setIsMovementDialogOpen(true);
  };

  const exportToExcel = () => {
    try {
      // Preparar dados para exportação
      const exportData = movements.map(m => ({
        'Código': m.itemCode,
        'Item': m.itemName,
        'Tipo': m.type === 'entrada' ? 'Entrada' : 'Saída',
        'Quantidade': m.quantity,
        'Unidade': m.unit,
        'Responsável': m.user,
        'Data': m.date,
        'Hora': m.time
      }));

      // Criar planilha
      const worksheet = utils.json_to_sheet(exportData);
      const workbook = utils.book_new();
      utils.book_append_sheet(workbook, worksheet, 'Movimentações');

      // Estilizar cabeçalho
      const range = utils.decode_range(worksheet['!ref'] || 'A1');
      for (let col = range.s.c; col <= range.e.c; col++) {
        const cellAddress = utils.encode_cell({ r: 0, c: col });
        if (!worksheet[cellAddress]) continue;
        worksheet[cellAddress].s = {
          font: { bold: true, color: { rgb: "FFFFFF" }, sz: 12 },
          fill: { fgColor: { rgb: "2563EB" } },
          alignment: { horizontal: "center", vertical: "center" }
        };
      }

      // Aplicar cores nas linhas com base no tipo
      for (let row = 1; row <= range.e.r; row++) {
        const typeCell = worksheet[utils.encode_cell({ r: row, c: 2 })]; // Coluna "Tipo"
        const isEntrada = typeCell?.v === 'Entrada';
        
        for (let col = range.s.c; col <= range.e.c; col++) {
          const cellAddress = utils.encode_cell({ r: row, c: col });
          if (!worksheet[cellAddress]) continue;
          
          worksheet[cellAddress].s = {
            ...worksheet[cellAddress].s,
            fill: { 
              fgColor: { 
                rgb: isEntrada ? "D1FAE5" : "FEE2E2" 
              } 
            },
            border: {
              top: { style: "thin", color: { rgb: "CCCCCC" } },
              bottom: { style: "thin", color: { rgb: "CCCCCC" } },
              left: { style: "thin", color: { rgb: "CCCCCC" } },
              right: { style: "thin", color: { rgb: "CCCCCC" } }
            }
          };
        }
      }

      // Ajustar largura das colunas
      const colWidths = [
        { wch: 12 },  // Código
        { wch: 40 },  // Item
        { wch: 12 },  // Tipo
        { wch: 14 },  // Quantidade
        { wch: 12 },  // Unidade
        { wch: 25 },  // Responsável
        { wch: 14 },  // Data
        { wch: 10 }   // Hora
      ];
      worksheet['!cols'] = colWidths;

      // Gerar nome do arquivo com data
      const today = new Date().toISOString().split('T')[0];
      const fileName = `registros-almax-${today}.xlsx`;

      // Download
      writeFile(workbook, fileName, { cellStyles: true });
      
      toast.success('Arquivo Excel exportado com sucesso!');
    } catch (error) {
      console.error('Erro ao exportar:', error);
      toast.error('Erro ao exportar arquivo Excel');
    }
  };

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
              <Button className="shadow-md" onClick={() => openMovementDialog("entrada")}>
                <ArrowUpCircle className="h-4 w-4 mr-2" />
                Nova Entrada
              </Button>
              <Button variant="outline" className="shadow-sm" onClick={() => openMovementDialog("saida")}>
                <ArrowDownCircle className="h-4 w-4 mr-2" />
                Nova Saída
              </Button>
              <Button 
                variant="secondary" 
                className="shadow-sm"
                onClick={exportToExcel}
              >
                <Download className="h-4 w-4 mr-2" />
                Exportar Excel
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

      {/* Movement Dialog */}
      <Dialog open={isMovementDialogOpen} onOpenChange={setIsMovementDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {movementType === "entrada" ? (
                <span className="flex items-center gap-2 text-success">
                  <ArrowUpCircle className="h-5 w-5" />
                  Nova Entrada
                </span>
              ) : (
                <span className="flex items-center gap-2 text-destructive">
                  <ArrowDownCircle className="h-5 w-5" />
                  Nova Saída
                </span>
              )}
            </DialogTitle>
            <DialogDescription>
              Registre uma {movementType === "entrada" ? "entrada" : "saída"} de item no estoque
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="itemCode">Item</Label>
              <Select
                value={movementForm.itemCode}
                onValueChange={(value) => setMovementForm({ ...movementForm, itemCode: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um item" />
                </SelectTrigger>
                <SelectContent>
                  {initialItems.map((item) => (
                    <SelectItem key={item.id} value={item.code}>
                      {item.code} - {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="quantity">Quantidade</Label>
              <Input
                id="quantity"
                type="number"
                value={movementForm.quantity}
                onChange={(e) => setMovementForm({ ...movementForm, quantity: Number(e.target.value) })}
                min="1"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="user">Responsável</Label>
              <Input
                id="user"
                value={movementForm.user}
                onChange={(e) => setMovementForm({ ...movementForm, user: e.target.value })}
                placeholder="Nome do responsável"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsMovementDialogOpen(false);
                setMovementForm({ itemCode: "", quantity: 0, user: "" });
              }}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleCreateMovement}
              disabled={!movementForm.itemCode || movementForm.quantity <= 0 || !movementForm.user}
              className={movementType === "entrada" ? "bg-success hover:bg-success/90" : ""}
            >
              Registrar {movementType === "entrada" ? "Entrada" : "Saída"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Movements;

import { useState } from "react";
import { Search, Plus, Edit, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { initialItems, ItemCategory } from "@/data/items";

const Items = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [items] = useState(initialItems);

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryColor = (category: ItemCategory) => {
    switch (category) {
      case "Peça/Ferramenta":
        return "bg-primary/10 text-primary border-primary/20";
      case "EPI":
        return "bg-success/10 text-success border-success/20";
      case "Consumível":
        return "bg-warning/10 text-warning border-warning/20";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const getStockStatus = (current: number, min: number) => {
    if (current <= min) return { label: "Baixo", color: "text-destructive" };
    if (current <= min * 2) return { label: "Médio", color: "text-warning" };
    return { label: "Bom", color: "text-success" };
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Catálogo de Itens</h1>
              <p className="text-muted-foreground">Gerencie todos os itens do almoxarifado</p>
            </div>
            <Button className="shadow-md">
              <Plus className="h-4 w-4 mr-2" />
              Novo Item
            </Button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar por nome, código ou categoria..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12"
            />
          </div>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const stockStatus = getStockStatus(item.currentStock, item.minStock);
            
            return (
              <Card key={item.id} className="p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getCategoryColor(item.category)}>
                        {item.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground font-mono">
                        {item.code}
                      </span>
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">{item.name}</h3>
                    {item.observation && (
                      <p className="text-xs text-muted-foreground">{item.observation}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center pt-3 border-t border-border">
                    <span className="text-sm text-muted-foreground">Estoque Atual</span>
                    <span className={`text-lg font-bold ${stockStatus.color}`}>
                      {item.currentStock} {item.unit}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Estoque Mínimo</span>
                    <span className="text-sm font-medium text-foreground">
                      {item.minStock} {item.unit}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <Badge variant="outline" className={stockStatus.color}>
                      {stockStatus.label}
                    </Badge>
                  </div>
                </div>

                <div className="flex gap-2 mt-4 pt-4 border-t border-border">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                  <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {filteredItems.length === 0 && (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">Nenhum item encontrado</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Items;

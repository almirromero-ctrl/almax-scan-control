import { useState } from "react";
import { Search, Plus, Edit, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { initialItems, ItemCategory, Item } from "@/data/items";
import { generateUniqueCode } from "@/lib/utils";
import { toast } from "sonner";

const Items = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [items, setItems] = useState(initialItems);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "Peça/Ferramenta" as ItemCategory,
    unit: "un",
    currentStock: 0,
    minStock: 0,
    observation: ""
  });

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

  const handleCreateItem = () => {
    const existingCodes = items.map(item => item.code);
    const newCode = generateUniqueCode(formData.category, existingCodes);
    const newItem: Item = {
      id: Date.now().toString(),
      code: newCode,
      ...formData
    };
    setItems([...items, newItem]);
    toast.success(`Item ${newItem.name} criado com código ${newCode}!`);
    setIsCreateDialogOpen(false);
    resetForm();
  };

  const handleEditItem = () => {
    if (!selectedItem) return;
    setItems(items.map(item => 
      item.id === selectedItem.id 
        ? { ...item, ...formData }
        : item
    ));
    toast.success(`Item ${formData.name} atualizado com sucesso!`);
    setIsEditDialogOpen(false);
    resetForm();
  };

  const handleDeleteItem = () => {
    if (!selectedItem) return;
    setItems(items.filter(item => item.id !== selectedItem.id));
    toast.success(`Item ${selectedItem.name} removido com sucesso!`);
    setIsDeleteDialogOpen(false);
    setSelectedItem(null);
  };

  const openEditDialog = (item: Item) => {
    setSelectedItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      unit: item.unit,
      currentStock: item.currentStock,
      minStock: item.minStock,
      observation: item.observation || ""
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (item: Item) => {
    setSelectedItem(item);
    setIsDeleteDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category: "Peça/Ferramenta",
      unit: "un",
      currentStock: 0,
      minStock: 0,
      observation: ""
    });
    setSelectedItem(null);
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
            <Button className="shadow-md" onClick={() => setIsCreateDialogOpen(true)}>
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
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => openEditDialog(item)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-destructive hover:text-destructive"
                    onClick={() => openDeleteDialog(item)}
                  >
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

      {/* Create Item Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Criar Novo Item</DialogTitle>
            <DialogDescription>
              Preencha os dados do novo item. Um código único será gerado automaticamente.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome do Item</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Parafuso M6"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Categoria</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value as ItemCategory })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Peça/Ferramenta">Peça/Ferramenta</SelectItem>
                  <SelectItem value="EPI">EPI</SelectItem>
                  <SelectItem value="Consumível">Consumível</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="unit">Unidade</Label>
                <Input
                  id="unit"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  placeholder="un, par, litro"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="currentStock">Estoque Inicial</Label>
                <Input
                  id="currentStock"
                  type="number"
                  value={formData.currentStock}
                  onChange={(e) => setFormData({ ...formData, currentStock: Number(e.target.value) })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="minStock">Estoque Mínimo</Label>
              <Input
                id="minStock"
                type="number"
                value={formData.minStock}
                onChange={(e) => setFormData({ ...formData, minStock: Number(e.target.value) })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="observation">Observação (opcional)</Label>
              <Input
                id="observation"
                value={formData.observation}
                onChange={(e) => setFormData({ ...formData, observation: e.target.value })}
                placeholder="Descrição adicional"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsCreateDialogOpen(false); resetForm(); }}>
              Cancelar
            </Button>
            <Button onClick={handleCreateItem} disabled={!formData.name}>
              Criar Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Item Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Item</DialogTitle>
            <DialogDescription>
              Atualize as informações do item {selectedItem?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Nome do Item</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-category">Categoria</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value as ItemCategory })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Peça/Ferramenta">Peça/Ferramenta</SelectItem>
                  <SelectItem value="EPI">EPI</SelectItem>
                  <SelectItem value="Consumível">Consumível</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-unit">Unidade</Label>
                <Input
                  id="edit-unit"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-currentStock">Estoque Atual</Label>
                <Input
                  id="edit-currentStock"
                  type="number"
                  value={formData.currentStock}
                  onChange={(e) => setFormData({ ...formData, currentStock: Number(e.target.value) })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-minStock">Estoque Mínimo</Label>
              <Input
                id="edit-minStock"
                type="number"
                value={formData.minStock}
                onChange={(e) => setFormData({ ...formData, minStock: Number(e.target.value) })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-observation">Observação</Label>
              <Input
                id="edit-observation"
                value={formData.observation}
                onChange={(e) => setFormData({ ...formData, observation: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsEditDialogOpen(false); resetForm(); }}>
              Cancelar
            </Button>
            <Button onClick={handleEditItem}>
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o item <strong>{selectedItem?.name}</strong>? 
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedItem(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteItem} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Items;

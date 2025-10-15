import { useState, useEffect } from "react";
import { QrCode, Camera, ArrowUpCircle, ArrowDownCircle, User, Hash, Plus, Package } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { initialItems, Item, ItemCategory } from "@/data/items";
import { generateUniqueCode } from "@/lib/utils";

type MovementType = "entrada" | "saida" | null;

const Scanner = () => {
  const [items, setItems] = useState<Item[]>(initialItems);
  const [manualCode, setManualCode] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [scannedItem, setScannedItem] = useState<Item | null>(null);
  const [showMovementDialog, setShowMovementDialog] = useState(false);
  const [showNewItemDialog, setShowNewItemDialog] = useState(false);
  const [scannedCode, setScannedCode] = useState("");
  const [movementType, setMovementType] = useState<MovementType>(null);
  const [quantity, setQuantity] = useState("");
  const [responsible, setResponsible] = useState("");
  
  // Novo item form
  const [newItemName, setNewItemName] = useState("");
  const [newItemCategory, setNewItemCategory] = useState<ItemCategory>("Peça/Ferramenta");
  const [newItemUnit, setNewItemUnit] = useState("");
  const [newItemQuantity, setNewItemQuantity] = useState("");
  const [newItemObservation, setNewItemObservation] = useState("");

  // Simula o scanner de código de barras USB
  useEffect(() => {
    let buffer = "";
    let timeoutId: NodeJS.Timeout;

    const handleKeyPress = (e: KeyboardEvent) => {
      // Ignora se estiver digitando em um input
      if ((e.target as HTMLElement).tagName === 'INPUT') {
        return;
      }

      if (isScanning) {
        if (e.key === "Enter") {
          if (buffer.length > 0) {
            handleCodeScanned(buffer);
            buffer = "";
          }
        } else if (e.key.length === 1) {
          buffer += e.key;
          clearTimeout(timeoutId);
          timeoutId = setTimeout(() => {
            buffer = "";
          }, 100);
        }
      }
    };

    window.addEventListener("keypress", handleKeyPress);

    return () => {
      window.removeEventListener("keypress", handleKeyPress);
      clearTimeout(timeoutId);
    };
  }, [isScanning, items]);

  const handleCodeScanned = (code: string) => {
    const foundItem = items.find(
      item => item.code.toLowerCase() === code.toLowerCase()
    );

    if (foundItem) {
      setScannedItem(foundItem);
      setShowMovementDialog(true);
      toast({
        title: "✅ Item Identificado",
        description: `${foundItem.name}`,
      });
    } else {
      // Código não encontrado - oferece criar novo item
      setScannedCode(code);
      setShowNewItemDialog(true);
      toast({
        title: "📦 Código não cadastrado",
        description: "Deseja criar um novo item?",
      });
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualCode.trim()) {
      handleCodeScanned(manualCode.trim().toUpperCase());
      setManualCode("");
    }
  };

  const handleMovementTypeSelect = (type: MovementType) => {
    setMovementType(type);
  };

  const handleConfirmMovement = () => {
    if (!scannedItem || !movementType || !quantity || !responsible) {
      toast({
        title: "⚠️ Campos obrigatórios",
        description: "Preencha todos os campos para continuar",
        variant: "destructive",
      });
      return;
    }

    const now = new Date();
    const movement = {
      item: scannedItem,
      type: movementType,
      quantity: parseInt(quantity),
      responsible,
      date: now.toLocaleDateString('pt-BR'),
      time: now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };

    // Atualiza o estoque do item
    setItems(prevItems => 
      prevItems.map(item => {
        if (item.id === scannedItem.id) {
          const newStock = movementType === "entrada" 
            ? item.currentStock + parseInt(quantity)
            : item.currentStock - parseInt(quantity);
          return { ...item, currentStock: Math.max(0, newStock) };
        }
        return item;
      })
    );

    console.log("Movimento registrado:", movement);

    toast({
      title: "✅ Registro salvo com sucesso!",
      description: `${movementType === "entrada" ? "Entrada" : "Saída"} de ${quantity} ${scannedItem.unit} - ${scannedItem.name}`,
    });

    handleMovementDialogClose();
  };

  const handleCreateNewItem = () => {
    if (!newItemName || !newItemCategory || !newItemUnit || !newItemQuantity) {
      toast({
        title: "⚠️ Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    // Gera código único para o novo item
    const existingCodes = items.map(item => item.code);
    const generatedCode = generateUniqueCode(newItemCategory, existingCodes);

    const newItem: Item = {
      id: Date.now().toString(),
      code: generatedCode,
      name: newItemName,
      category: newItemCategory,
      unit: newItemUnit,
      currentStock: parseInt(newItemQuantity),
      minStock: Math.ceil(parseInt(newItemQuantity) * 0.2), // 20% do estoque inicial como mínimo
      observation: newItemObservation
    };

    setItems(prevItems => [...prevItems, newItem]);

    toast({
      title: "✅ Item criado com sucesso!",
      description: `${newItem.name} - Código: ${generatedCode}`,
    });

    handleNewItemDialogClose();
  };

  const handleMovementDialogClose = () => {
    setShowMovementDialog(false);
    setScannedItem(null);
    setMovementType(null);
    setQuantity("");
    setResponsible("");
  };

  const handleNewItemDialogClose = () => {
    setShowNewItemDialog(false);
    setScannedCode("");
    setNewItemName("");
    setNewItemCategory("Peça/Ferramenta");
    setNewItemUnit("");
    setNewItemQuantity("");
    setNewItemObservation("");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Scanner de Códigos</h1>
          <p className="text-muted-foreground">Escaneie códigos para registrar movimentações ou criar novos itens</p>
        </div>

        {/* Camera Scanner */}
        <Card className="p-8 mb-6">
          <div className="text-center">
            <div className="w-full aspect-video bg-secondary rounded-lg flex items-center justify-center mb-6 overflow-hidden relative">
              {isScanning ? (
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <div className="relative">
                    <div className="w-64 h-64 border-4 border-primary rounded-lg animate-pulse"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <QrCode className="h-16 w-16 text-primary mx-auto mb-2" />
                        <p className="text-sm font-medium text-primary">Aguardando código...</p>
                        <p className="text-xs text-muted-foreground mt-1">Use o leitor USB ou digite manualmente</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center space-y-4">
                  <Camera className="h-24 w-24 text-muted-foreground" />
                  <p className="text-muted-foreground">Scanner desativado</p>
                  <p className="text-sm text-muted-foreground">Clique em "Iniciar Scanner" para começar</p>
                </div>
              )}
            </div>

            <div className="flex gap-3 justify-center">
              <Button
                onClick={() => setIsScanning(!isScanning)}
                size="lg"
                className="shadow-md"
              >
                <QrCode className="h-5 w-5 mr-2" />
                {isScanning ? "Parar Scanner" : "Iniciar Scanner"}
              </Button>
            </div>

            {isScanning && (
              <div className="mt-4 p-4 bg-primary/10 rounded-lg border border-primary/20">
                <p className="text-sm text-primary font-medium mb-2">
                  📱 Scanner ativo - Sistema pronto para leitura
                </p>
                <p className="text-xs text-muted-foreground">
                  Posicione o código de barras/QR Code ou use um leitor USB conectado
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Manual Input */}
        <Card className="p-8">
          <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <QrCode className="h-5 w-5 text-primary" />
            Inserir Código Manualmente
          </h2>
          
          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div>
              <Label htmlFor="manual-code">Código de Barras / QR Code</Label>
              <Input
                id="manual-code"
                type="text"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                placeholder="Digite o código aqui (ex: PF001, EPI007)"
                className="text-lg h-12 mt-2"
              />
            </div>
            
            <Button type="submit" className="w-full shadow-md" size="lg">
              <QrCode className="h-5 w-5 mr-2" />
              Verificar Código
            </Button>
          </form>

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground mb-2">
              💡 <strong>Códigos cadastrados para testar:</strong>
            </p>
            <div className="flex flex-wrap gap-2">
              {items.slice(0, 8).map(item => (
                <Badge 
                  key={item.id} 
                  variant="outline" 
                  className="cursor-pointer hover:bg-primary/10 transition-colors"
                  onClick={() => {
                    setManualCode(item.code);
                    handleCodeScanned(item.code);
                  }}
                >
                  {item.code}
                </Badge>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              ℹ️ Clique em um código ou digite um código não cadastrado para criar um novo item
            </p>
          </div>
        </Card>

        {/* Instructions */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
              <QrCode className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Identificar Item</h3>
            <p className="text-sm text-muted-foreground">
              Escaneie códigos existentes para registrar entradas e saídas rapidamente
            </p>
          </Card>

          <Card className="p-6">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-3">
              <Plus className="h-6 w-6 text-accent" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Criar Novo Item</h3>
            <p className="text-sm text-muted-foreground">
              Códigos não cadastrados abrem formulário para criar novo item automaticamente
            </p>
          </Card>

          <Card className="p-6">
            <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mb-3">
              <Package className="h-6 w-6 text-success" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Atualização Automática</h3>
            <p className="text-sm text-muted-foreground">
              Estoque e histórico atualizados instantaneamente após cada registro
            </p>
          </Card>
        </div>
      </div>

      {/* Movement Registration Dialog */}
      <Dialog open={showMovementDialog} onOpenChange={handleMovementDialogClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5 text-primary" />
              Item Identificado
            </DialogTitle>
            <DialogDescription>
              Complete as informações para registrar a movimentação
            </DialogDescription>
          </DialogHeader>

          {scannedItem && (
            <div className="space-y-6">
              {/* Item Info */}
              <div className="p-4 bg-muted rounded-lg border-l-4 border-primary">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <Badge className="mb-2">{scannedItem.category}</Badge>
                    <h4 className="font-semibold text-foreground text-lg">{scannedItem.name}</h4>
                    <p className="text-sm text-muted-foreground mt-1">Código: <span className="font-mono font-semibold">{scannedItem.code}</span></p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-border">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Estoque Atual:</span>
                    <span className="font-bold text-primary">{scannedItem.currentStock} {scannedItem.unit}</span>
                  </div>
                </div>
              </div>

              {/* Movement Type Selection */}
              <div className="space-y-2">
                <Label>Tipo de Movimentação *</Label>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    type="button"
                    variant={movementType === "entrada" ? "default" : "outline"}
                    className={movementType === "entrada" ? "bg-success hover:bg-success/90" : ""}
                    onClick={() => handleMovementTypeSelect("entrada")}
                  >
                    <ArrowUpCircle className="h-4 w-4 mr-2" />
                    Entrada
                  </Button>
                  <Button
                    type="button"
                    variant={movementType === "saida" ? "default" : "outline"}
                    className={movementType === "saida" ? "bg-destructive hover:bg-destructive/90" : ""}
                    onClick={() => handleMovementTypeSelect("saida")}
                  >
                    <ArrowDownCircle className="h-4 w-4 mr-2" />
                    Saída
                  </Button>
                </div>
              </div>

              {/* Quantity */}
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantidade ({scannedItem.unit}) *</Label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="Digite a quantidade"
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Responsible */}
              <div className="space-y-2">
                <Label htmlFor="responsible">Responsável *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="responsible"
                    type="text"
                    value={responsible}
                    onChange={(e) => setResponsible(e.target.value)}
                    placeholder="Nome do responsável"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={handleMovementDialogClose}>
              Cancelar
            </Button>
            <Button type="button" onClick={handleConfirmMovement} className="bg-primary">
              <Package className="h-4 w-4 mr-2" />
              Confirmar Registro
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Item Dialog */}
      <Dialog open={showNewItemDialog} onOpenChange={handleNewItemDialogClose}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-accent" />
              Criar Novo Item
            </DialogTitle>
            <DialogDescription>
              Código não encontrado. Preencha os dados para criar um novo item no sistema.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {scannedCode && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Código escaneado: <span className="font-mono font-semibold text-foreground">{scannedCode}</span>
                </p>
                <p className="text-xs text-accent mt-1">
                  ✨ Um código único será gerado automaticamente para este item
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="new-item-name">Nome do Item *</Label>
              <Input
                id="new-item-name"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder="Ex: Parafuso métrico M8 × 30"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-item-category">Categoria *</Label>
              <Select value={newItemCategory} onValueChange={(value) => setNewItemCategory(value as ItemCategory)}>
                <SelectTrigger id="new-item-category">
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
              <div className="space-y-2">
                <Label htmlFor="new-item-unit">Unidade *</Label>
                <Input
                  id="new-item-unit"
                  value={newItemUnit}
                  onChange={(e) => setNewItemUnit(e.target.value)}
                  placeholder="Ex: un, par, litro"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-item-quantity">Quantidade Inicial *</Label>
                <Input
                  id="new-item-quantity"
                  type="number"
                  min="0"
                  value={newItemQuantity}
                  onChange={(e) => setNewItemQuantity(e.target.value)}
                  placeholder="Ex: 100"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-item-observation">Observação (opcional)</Label>
              <Input
                id="new-item-observation"
                value={newItemObservation}
                onChange={(e) => setNewItemObservation(e.target.value)}
                placeholder="Ex: peça de fixação"
              />
            </div>
          </div>

          <DialogFooter className="flex gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={handleNewItemDialogClose}>
              Cancelar
            </Button>
            <Button type="button" onClick={handleCreateNewItem} className="bg-accent hover:bg-accent/90">
              <Plus className="h-4 w-4 mr-2" />
              Criar Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Scanner;

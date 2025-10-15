import { useState, useEffect } from "react";
import { QrCode, Camera, Maximize, ArrowUpCircle, ArrowDownCircle, User, Hash } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { initialItems, Item } from "@/data/items";

type MovementType = "entrada" | "saida" | null;

const Scanner = () => {
  const [manualCode, setManualCode] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [scannedItem, setScannedItem] = useState<Item | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [movementType, setMovementType] = useState<MovementType>(null);
  const [quantity, setQuantity] = useState("");
  const [responsible, setResponsible] = useState("");

  // Simula o scanner de código de barras USB
  useEffect(() => {
    let buffer = "";
    let timeoutId: NodeJS.Timeout;

    const handleKeyPress = (e: KeyboardEvent) => {
      // Se o scanner estiver ativo ou se for input de código manual, captura
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
    };

    if (isScanning) {
      window.addEventListener("keypress", handleKeyPress);
    }

    return () => {
      window.removeEventListener("keypress", handleKeyPress);
      clearTimeout(timeoutId);
    };
  }, [isScanning]);

  const handleCodeScanned = (code: string) => {
    const foundItem = initialItems.find(
      item => item.code.toLowerCase() === code.toLowerCase()
    );

    if (foundItem) {
      setScannedItem(foundItem);
      setShowDialog(true);
      toast({
        title: "✅ Item Identificado",
        description: `${foundItem.name} - Código: ${foundItem.code}`,
      });
    } else {
      toast({
        title: "❌ Item não encontrado",
        description: `Código "${code}" não está cadastrado no sistema`,
        variant: "destructive",
      });
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualCode.trim()) {
      handleCodeScanned(manualCode.trim());
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

    // Aqui seria onde salvaria no banco de dados
    console.log("Movimento registrado:", movement);

    toast({
      title: "✅ Registro salvo com sucesso!",
      description: `${movementType === "entrada" ? "Entrada" : "Saída"} de ${quantity} ${scannedItem.unit} - ${scannedItem.name}`,
    });

    // Reset
    setShowDialog(false);
    setScannedItem(null);
    setMovementType(null);
    setQuantity("");
    setResponsible("");
  };

  const handleDialogClose = () => {
    setShowDialog(false);
    setScannedItem(null);
    setMovementType(null);
    setQuantity("");
    setResponsible("");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Scanner de Códigos</h1>
          <p className="text-muted-foreground">Escaneie ou insira códigos de barras/QR Code</p>
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
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center space-y-4">
                  <Camera className="h-24 w-24 text-muted-foreground" />
                  <p className="text-muted-foreground">Scanner desativado</p>
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
              
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  if (isScanning) {
                    toast({
                      title: "Modo Tela Cheia",
                      description: "Recurso disponível em breve",
                    });
                  }
                }}
                disabled={!isScanning}
              >
                <Maximize className="h-5 w-5" />
              </Button>
            </div>

            {isScanning && (
              <div className="mt-4 p-4 bg-primary/10 rounded-lg border border-primary/20">
                <p className="text-sm text-primary font-medium mb-2">
                  📱 Scanner ativo - Posicione o código ou use o leitor USB
                </p>
                <p className="text-xs text-muted-foreground">
                  O sistema está pronto para receber códigos da câmera ou de leitores de código de barras USB
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
                onChange={(e) => setManualCode(e.target.value)}
                placeholder="Digite ou cole o código aqui (ex: PF001, EPI007)"
                className="text-lg h-12 mt-2"
              />
            </div>
            
            <Button type="submit" className="w-full shadow-md" size="lg">
              Verificar Código
            </Button>
          </form>

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground mb-2">
              💡 <strong>Códigos de exemplo para testar:</strong>
            </p>
            <div className="flex flex-wrap gap-2">
              {initialItems.slice(0, 6).map(item => (
                <Badge 
                  key={item.id} 
                  variant="outline" 
                  className="cursor-pointer hover:bg-primary/10"
                  onClick={() => setManualCode(item.code)}
                >
                  {item.code}
                </Badge>
              ))}
            </div>
          </div>
        </Card>

        {/* Instructions */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
              <span className="text-2xl">📱</span>
            </div>
            <h3 className="font-semibold text-foreground mb-2">Mobile</h3>
            <p className="text-sm text-muted-foreground">
              Use a câmera do celular para escanear códigos rapidamente
            </p>
          </Card>

          <Card className="p-6">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-3">
              <span className="text-2xl">💻</span>
            </div>
            <h3 className="font-semibold text-foreground mb-2">Desktop</h3>
            <p className="text-sm text-muted-foreground">
              Conecte um leitor USB para bipar códigos diretamente
            </p>
          </Card>

          <Card className="p-6">
            <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center mb-3">
              <span className="text-2xl">⌨️</span>
            </div>
            <h3 className="font-semibold text-foreground mb-2">Manual</h3>
            <p className="text-sm text-muted-foreground">
              Digite ou cole o código manualmente quando necessário
            </p>
          </Card>
        </div>
      </div>

      {/* Movement Registration Dialog */}
      <Dialog open={showDialog} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5 text-primary" />
              Registrar Movimentação
            </DialogTitle>
            <DialogDescription>
              Item identificado com sucesso. Complete as informações abaixo.
            </DialogDescription>
          </DialogHeader>

          {scannedItem && (
            <div className="space-y-6">
              {/* Item Info */}
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <Badge className="mb-2">{scannedItem.category}</Badge>
                    <h4 className="font-semibold text-foreground">{scannedItem.name}</h4>
                    <p className="text-sm text-muted-foreground">Código: {scannedItem.code}</p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-border">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Estoque Atual:</span>
                    <span className="font-semibold">{scannedItem.currentStock} {scannedItem.unit}</span>
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
            <Button type="button" variant="outline" onClick={handleDialogClose}>
              Cancelar
            </Button>
            <Button type="button" onClick={handleConfirmMovement}>
              Confirmar Registro
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Scanner;

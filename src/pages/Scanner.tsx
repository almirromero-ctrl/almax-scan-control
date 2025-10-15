import { useState } from "react";
import { QrCode, Camera, Maximize } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

const Scanner = () => {
  const [manualCode, setManualCode] = useState("");
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = (code: string) => {
    toast({
      title: "Código Escaneado",
      description: `Código: ${code}`,
    });
    setManualCode("");
    setIsScanning(false);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualCode.trim()) {
      handleScan(manualCode);
    }
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
                  <div className="w-64 h-64 border-4 border-primary rounded-lg animate-pulse"></div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center space-y-4">
                  <Camera className="h-24 w-24 text-muted-foreground" />
                  <p className="text-muted-foreground">Câmera desativada</p>
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
              <div className="mt-4 p-3 bg-primary/10 rounded-lg">
                <p className="text-sm text-primary font-medium">
                  Posicione o código dentro do quadrado
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
              <label htmlFor="manual-code" className="block text-sm font-medium text-foreground mb-2">
                Código de Barras / QR Code
              </label>
              <Input
                id="manual-code"
                type="text"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                placeholder="Digite ou cole o código aqui"
                className="text-lg h-12"
              />
            </div>
            
            <Button type="submit" className="w-full shadow-md" size="lg">
              Verificar Código
            </Button>
          </form>

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              💡 <strong>Dica:</strong> Se você possui um leitor de código de barras USB conectado, 
              basta bipar o código que ele será inserido automaticamente no campo acima.
            </p>
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
    </div>
  );
};

export default Scanner;

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Palette, Monitor } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const themeOptions = [
  { name: "Tema Escuro", value: "dark", mode: "dark" },
  { name: "Tema Claro", value: "light", mode: "light" }
];

const backgroundOptions = [
  { name: "Padrão CIOPS", value: "default", gradient: "linear-gradient(135deg, hsl(218, 23%, 6%), hsl(220, 20%, 10%))" },
  { name: "Azul Profundo", value: "deep-blue", gradient: "linear-gradient(135deg, hsl(230, 35%, 8%), hsl(235, 30%, 12%))" },
  { name: "Verde Operacional", value: "operational-green", gradient: "linear-gradient(135deg, hsl(160, 25%, 8%), hsl(165, 20%, 12%))" },
  { name: "Cinza Empresarial", value: "corporate-gray", gradient: "linear-gradient(135deg, hsl(210, 8%, 8%), hsl(215, 10%, 12%))" },
  { name: "Roxo Noturno", value: "night-purple", gradient: "linear-gradient(135deg, hsl(270, 20%, 8%), hsl(275, 18%, 12%))" },
  { name: "Vermelho Crítico", value: "critical-red", gradient: "linear-gradient(135deg, hsl(0, 25%, 8%), hsl(5, 20%, 12%))" }
];

export function BackgroundSettings() {
  const [selectedTheme, setSelectedTheme] = useState("dark");
  const [selectedBackground, setSelectedBackground] = useState("default");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("color-theme") || "dark";
    const savedBackground = localStorage.getItem("background-theme") || "default";
    
    setSelectedTheme(savedTheme);
    setSelectedBackground(savedBackground);
    
    applyTheme(savedTheme);
    applyBackground(savedBackground);
  }, []);

  const applyTheme = (theme: string) => {
    if (theme === "light") {
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
    }
  };

  const applyBackground = (value: string) => {
    const option = backgroundOptions.find(opt => opt.value === value);
    if (option && selectedTheme === "dark") {
      document.documentElement.style.setProperty('--custom-background', option.gradient);
      document.body.style.background = option.gradient;
      document.body.style.backgroundAttachment = 'fixed';
    } else if (selectedTheme === "light") {
      document.body.style.background = "";
      document.documentElement.style.removeProperty('--custom-background');
    }
  };

  const handleThemeChange = (theme: string) => {
    setSelectedTheme(theme);
    localStorage.setItem("color-theme", theme);
    applyTheme(theme);
    applyBackground(selectedBackground);
  };

  const handleBackgroundChange = (value: string) => {
    setSelectedBackground(value);
    localStorage.setItem("background-theme", value);
    applyBackground(value);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Palette className="w-4 h-4" />
          Tema
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Monitor className="w-5 h-5" />
            Configurar Tema da Aplicação
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Seleção de Tema */}
          <div className="space-y-3">
            <h4 className="font-medium text-foreground">Modo de Cor</h4>
            <div className="grid grid-cols-2 gap-2">
              {themeOptions.map((theme) => (
                <Card
                  key={theme.value}
                  className={`cursor-pointer border-2 transition-all hover:scale-105 ${
                    selectedTheme === theme.value 
                      ? "border-primary shadow-[0_0_15px_hsl(var(--primary)/0.3)]" 
                      : "border-card-border hover:border-primary/50"
                  }`}
                  onClick={() => handleThemeChange(theme.value)}
                >
                  <CardContent className="p-3">
                    <div className="text-center">
                      <h5 className="font-medium text-foreground">{theme.name}</h5>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Seleção de Fundo (apenas modo escuro) */}
          {selectedTheme === "dark" && (
            <div className="space-y-3">
              <h4 className="font-medium text-foreground">Fundo (Modo Escuro)</h4>
              <div className="grid grid-cols-1 gap-3">
                {backgroundOptions.map((option) => (
            <Card
              key={option.value}
              className={`cursor-pointer border-2 transition-all hover:scale-105 ${
                selectedBackground === option.value 
                  ? "border-primary shadow-[0_0_15px_hsl(var(--primary)/0.3)]" 
                  : "border-card-border hover:border-primary/50"
              }`}
              onClick={() => handleBackgroundChange(option.value)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="font-medium text-foreground">{option.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedBackground === option.value ? "Tema atual" : "Clique para aplicar"}
                    </p>
                  </div>
                  
                  <div 
                    className="w-12 h-12 rounded-lg border border-card-border shadow-inner"
                    style={{ background: option.gradient }}
                  />
                </div>
              </CardContent>
                </Card>
              ))}
            </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
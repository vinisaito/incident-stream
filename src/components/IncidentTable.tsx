import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, AlertCircle, ExternalLink, Settings } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface Incident {
  id: string;
  tipo: string;
  alerta: string;
  equipe: string;
  abertura: string;
  titulo: string;
  severidade: string;
  acionado: boolean;
  e0: string;
}

interface IncidentTableProps {
  incidents: Incident[];
  onIncidentUpdate: (id: string) => void;
}

export function IncidentTable({ incidents, onIncidentUpdate }: IncidentTableProps) {
  const [crisisDialog, setCrisisDialog] = useState<string | null>(null);
  const [operatorName, setOperatorName] = useState("");
  const [crisisLink, setCrisisLink] = useState("");
  const { toast } = useToast();

  const handleAcionamento = async (incident: Incident) => {
    // Buscar webhook configurado para a equipe
    const webhookConfigs = JSON.parse(localStorage.getItem("webhook-configs") || "[]");
    const webhookConfig = webhookConfigs.find((config: any) => 
      config.equipe.toLowerCase() === incident.equipe.toLowerCase()
    );

    if (!webhookConfig?.webhook) {
      toast({
        title: "Webhook não configurado",
        description: `Configure o webhook para a equipe ${incident.equipe} nas configurações`,
        variant: "destructive"
      });
      return;
    }

    try {
      await fetch(webhookConfig.webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        mode: "no-cors",
        body: JSON.stringify({
          text: `🚨 INCIDENTE ACIONADO\n\nEquipe: ${incident.equipe}\nTítulo: ${incident.titulo}\nSeveridade: ${incident.severidade}\nHorário: ${new Date().toLocaleString()}`
        })
      });

      onIncidentUpdate(incident.id);
      
      toast({
        title: "Acionamento enviado",
        description: `Notificação enviada para a equipe ${incident.equipe}`
      });
    } catch (error) {
      toast({
        title: "Erro no acionamento",
        description: "Falha ao enviar notificação",
        variant: "destructive"
      });
    }
  };

  const handleCrisisProcess = async () => {
    if (!operatorName || !crisisLink) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos",
        variant: "destructive"
      });
      return;
    }

    // Simular processo de crise (seria integrado com Google Sheets API)
    toast({
      title: "Processo de crise iniciado",
      description: `Planilha criada e compartilhada. Operador: ${operatorName}`
    });

    setCrisisDialog(null);
    setOperatorName("");
    setCrisisLink("");
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "sev1":
      case "crítico":
        return "bg-critical text-critical-foreground";
      case "sev2":
        return "bg-error text-error-foreground";
      case "sev3":
        return "bg-warning text-warning-foreground";
      case "sev4":
        return "bg-sev4 text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-foreground">Acionamentos</h3>
      </div>

      <Card className="data-table">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-card-border">
                <th className="text-left p-4 text-sm font-semibold">Tipo</th>
                <th className="text-left p-4 text-sm font-semibold">Alerta</th>
                <th className="text-left p-4 text-sm font-semibold">Equipe</th>
                <th className="text-left p-4 text-sm font-semibold">Abertura</th>
                <th className="text-left p-4 text-sm font-semibold">Título</th>
                <th className="text-left p-4 text-sm font-semibold">Severidade</th>
                <th className="text-center p-4 text-sm font-semibold">Acionado</th>
                <th className="text-left p-4 text-sm font-semibold">E0</th>
              </tr>
            </thead>
            <tbody>
              {incidents.map((incident) => (
                <tr key={incident.id} className="border-b border-card-border hover:bg-secondary/50 transition-colors">
                  <td className="p-4 text-sm">{incident.tipo}</td>
                  <td className="p-4 text-sm">{incident.alerta}</td>
                  <td className="p-4 text-sm font-medium">{incident.equipe}</td>
                  <td className="p-4 text-sm">{incident.abertura}</td>
                  <td className="p-4 text-sm max-w-xs">
                    <div className="flex items-center gap-2">
                      <span className="truncate">{incident.titulo}</span>
                      <Dialog 
                        open={crisisDialog === incident.id} 
                        onOpenChange={(open) => setCrisisDialog(open ? incident.id : null)}
                      >
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="p-1 h-auto">
                            <ExternalLink className="w-3 h-3" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Iniciar Processo de Crise</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="operator">Nome do Operador</Label>
                              <Input
                                id="operator"
                                value={operatorName}
                                onChange={(e) => setOperatorName(e.target.value)}
                                placeholder="Seu nome completo"
                              />
                            </div>
                            <div>
                              <Label htmlFor="link">Link Adicional</Label>
                              <Textarea
                                id="link"
                                value={crisisLink}
                                onChange={(e) => setCrisisLink(e.target.value)}
                                placeholder="Links relevantes ou observações"
                              />
                            </div>
                            <Button onClick={handleCrisisProcess} className="w-full btn-enterprise">
                              Iniciar Processo
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge className={getSeverityColor(incident.severidade)}>
                      {incident.severidade}
                    </Badge>
                  </td>
                  <td className="p-4 text-center">
                    <Button
                      variant={incident.acionado ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleAcionamento(incident)}
                      disabled={incident.acionado}
                      className={incident.acionado ? "bg-success hover:bg-success" : ""}
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                  </td>
                  <td className="p-4 text-sm">{incident.e0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
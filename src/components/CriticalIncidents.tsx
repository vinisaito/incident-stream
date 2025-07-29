import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Clock, User, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface CriticalIncident {
  id: string;
  incidente: string;
  operador: string;
  sala: string;
  timeline: string;
  status: "andamento" | "resolvido" | "escalado";
  iniciadoEm: string;
}

const mockCriticalIncidents: CriticalIncident[] = [
  {
    id: "1",
    incidente: "Falha de conectividade Datacenter SP",
    operador: "João Silva",
    sala: "NOC-01",
    timeline: "2h 30min",
    status: "andamento",
    iniciadoEm: "14:30"
  },
  {
    id: "2", 
    incidente: "DDoS Attack - Portal Principal",
    operador: "Maria Santos",
    sala: "SOC-02",
    timeline: "45min",
    status: "escalado",
    iniciadoEm: "16:45"
  }
];

export function CriticalIncidents() {
  const [isOpen, setIsOpen] = useState(true);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "andamento":
        return "bg-warning text-warning-foreground";
      case "escalado":
        return "bg-critical text-critical-foreground animate-pulse";
      case "resolvido":
        return "bg-success text-success-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "andamento":
        return "Em Andamento";
      case "escalado":
        return "Escalado";
      case "resolvido":
        return "Resolvido";
      default:
        return status;
    }
  };

  return (
    <Card className="card-enterprise">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-secondary/50 transition-colors">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
                <div className="status-indicator status-critical" />
                Incidentes Críticos em Andamento
                <Badge variant="outline" className="ml-2">
                  {mockCriticalIncidents.length}
                </Badge>
              </CardTitle>
              <Button variant="ghost" size="sm">
                {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="space-y-4">
            {mockCriticalIncidents.map((incident) => (
              <Card key={incident.id} className="card-critical border border-critical/30">
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-foreground">{incident.incidente}</h4>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>{incident.operador}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{incident.sala}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{incident.timeline}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={getStatusColor(incident.status)}>
                        {getStatusText(incident.status)}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        Iniciado às {incident.iniciadoEm}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
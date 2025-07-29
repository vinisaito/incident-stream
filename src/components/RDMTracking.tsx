import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Calendar, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface RDM {
  id: string;
  numero: string;
  titulo: string;
  responsavel: string;
  prazo: string;
  prioridade: "alta" | "media" | "baixa";
  status: "aberta" | "pendente" | "concluida";
}

const mockRDMs: RDM[] = [
  {
    id: "1",
    numero: "RDM-2024-001",
    titulo: "Atualização Sistema Monitoramento",
    responsavel: "Equipe Infra",
    prazo: "2024-01-15",
    prioridade: "alta",
    status: "aberta"
  },
  {
    id: "2",
    numero: "RDM-2024-002", 
    titulo: "Implementação Backup Redundante",
    responsavel: "Equipe SysAdmin",
    prazo: "2024-01-20",
    prioridade: "media",
    status: "pendente"
  },
  {
    id: "3",
    numero: "RDM-2024-003",
    titulo: "Migração Servidores Cloud",
    responsavel: "Equipe Cloud",
    prazo: "2024-01-25",
    prioridade: "baixa",
    status: "aberta"
  }
];

export function RDMTracking() {
  const [isOpen, setIsOpen] = useState(true);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "alta":
        return "bg-critical text-critical-foreground";
      case "media":
        return "bg-warning text-warning-foreground";
      case "baixa":
        return "bg-success text-success-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "aberta":
        return "bg-primary text-primary-foreground";
      case "pendente":
        return "bg-warning text-warning-foreground";
      case "concluida":
        return "bg-success text-success-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "aberta":
        return "Aberta";
      case "pendente":
        return "Pendente";
      case "concluida":
        return "Concluída";
      default:
        return status;
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case "alta":
        return "Alta";
      case "media":
        return "Média";
      case "baixa":
        return "Baixa";
      default:
        return priority;
    }
  };

  const openRDMs = mockRDMs.filter(rdm => rdm.status !== "concluida");

  return (
    <Card className="card-enterprise">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-secondary/50 transition-colors">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-warning" />
                Acompanhamento de RDMs
                <Badge variant="outline" className="ml-2">
                  {openRDMs.length} abertas
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
            <div className="grid gap-4">
              {openRDMs.map((rdm) => (
                <Card key={rdm.id} className="bg-card-secondary border border-card-border">
                  <CardContent className="p-4">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-foreground">{rdm.numero}</h4>
                          <Badge className={getPriorityColor(rdm.prioridade)}>
                            {getPriorityText(rdm.prioridade)}
                          </Badge>
                        </div>
                        <p className="text-foreground">{rdm.titulo}</p>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <span>Responsável: {rdm.responsavel}</span>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>Prazo: {new Date(rdm.prazo).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end gap-2">
                        <Badge className={getStatusColor(rdm.status)}>
                          {getStatusText(rdm.status)}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {openRDMs.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma RDM aberta no momento</p>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
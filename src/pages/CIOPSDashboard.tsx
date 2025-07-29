import { useState, useEffect } from "react";
import { StatusCard } from "@/components/StatusCard";
import { PendingCard } from "@/components/PendingCard";
import { IncidentTable } from "@/components/IncidentTable";
import { CriticalIncidents } from "@/components/CriticalIncidents";
import { RDMTracking } from "@/components/RDMTracking";
import { ShiftNotes } from "@/components/ShiftNotes";
import { BackgroundSettings } from "@/components/BackgroundSettings";
import { WebhookSettings } from "@/components/WebhookSettings";
import { useToast } from "@/hooks/use-toast";

interface IncidentData {
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

interface ApiIncidentData {
  num_chamado: string;
  equipe: string;
  dat_abertura: string;
  titulo: string;
  sistema_ambiente: string;
  impacto: string;
  causado_pela_rdm: string;
  soluc_aplicada: string;
  causa_raiz_incidente: string;
}

// Mock data - substituir pela API real
const mockIncidents: IncidentData[] = [
  {
    id: "1",
    tipo: "Incidente",
    alerta: "HIGH_CPU_USAGE",
    equipe: "Infraestrutura",
    abertura: "29/01/2024 14:30",
    titulo: "Alto uso de CPU no servidor DB-PROD-01",
    severidade: "SEV4",
    acionado: false,
    e0: "João Silva"
  },
  {
    id: "2",
    tipo: "Alerta",
    alerta: "DISK_SPACE_LOW",
    equipe: "SysAdmin",
    abertura: "29/01/2024 15:15",
    titulo: "Espaço em disco baixo - Storage Principal",
    severidade: "SEV4",
    acionado: true,
    e0: "Maria Santos"
  },
  {
    id: "3",
    tipo: "Incidente",
    alerta: "SERVICE_DOWN",
    equipe: "Aplicações",
    abertura: "29/01/2024 16:00",
    titulo: "Serviço de autenticação indisponível",
    severidade: "SEV3",
    acionado: false,
    e0: "Carlos Lima"
  },
  {
    id: "4",
    tipo: "Incidente",
    alerta: "NETWORK_LATENCY",
    equipe: "Redes",
    abertura: "29/01/2024 16:30",
    titulo: "Alta latência na conexão com filial São Paulo",
    severidade: "SEV4",
    acionado: false,
    e0: "Ana Costa"
  }
];

export default function CIOPSDashboard() {
  const [incidents, setIncidents] = useState<IncidentData[]>([]);
  const [lastAlertTime, setLastAlertTime] = useState<number>(0);
  const [acionados, setAcionados] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  // Recuperar acionamentos salvos
  useEffect(() => {
    const savedAcionados = localStorage.getItem("acionados");
    if (savedAcionados) {
      setAcionados(new Set(JSON.parse(savedAcionados)));
    }
  }, []);

  // Função para mapear dados da API para formato interno
  const mapApiDataToIncidents = (apiData: ApiIncidentData[]): IncidentData[] => {
    return apiData.map((item, index) => ({
      id: item.num_chamado || `incident-${index}`,
      tipo: item.impacto ? "Incidente" : "Alerta",
      alerta: item.sistema_ambiente || "N/A",
      equipe: item.equipe || "N/A",
      abertura: item.dat_abertura ? new Date(item.dat_abertura).toLocaleString('pt-BR') : "N/A",
      titulo: item.titulo || "N/A",
      severidade: "SEV4", // Mapear baseado na criticidade se disponível
      acionado: acionados.has(item.num_chamado || `incident-${index}`),
      e0: "N/A" // Este campo não vem da API
    }));
  };

  // Atualizar dados da API periodicamente
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://7nu1y7qzs1.execute-api.us-east-1.amazonaws.com/prod/dados");
        if (response.ok) {
          const apiResponse = await response.json();
          // A API retorna { statusCode: 200, body: "[...]" }
          const data = JSON.parse(apiResponse.body) as ApiIncidentData[];
          const mappedIncidents = mapApiDataToIncidents(data);
          setIncidents(mappedIncidents);
        }
      } catch (error) {
        console.error("Erro ao buscar dados da API:", error);
        // Usar dados mock em caso de erro
        setIncidents(mockIncidents);
      }
    };

    // Buscar dados a cada 30 segundos
    const interval = setInterval(fetchData, 30000);
    
    // Buscar dados inicialmente
    fetchData();

    return () => clearInterval(interval);
  }, [acionados]);

  // Verificar alertas não acionados e tocar som
  useEffect(() => {
    const unacknowledgedIncidents = incidents.filter(inc => !inc.acionado);
    const currentTime = Date.now();
    
    if (unacknowledgedIncidents.length > 0 && currentTime - lastAlertTime > 60000) {
      // Tocar som de alerta (substituir por arquivo de audio real)
      const audio = new Audio("data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTyQ2e/MeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBQ==");
      audio.play().catch(console.error);
      
      setLastAlertTime(currentTime);
      
      toast({
        title: "Alerta de Acionamento",
        description: `${unacknowledgedIncidents.length} incidente(s) pendente(s) de acionamento`,
        variant: "destructive"
      });
    }
  }, [incidents, lastAlertTime, toast]);

  const handleIncidentUpdate = (incidentId: string) => {
    const newAcionados = new Set(acionados);
    newAcionados.add(incidentId);
    setAcionados(newAcionados);
    localStorage.setItem("acionados", JSON.stringify(Array.from(newAcionados)));
    
    setIncidents(prev => 
      prev.map(inc => 
        inc.id === incidentId 
          ? { ...inc, acionado: true }
          : inc
      )
    );
  };

  // Calcular estatísticas
  const sev4Incidents = incidents.filter(inc => inc.severidade === "SEV4" && inc.tipo === "Incidente").length;
  const sev4Alerts = incidents.filter(inc => inc.severidade === "SEV4" && inc.tipo === "Alerta").length;
  const sev3Incidents = incidents.filter(inc => inc.severidade === "SEV3").length;
  
  const pendingSev4Incidents = incidents.filter(inc => inc.severidade === "SEV4" && inc.tipo === "Incidente" && !inc.acionado).length;
  const pendingSev4Alerts = incidents.filter(inc => inc.severidade === "SEV4" && inc.tipo === "Alerta" && !inc.acionado).length;
  const pendingSev3Incidents = incidents.filter(inc => inc.severidade === "SEV3" && !inc.acionado).length;

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">PAINEL CIOPS - MONITORAÇÃO</h1>
          <p className="text-muted-foreground">Centro Integrado de Operações e Segurança</p>
        </div>
        <div className="flex items-center gap-2">
          <WebhookSettings />
          <BackgroundSettings />
        </div>
      </div>

      {/* Painel de Acionamentos */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-foreground">PAINEL ACIONAMENTOS</h2>
        
        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <StatusCard 
              title="INCIDENTE SEV4" 
              count={sev4Incidents} 
              severity="sev4"
              variant="incident"
            />
            <PendingCard count={pendingSev4Incidents} />
          </div>
          
          <div className="space-y-3">
            <StatusCard 
              title="ALERTA SEV4" 
              count={sev4Alerts} 
              severity="sev4"
              variant="alert"
            />
            <PendingCard count={pendingSev4Alerts} />
          </div>
          
          <div className="space-y-3">
            <StatusCard 
              title="INCIDENTE SEV3" 
              count={sev3Incidents} 
              severity="sev3" 
            />
            <PendingCard count={pendingSev3Incidents} />
          </div>
        </div>

        {/* Tabela de Incidentes */}
        <IncidentTable 
          incidents={incidents}
          onIncidentUpdate={handleIncidentUpdate}
        />
      </div>

      {/* Layout de 3 colunas para as outras seções */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Coluna 1: Incidentes Críticos */}
        <div className="xl:col-span-1">
          <CriticalIncidents />
        </div>

        {/* Coluna 2: RDMs */}
        <div className="xl:col-span-1">
          <RDMTracking />
        </div>

        {/* Coluna 3: Recados do Turno */}
        <div className="xl:col-span-1">
          <ShiftNotes />
        </div>
      </div>
    </div>
  );
}
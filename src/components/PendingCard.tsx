import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

interface PendingCardProps {
  count: number;
}

export function PendingCard({ count }: PendingCardProps) {
  return (
    <Card className="card-enterprise bg-warning/10 border-warning/30 shadow-[0_0_15px_hsl(var(--warning)/0.2)]">
      <CardHeader className="pb-1">
        <CardTitle className="text-xs text-warning font-medium uppercase tracking-wide flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" />
          Pendente Acionamento
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-1">
        <div className="text-center">
          <span className="text-xl font-bold text-warning">{count}</span>
        </div>
      </CardContent>
    </Card>
  );
}
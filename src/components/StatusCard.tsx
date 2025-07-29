import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatusCardProps {
  title: string;
  count: number;
  severity: "sev4" | "sev3" | "critical";
  variant?: "incident" | "alert";
  className?: string;
}

const severityConfig = {
  sev4: {
    incident: {
      bgClass: "bg-blue-500/10 border-blue-500/30",
      textClass: "text-blue-400",
      glowClass: "shadow-[0_0_20px_hsl(221_83%_53%/0.3)]"
    },
    alert: {
      bgClass: "bg-cyan-500/10 border-cyan-500/30",
      textClass: "text-cyan-400", 
      glowClass: "shadow-[0_0_20px_hsl(188_94%_43%/0.3)]"
    }
  },
  sev3: {
    bgClass: "bg-sev3/10 border-sev3/30", 
    textClass: "text-sev3",
    glowClass: "shadow-[0_0_20px_hsl(var(--sev3)/0.3)]"
  },
  critical: {
    bgClass: "bg-critical/10 border-critical/30",
    textClass: "text-critical",
    glowClass: "shadow-[0_0_20px_hsl(var(--critical)/0.3)]"
  }
};

export function StatusCard({ title, count, severity, variant = "incident", className }: StatusCardProps) {
  const config = severity === "sev4" ? severityConfig[severity][variant] : severityConfig[severity];
  
  return (
    <Card className={cn(
      "card-enterprise card-status relative overflow-hidden",
      config.bgClass,
      config.glowClass,
      className
    )}>
      <CardHeader className="pb-2">
        <CardTitle className={cn("text-sm font-semibold uppercase tracking-wide", config.textClass)}>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center">
          <span className={cn("text-4xl font-bold", config.textClass)}>
            {count}
          </span>
        </div>
        <div className={cn("absolute top-2 right-2 status-indicator", 
          severity === "critical" ? "status-critical" : 
          severity === "sev3" ? "status-warning" : "status-info"
        )} />
      </CardContent>
    </Card>
  );
}
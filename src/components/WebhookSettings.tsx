import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, Plus, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface WebhookConfig {
  equipe: string;
  webhook: string;
}

export function WebhookSettings() {
  const [webhooks, setWebhooks] = useState<WebhookConfig[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [newEquipe, setNewEquipe] = useState("");
  const [newWebhook, setNewWebhook] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("webhook-configs");
    if (saved) {
      setWebhooks(JSON.parse(saved));
    }
  }, []);

  const saveWebhooks = (newWebhooks: WebhookConfig[]) => {
    setWebhooks(newWebhooks);
    localStorage.setItem("webhook-configs", JSON.stringify(newWebhooks));
  };

  const addWebhook = () => {
    if (newEquipe && newWebhook) {
      const newWebhooks = [...webhooks, { equipe: newEquipe, webhook: newWebhook }];
      saveWebhooks(newWebhooks);
      setNewEquipe("");
      setNewWebhook("");
    }
  };

  const removeWebhook = (index: number) => {
    const newWebhooks = webhooks.filter((_, i) => i !== index);
    saveWebhooks(newWebhooks);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings className="w-4 h-4" />
          Webhooks
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Configurar Webhooks por Equipe
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Lista de webhooks existentes */}
          <div className="space-y-2">
            {webhooks.map((webhook, index) => (
              <Card key={index} className="p-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-medium text-sm">{webhook.equipe}</p>
                    <p className="text-xs text-muted-foreground truncate">{webhook.webhook}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeWebhook(index)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Adicionar novo webhook */}
          <div className="space-y-3 border-t pt-4">
            <div className="space-y-2">
              <Label htmlFor="equipe">Nome da Equipe</Label>
              <Input
                id="equipe"
                value={newEquipe}
                onChange={(e) => setNewEquipe(e.target.value)}
                placeholder="Ex: Portal do Cliente"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="webhook">URL do Webhook</Label>
              <Input
                id="webhook"
                value={newWebhook}
                onChange={(e) => setNewWebhook(e.target.value)}
                placeholder="https://chat.googleapis.com/v1/spaces/..."
              />
            </div>
            
            <Button onClick={addWebhook} className="w-full gap-2">
              <Plus className="w-4 h-4" />
              Adicionar Webhook
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
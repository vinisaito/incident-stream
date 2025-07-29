import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, MessageSquare, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ShiftNote {
  id: string;
  texto: string;
  autor: string;
  timestamp: string;
}

export function ShiftNotes() {
  const [notes, setNotes] = useState<ShiftNote[]>([]);
  const [newNote, setNewNote] = useState("");
  const [authorName, setAuthorName] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const savedNotes = localStorage.getItem("shift-notes");
    const savedAuthor = localStorage.getItem("shift-author");
    
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
    
    if (savedAuthor) {
      setAuthorName(savedAuthor);
    }
  }, []);

  const saveNotes = (updatedNotes: ShiftNote[]) => {
    setNotes(updatedNotes);
    localStorage.setItem("shift-notes", JSON.stringify(updatedNotes));
  };

  const addNote = () => {
    if (!newNote.trim()) {
      toast({
        title: "Erro",
        description: "Digite o conteúdo do recado",
        variant: "destructive"
      });
      return;
    }

    if (!authorName.trim()) {
      toast({
        title: "Erro", 
        description: "Digite seu nome",
        variant: "destructive"
      });
      return;
    }

    const note: ShiftNote = {
      id: Date.now().toString(),
      texto: newNote,
      autor: authorName,
      timestamp: new Date().toLocaleString()
    };

    const updatedNotes = [note, ...notes];
    saveNotes(updatedNotes);
    
    // Salvar nome do autor para próximas vezes
    localStorage.setItem("shift-author", authorName);
    
    setNewNote("");
    
    toast({
      title: "Recado adicionado",
      description: "Recado do turno salvo com sucesso!"
    });
  };

  const removeNote = (id: string) => {
    const updatedNotes = notes.filter(note => note.id !== id);
    saveNotes(updatedNotes);
    
    toast({
      title: "Recado removido",
      description: "Recado excluído com sucesso!"
    });
  };

  return (
    <Card className="card-enterprise">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-primary" />
          Recados do Turno
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Formulário para adicionar recado */}
        <div className="space-y-3 p-4 bg-card-secondary rounded-lg border border-card-border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input
              placeholder="Seu nome"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
            />
            <Button onClick={addNote} className="btn-enterprise gap-2">
              <Plus className="w-4 h-4" />
              Adicionar Recado
            </Button>
          </div>
          <Textarea
            placeholder="Digite o recado do turno..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            rows={3}
          />
        </div>

        {/* Lista de recados */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {notes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum recado do turno</p>
              <p className="text-sm">Adicione o primeiro recado acima</p>
            </div>
          ) : (
            notes.map((note) => (
              <Card key={note.id} className="bg-card-secondary border border-card-border">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 space-y-2">
                      <p className="text-foreground whitespace-pre-wrap">{note.texto}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="font-medium">{note.autor}</span>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{note.timestamp}</span>
                        </div>
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeNote(note.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
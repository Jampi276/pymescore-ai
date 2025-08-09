import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Send, ArrowLeft, Bot, User, FileText } from "lucide-react";
import { BrandButton } from "@/components/ui/brand-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import ProtectedRoute from "@/components/ProtectedRoute";

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const ChatDoc = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: '¡Hola! Soy tu asistente financiero especializado en análisis de riesgo para PYMEs. 📊\n\nPuedo ayudarte con consultas sobre:\n- Análisis de estados financieros\n- Interpretación de scoring crediticio\n- Recomendaciones para mejorar el perfil de riesgo\n- Datos de comportamiento digital\n\n¿En qué puedo ayudarte hoy?',
      timestamp: new Date()
    }
  ]);
  
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Simulación de respuesta del chatbot
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Respuestas predefinidas basadas en palabras clave
      let response = "";
      const input = inputValue.toLowerCase();

      if (input.includes('liquidez') || input.includes('liquidity')) {
        response = "La **liquidez corriente** es un indicador clave que mide la capacidad de la empresa para cubrir sus obligaciones a corto plazo. 💧\n\nUn ratio de 1.5 o superior generalmente se considera saludable. En tu análisis actual, veo que tienes una liquidez de 1.85, lo cual es **muy positivo** ✅\n\n**Recomendaciones:**\n- Mantener este nivel de liquidez\n- Diversificar las fuentes de ingresos\n- Establecer líneas de crédito preventivas";
      } else if (input.includes('scoring') || input.includes('score')) {
        response = "El **scoring crediticio** se calcula considerando múltiples factores: 🎯\n\n**Componentes principales:**\n- 📈 Indicadores financieros (40%)\n- 🌐 Comportamiento digital (25%)\n- 🤝 Referencias comerciales (20%)\n- 📋 Historial de pagos (15%)\n\nTu scoring actual del **78%** indica un **riesgo bajo**, lo que es excelente para acceder a crédito con condiciones favorables.";
      } else if (input.includes('mejorar') || input.includes('improve')) {
        response = "Para **mejorar tu perfil crediticio**, te sugiero: 🚀\n\n**Acciones inmediatas:**\n1. **Optimizar ratios financieros** - Reducir endeudamiento gradualmente\n2. **Fortalecer presencia digital** - Actualizar perfiles en redes sociales\n3. **Documentar transacciones** - Mantener registros detallados\n4. **Diversificar clientes** - Reducir concentración de riesgo\n\n**Impacto esperado:** +5-10 puntos en scoring en 3-6 meses";
      } else if (input.includes('riesgo') || input.includes('risk')) {
        response = "El **análisis de riesgo** evalúa la probabilidad de impago considerando: ⚠️\n\n**Niveles de riesgo:**\n🟢 **Bajo (70-100%)** - Aprobación casi garantizada\n🟡 **Medio (40-69%)** - Requiere garantías adicionales\n🔴 **Alto (0-39%)** - Necesita mejoras sustanciales\n\nTu clasificación actual es **riesgo bajo**, lo que te permite acceder a mejores condiciones crediticias.";
      } else if (input.includes('reputación') || input.includes('digital')) {
        response = "La **reputación digital** es crucial en el análisis moderno de riesgo: 🌐\n\n**Factores evaluados:**\n- ⭐ Calificaciones en Google/Facebook\n- 📱 Actividad en redes sociales\n- 💬 Reseñas de clientes\n- 🔗 Presencia web profesional\n\n**Tu estado actual:** Reputación sólida (4.2/5)\n\n**Sugerencias:**\n- Responder a todas las reseñas\n- Publicar contenido regularmente\n- Mantener información actualizada";
      } else {
        response = "Entiendo tu consulta sobre **análisis financiero**. 🤔\n\nPuedo ayudarte con información más específica si me compartes detalles sobre:\n\n- 📊 Qué indicador financiero te interesa\n- 🎯 Objetivo específico (crédito, inversión, etc.)\n- ⏰ Plazo que tienes en mente\n- 💰 Monto aproximado que necesitas\n\n¿Sobre cuál de estos temas te gustaría profundizar?";
      }

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo procesar la consulta. Intenta nuevamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatMessage = (content: string) => {
    // Convertir markdown básico a HTML
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background py-8">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Chat Financiero IA
              </h1>
              <p className="text-muted-foreground">
                Consulta sobre tus análisis financieros y obtén recomendaciones personalizadas
              </p>
            </div>
            
            <BrandButton asChild variant="outline">
              <Link to="/analysis">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver a Análisis
              </Link>
            </BrandButton>
          </div>

          <Card className="h-[70vh] flex flex-col shadow-brand">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center space-x-2">
                <Bot className="h-5 w-5 text-brand-accent" />
                <span>Asistente Financiero IA</span>
                <div className="flex items-center space-x-1 ml-auto">
                  <div className="w-2 h-2 bg-brand-accent rounded-full animate-pulse"></div>
                  <span className="text-sm text-muted-foreground">En línea</span>
                </div>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col p-0">
              {/* Área de mensajes */}
              <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex items-start space-x-3 ${
                        message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                      }`}
                    >
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className={
                          message.type === 'user' 
                            ? 'bg-brand-primary text-white' 
                            : 'bg-brand-accent text-white'
                        }>
                          {message.type === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className={`max-w-[80%] ${message.type === 'user' ? 'text-right' : ''}`}>
                        <div
                          className={`p-3 rounded-lg ${
                            message.type === 'user'
                              ? 'bg-brand-primary text-white'
                              : 'bg-muted text-foreground'
                          }`}
                        >
                          <div 
                            dangerouslySetInnerHTML={{ 
                              __html: formatMessage(message.content) 
                            }}
                          />
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {message.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex items-start space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-brand-accent text-white">
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-muted p-3 rounded-lg">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Área de entrada */}
              <div className="border-t p-4">
                <div className="flex items-end space-x-2">
                  <div className="flex-1">
                    <Textarea
                      ref={textareaRef}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Pregunta sobre liquidez, scoring, riesgos, reputación digital..."
                      className="min-h-[60px] max-h-32 resize-none"
                      disabled={isLoading}
                    />
                    <div className="text-xs text-muted-foreground mt-1">
                      Presiona Enter para enviar, Shift+Enter para nueva línea
                    </div>
                  </div>
                  
                  <BrandButton
                    onClick={handleSend}
                    disabled={!inputValue.trim() || isLoading}
                    size="icon"
                    className="h-[60px] w-[60px]"
                  >
                    <Send className="h-5 w-5" />
                  </BrandButton>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Información adicional */}
          <Card className="mt-6">
            <CardContent className="pt-6">
              <div className="flex items-start space-x-3">
                <FileText className="h-5 w-5 text-brand-primary mt-0.5" />
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Base de Conocimiento Activa
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Este chat tiene acceso a los datos financieros y análisis previos de tu empresa. 
                    Puedes preguntar sobre indicadores específicos, interpretación de resultados, 
                    o solicitar recomendaciones personalizadas para mejorar tu perfil crediticio.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ChatDoc;
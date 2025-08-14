import React from 'react';
import { AlertTriangle, CheckCircle, XCircle, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface RiskData {
  tipo: string;
  nivel: 'bajo' | 'medio' | 'alto';
  descripcion: string;
}

interface RiskCardProps {
  titulo: string;
  datos: string[] | RiskData[];
  tipo: 'financiera' | 'digital' | 'referencias' | 'riesgos';
  scoring?: {
    nivel: string;
    umbral: number;
    puntuacion?: number;
  };
}

export const RiskCard: React.FC<RiskCardProps> = ({ titulo, datos, tipo, scoring }) => {
  const getCardIcon = () => {
    switch (tipo) {
      case 'financiera':
        return <TrendingUp className="h-5 w-5" />;
      case 'digital':
        return <TrendingDown className="h-5 w-5" />;
      case 'referencias':
        return <CheckCircle className="h-5 w-5" />;
      case 'riesgos':
        return <AlertTriangle className="h-5 w-5" />;
      default:
        return <Minus className="h-5 w-5" />;
    }
  };
  
  const getCardColor = () => {
    switch (tipo) {
      case 'financiera':
        return 'text-brandPrimary';
      case 'digital':
        return 'text-purple-600';
      case 'referencias':
        return 'text-brandAccent';
      case 'riesgos':
        return 'text-orange-600';
      default:
        return 'text-brandSecondary';
    }
  };
  
  const getRiskIcon = (nivel: string) => {
    switch (nivel.toLowerCase()) {
      case 'bajo':
        return <CheckCircle className="h-4 w-4 text-brandAccent" />;
      case 'medio':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'alto':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-400" />;
    }
  };
  
  const getRiskVariant = (nivel: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (nivel.toLowerCase()) {
      case 'bajo':
        return 'default';
      case 'medio':
        return 'secondary';
      case 'alto':
        return 'destructive';
      default:
        return 'outline';
    }
  };
  
  const getScoringColor = (nivel: string) => {
    switch (nivel.toLowerCase()) {
      case 'bajo':
        return 'text-brandAccent';
      case 'medio':
        return 'text-yellow-600';
      case 'alto':
        return 'text-red-600';
      default:
        return 'text-brandSecondary';
    }
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-EC', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  return (
    <Card className="h-full transition-smooth hover:shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className={`flex items-center space-x-2 text-lg ${getCardColor()}`}>
          {getCardIcon()}
          <span>{titulo}</span>
          {scoring && (
            <Badge variant="outline" className={getScoringColor(scoring.nivel)}>
              {scoring.nivel.toUpperCase()}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {/* Scoring específico */}
        {scoring && (
          <div className="p-3 bg-muted rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Umbral de Crédito:</span>
              <span className="font-bold text-brandPrimary">
                {formatCurrency(scoring.umbral)}
              </span>
            </div>
            {scoring.puntuacion && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Puntuación:</span>
                <span className={`font-bold ${getScoringColor(scoring.nivel)}`}>
                  {scoring.puntuacion}/100
                </span>
              </div>
            )}
          </div>
        )}
        
        {/* Lista de datos */}
        <div className="space-y-2">
          {datos.map((item, index) => {
            if (typeof item === 'string') {
              return (
                <div key={index} className="flex items-start space-x-2 p-2 bg-background rounded">
                  <div className="w-2 h-2 rounded-full bg-brandPrimary mt-2 flex-shrink-0" />
                  <span className="text-sm text-gray-700 leading-relaxed">{item}</span>
                </div>
              );
            } else {
              // Es un objeto RiskData
              return (
                <div key={index} className="p-3 border rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getRiskIcon(item.nivel)}
                      <span className="font-medium capitalize">{item.tipo}</span>
                    </div>
                    <Badge variant={getRiskVariant(item.nivel)}>
                      {item.nivel.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {item.descripcion}
                  </p>
                </div>
              );
            }
          })}
        </div>
        
        {/* Estado vacío */}
        {datos.length === 0 && (
          <div className="text-center py-6 text-gray-500">
            <Minus className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No hay datos disponibles</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
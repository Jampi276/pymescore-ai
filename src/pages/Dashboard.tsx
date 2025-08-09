import { useState } from "react";
import { Link } from "react-router-dom";
import { BarChart3, TrendingUp, Download, Filter, ArrowLeft } from "lucide-react";
import { BrandButton } from "@/components/ui/brand-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import ProtectedRoute from "@/components/ProtectedRoute";

interface CompanyData {
  id: string;
  name: string;
  scoring: number;
  risk: 'bajo' | 'medio' | 'alto';
  creditLimit: number;
  sector: string;
  lastUpdate: string;
}

const Dashboard = () => {
  const { toast } = useToast();
  const [sortBy, setSortBy] = useState("scoring");
  const [filterSector, setFilterSector] = useState("all");
  const [simulationForm, setSimulationForm] = useState({
    salesImprovement: "",
    reputationImprovement: ""
  });

  const mockData: CompanyData[] = [
    {
      id: "1",
      name: "Distribuidora La Economía",
      scoring: 78,
      risk: "bajo",
      creditLimit: 50000,
      sector: "Comercio",
      lastUpdate: "2024-01-15"
    },
    {
      id: "2", 
      name: "Textiles Andinos S.A.",
      scoring: 65,
      risk: "medio",
      creditLimit: 35000,
      sector: "Manufactura",
      lastUpdate: "2024-01-14"
    },
    {
      id: "3",
      name: "Servicios Técnicos Beta",
      scoring: 45,
      risk: "alto",
      creditLimit: 15000,
      sector: "Servicios",
      lastUpdate: "2024-01-13"
    },
    {
      id: "4",
      name: "Agropecuaria Verde",
      scoring: 82,
      risk: "bajo",
      creditLimit: 60000,
      sector: "Agricultura",
      lastUpdate: "2024-01-16"
    }
  ];

  const getRiskColor = (risk: 'bajo' | 'medio' | 'alto') => {
    switch (risk) {
      case 'bajo': return 'bg-green-100 text-green-800 border-green-200';
      case 'medio': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'alto': return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  const sortedData = [...mockData].sort((a, b) => {
    switch (sortBy) {
      case 'scoring':
        return b.scoring - a.scoring;
      case 'risk':
        const riskOrder = { 'bajo': 1, 'medio': 2, 'alto': 3 };
        return riskOrder[a.risk] - riskOrder[b.risk];
      case 'sector':
        return a.sector.localeCompare(b.sector);
      default:
        return 0;
    }
  });

  const filteredData = filterSector === "all" 
    ? sortedData 
    : sortedData.filter(item => item.sector === filterSector);

  const handleSimulation = () => {
    if (!simulationForm.salesImprovement && !simulationForm.reputationImprovement) {
      toast({
        title: "Datos requeridos",
        description: "Ingresa al menos un valor para la simulación",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Simulación actualizada",
      description: "Los gráficos se han actualizado con los nuevos valores",
    });
  };

  const exportReport = () => {
    const reportData = filteredData.map(company => 
      `${company.name}: Scoring ${company.scoring}%, Riesgo ${company.risk}, Crédito $${company.creditLimit.toLocaleString()}, Sector ${company.sector}`
    ).join('\n');

    const blob = new Blob([`Reporte PYME Credit AI - ${new Date().toLocaleDateString()}\n\n${reportData}`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporte-pyme-credit-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Reporte exportado",
      description: "El archivo se ha descargado correctamente",
    });
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Dashboard de Análisis
              </h1>
              <p className="text-muted-foreground">
                Comparativas, simulaciones y métricas de riesgo financiero
              </p>
            </div>
            
            <BrandButton asChild variant="outline">
              <Link to="/analysis">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver a Análisis
              </Link>
            </BrandButton>
          </div>

          {/* Estadísticas generales */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="shadow-brand">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  PYMEs Analizadas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-brand-primary">{filteredData.length}</div>
                <p className="text-xs text-muted-foreground">Total en el sistema</p>
              </CardContent>
            </Card>
            
            <Card className="shadow-success">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Riesgo Bajo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-brand-accent">
                  {filteredData.filter(d => d.risk === 'bajo').length}
                </div>
                <p className="text-xs text-muted-foreground">Empresas con bajo riesgo</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Scoring Promedio
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {Math.round(filteredData.reduce((acc, curr) => acc + curr.scoring, 0) / filteredData.length)}%
                </div>
                <p className="text-xs text-muted-foreground">Puntuación media</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Crédito Total
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  ${(filteredData.reduce((acc, curr) => acc + curr.creditLimit, 0) / 1000).toFixed(0)}K
                </div>
                <p className="text-xs text-muted-foreground">Límite de crédito total</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Tabla comparativa */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Comparativo de PYMEs</CardTitle>
                      <CardDescription>
                        Análisis comparativo de riesgos y scoring crediticio
                      </CardDescription>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Filter className="h-4 w-4 text-muted-foreground" />
                        <Select value={filterSector} onValueChange={setFilterSector}>
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Sector" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Todos</SelectItem>
                            <SelectItem value="Comercio">Comercio</SelectItem>
                            <SelectItem value="Manufactura">Manufactura</SelectItem>
                            <SelectItem value="Servicios">Servicios</SelectItem>
                            <SelectItem value="Agricultura">Agricultura</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Ordenar" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="scoring">Scoring</SelectItem>
                          <SelectItem value="risk">Riesgo</SelectItem>
                          <SelectItem value="sector">Sector</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <BrandButton onClick={exportReport} variant="secondary" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Exportar
                      </BrandButton>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>PYME</TableHead>
                        <TableHead>Scoring</TableHead>
                        <TableHead>Riesgo</TableHead>
                        <TableHead>Crédito Sugerido</TableHead>
                        <TableHead>Sector</TableHead>
                        <TableHead>Última Actualización</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredData.map((company) => (
                        <TableRow key={company.id} className="hover:bg-muted/50">
                          <TableCell className="font-medium">{company.name}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <span className="font-semibold">{company.scoring}%</span>
                              <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-brand-accent transition-all" 
                                  style={{ width: `${company.scoring}%` }}
                                />
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getRiskColor(company.risk)}>
                              {company.risk.toUpperCase()}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium">
                            ${company.creditLimit.toLocaleString()}
                          </TableCell>
                          <TableCell>{company.sector}</TableCell>
                          <TableCell className="text-muted-foreground">
                            {new Date(company.lastUpdate).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>

            {/* Simulaciones */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-brand-primary" />
                  <span>Simulaciones "¿Qué pasaría si...?"</span>
                </CardTitle>
                <CardDescription>
                  Modela escenarios de mejora para evaluar impacto en scoring
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="sales-improvement">Mejora en ventas (%)</Label>
                      <Input
                        id="sales-improvement"
                        type="number"
                        placeholder="ej. 15"
                        value={simulationForm.salesImprovement}
                        onChange={(e) => setSimulationForm({
                          ...simulationForm, 
                          salesImprovement: e.target.value
                        })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="reputation-improvement">Mejora en reputación (%)</Label>
                      <Input
                        id="reputation-improvement"
                        type="number"
                        placeholder="ej. 20"
                        value={simulationForm.reputationImprovement}
                        onChange={(e) => setSimulationForm({
                          ...simulationForm, 
                          reputationImprovement: e.target.value
                        })}
                      />
                    </div>
                  </div>
                  
                  <BrandButton onClick={handleSimulation} className="w-full">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Actualizar Simulación
                  </BrandButton>
                  
                  {/* Área de gráficos simulados */}
                  <div className="mt-6 p-6 bg-muted/30 rounded-lg border-2 border-dashed border-muted-foreground/20">
                    <div className="text-center text-muted-foreground">
                      <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium mb-2">Gráficos Interactivos</p>
                      <p className="text-sm">
                        Los gráficos de barras mostrando ventas, reputación y riesgos 
                        se actualizarían aquí basados en las simulaciones.
                      </p>
                      <div className="mt-4 grid grid-cols-3 gap-4 text-xs">
                        <div className="bg-brand-primary/10 p-3 rounded">
                          <div className="text-brand-primary font-semibold">Ventas</div>
                          <div className="mt-1">+{simulationForm.salesImprovement || 0}%</div>
                        </div>
                        <div className="bg-brand-accent/10 p-3 rounded">
                          <div className="text-brand-accent font-semibold">Reputación</div>
                          <div className="mt-1">+{simulationForm.reputationImprovement || 0}%</div>
                        </div>
                        <div className="bg-brand-secondary/10 p-3 rounded">
                          <div className="text-brand-secondary font-semibold">Scoring</div>
                          <div className="mt-1">Proyectado</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Dashboard;
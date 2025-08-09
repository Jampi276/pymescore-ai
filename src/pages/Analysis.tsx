import { useState } from "react";
import { Link } from "react-router-dom";
import { Upload, Globe, FileCheck, AlertCircle, CheckCircle, ArrowRight, Download } from "lucide-react";
import { BrandButton } from "@/components/ui/brand-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import ProtectedRoute from "@/components/ProtectedRoute";

interface AnalysisResult {
  sections: {
    financial: Array<{ title: string; value: string; risk: 'low' | 'medium' | 'high' }>;
    digital: Array<{ title: string; value: string; risk: 'low' | 'medium' | 'high' }>;
    references: Array<{ title: string; value: string; risk: 'low' | 'medium' | 'high' }>;
  };
  risks: Array<{ type: string; level: 'low' | 'medium' | 'high'; description: string }>;
  scoring: {
    level: 'bajo' | 'medio' | 'alto';
    percentage: number;
    threshold: number;
  };
}

const Analysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [socialUrl, setSocialUrl] = useState("");
  const [ruc, setRuc] = useState("");
  const [rucValid, setRucValid] = useState<boolean | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // Validar que sean PDFs
      const validFiles = Array.from(files).filter(file => file.type === 'application/pdf');
      if (validFiles.length !== files.length) {
        toast({
          title: "Archivos inválidos",
          description: "Solo se permiten archivos PDF",
          variant: "destructive",
        });
        return;
      }
      setSelectedFiles(files);
    }
  };

  const validateRuc = async () => {
    if (!ruc || ruc.length !== 13) {
      toast({
        title: "RUC inválido",
        description: "El RUC debe tener 13 dígitos",
        variant: "destructive",
      });
      return;
    }

    try {
      // Simulación de validación de RUC
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulamos que algunos RUCs son válidos
      const validRucs = ['1792146739001', '1791234567001', '0992736345001'];
      const isValid = validRucs.includes(ruc) || Math.random() > 0.3;
      
      setRucValid(isValid);
      toast({
        title: isValid ? "RUC válido" : "RUC no válido",
        description: isValid ? "RUC verificado correctamente" : "No se pudo verificar el RUC",
        variant: isValid ? "default" : "destructive",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo validar el RUC",
        variant: "destructive",
      });
    }
  };

  const analyzeSocial = async () => {
    if (!socialUrl) {
      toast({
        title: "URL requerida",
        description: "Por favor ingresa una URL de red social",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsAnalyzing(true);
      setProgress(20);
      
      // Simulación de scraping
      await new Promise(resolve => setTimeout(resolve, 2000));
      setProgress(60);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProgress(100);
      
      toast({
        title: "Análisis completado",
        description: "Se han extraído datos de la red social",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo analizar la red social",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
      setProgress(0);
    }
  };

  const evaluateRisk = async () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      toast({
        title: "Archivos requeridos",
        description: "Por favor carga al menos un PDF financiero",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsAnalyzing(true);
      setProgress(0);

      // Simulación de procesamiento
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProgress(25);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProgress(50);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProgress(75);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProgress(100);

      // Resultado simulado
      const mockResult: AnalysisResult = {
        sections: {
          financial: [
            { title: "Liquidez Corriente", value: "1.85", risk: "low" },
            { title: "Endeudamiento", value: "45%", risk: "medium" },
            { title: "ROE", value: "12.5%", risk: "low" },
            { title: "Margen Neto", value: "8.2%", risk: "low" }
          ],
          digital: [
            { title: "Presencia Online", value: "Buena", risk: "low" },
            { title: "Reputación Digital", value: "4.2/5", risk: "low" },
            { title: "Actividad Social", value: "Alta", risk: "low" }
          ],
          references: [
            { title: "Referencias Comerciales", value: "Positivas", risk: "low" },
            { title: "Historial Pagos", value: "Puntual", risk: "low" },
            { title: "Estabilidad Operativa", value: "3 años", risk: "medium" }
          ]
        },
        risks: [
          { type: "Liquidez", level: "low", description: "Indicadores de liquidez saludables" },
          { type: "Concentración", level: "medium", description: "Dependencia moderada de pocos clientes" },
          { type: "Mercado", level: "low", description: "Sector con crecimiento estable" }
        ],
        scoring: {
          level: "bajo",
          percentage: 78,
          threshold: 50000
        }
      };

      setAnalysisResult(mockResult);
      
      toast({
        title: "¡Evaluación completada!",
        description: "El análisis de riesgo ha sido generado exitosamente",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo completar la evaluación",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
      setProgress(0);
    }
  };

  const getRiskColor = (risk: 'low' | 'medium' | 'high') => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  const getRiskIcon = (risk: 'low' | 'medium' | 'high') => {
    switch (risk) {
      case 'low': return <CheckCircle className="h-4 w-4" />;
      case 'medium': return <AlertCircle className="h-4 w-4" />;
      case 'high': return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Análisis de Riesgo Financiero
            </h1>
            <p className="text-muted-foreground">
              Carga tus documentos financieros y datos adicionales para una evaluación completa
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Formularios de entrada */}
            <div className="space-y-6">
              {/* Upload de PDFs */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Upload className="h-5 w-5 text-brand-primary" />
                    <span>Estados Financieros</span>
                  </CardTitle>
                  <CardDescription>
                    Carga PDFs de estados financieros descargados de SCVS
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Label htmlFor="pdf-upload">Seleccionar archivos PDF</Label>
                    <Input
                      id="pdf-upload"
                      type="file"
                      multiple
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="cursor-pointer"
                    />
                    {selectedFiles && (
                      <div className="text-sm text-muted-foreground">
                        {selectedFiles.length} archivo(s) seleccionado(s)
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* URL Red Social */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Globe className="h-5 w-5 text-brand-primary" />
                    <span>Análisis de Redes Sociales</span>
                  </CardTitle>
                  <CardDescription>
                    URL de Facebook, Twitter o LinkedIn para análisis de reputación
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Label htmlFor="social-url">URL de red social</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="social-url"
                        type="url"
                        placeholder="https://facebook.com/empresa"
                        value={socialUrl}
                        onChange={(e) => setSocialUrl(e.target.value)}
                      />
                      <BrandButton 
                        onClick={analyzeSocial}
                        disabled={isAnalyzing}
                        variant="secondary"
                      >
                        Analizar
                      </BrandButton>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Validación RUC */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileCheck className="h-5 w-5 text-brand-primary" />
                    <span>Validación de RUC</span>
                  </CardTitle>
                  <CardDescription>
                    Verificar RUC en registros oficiales
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Label htmlFor="ruc">RUC de la empresa</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="ruc"
                        type="text"
                        placeholder="1792146739001"
                        value={ruc}
                        onChange={(e) => setRuc(e.target.value)}
                        maxLength={13}
                      />
                      <BrandButton 
                        onClick={validateRuc}
                        variant="secondary"
                      >
                        Validar
                      </BrandButton>
                    </div>
                    {rucValid !== null && (
                      <Badge 
                        className={rucValid ? getRiskColor('low') : getRiskColor('high')}
                      >
                        {rucValid ? 'RUC Válido' : 'RUC No Válido'}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Botón principal */}
              <BrandButton 
                onClick={evaluateRisk}
                disabled={isAnalyzing}
                className="w-full"
                size="lg"
              >
                {isAnalyzing ? "Evaluando..." : "Evaluar Riesgo"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </BrandButton>

              {isAnalyzing && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Procesando análisis...</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="w-full" />
                </div>
              )}
            </div>

            {/* Resultados */}
            {analysisResult && (
              <div className="space-y-6">
                <Card className="shadow-brand">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Scoring de Riesgo</span>
                      <Badge className="success-gradient text-white">
                        {analysisResult.scoring.percentage}% - Riesgo {analysisResult.scoring.level}
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      Umbral de crédito sugerido: ${analysisResult.scoring.threshold.toLocaleString()}
                    </CardDescription>
                  </CardHeader>
                </Card>

                {/* Secciones de análisis */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Análisis Financiero</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {analysisResult.sections.financial.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <span className="font-medium">{item.title}</span>
                        <div className="flex items-center space-x-2">
                          <span>{item.value}</span>
                          <Badge className={getRiskColor(item.risk)}>
                            {getRiskIcon(item.risk)}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Análisis Digital</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {analysisResult.sections.digital.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <span className="font-medium">{item.title}</span>
                        <div className="flex items-center space-x-2">
                          <span>{item.value}</span>
                          <Badge className={getRiskColor(item.risk)}>
                            {getRiskIcon(item.risk)}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Referencias</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {analysisResult.sections.references.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <span className="font-medium">{item.title}</span>
                        <div className="flex items-center space-x-2">
                          <span>{item.value}</span>
                          <Badge className={getRiskColor(item.risk)}>
                            {getRiskIcon(item.risk)}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <BrandButton asChild variant="primary" className="flex-1">
                    <Link to="/dashboard">Ver Dashboard</Link>
                  </BrandButton>
                  <BrandButton asChild variant="secondary" className="flex-1">
                    <Link to="/chat">Consultar en Chat</Link>
                  </BrandButton>
                  <BrandButton asChild variant="outline">
                    <Link to="/">Volver a Inicio</Link>
                  </BrandButton>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Analysis;
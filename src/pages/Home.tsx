import { Link } from "react-router-dom";
import { 
  ArrowRight, 
  BarChart3, 
  Shield, 
  Zap, 
  Users, 
  TrendingUp, 
  FileCheck,
  Brain,
  Globe,
  CheckCircle,
  Star
} from "lucide-react";
import { BrandButton } from "@/components/ui/brand-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import heroImage from "@/assets/hero-financial-ai.jpg";

const Home = () => {
  const services = [
    {
      icon: FileCheck,
      title: "Análisis Automático de PDFs",
      description: "Procesamiento inteligente de estados financieros con NLP avanzado para extraer insights clave."
    },
    {
      icon: Globe,
      title: "Análisis de Redes Sociales",
      description: "Evaluación de reputación digital y comportamiento comercial en plataformas sociales."
    },
    {
      icon: Brain,
      title: "Scoring Alternativo con IA",
      description: "Generación de puntuaciones de riesgo usando datos no tradicionales y algoritmos de ML."
    },
    {
      icon: Shield,
      title: "Validación de Datos",
      description: "Verificación automática de RUC y validación cruzada con fuentes oficiales."
    },
    {
      icon: BarChart3,
      title: "Dashboard Interactivo",
      description: "Visualizaciones dinámicas con simulaciones y comparativos sectoriales en tiempo real."
    },
    {
      icon: Users,
      title: "Chatbot Financiero",
      description: "Asistente conversacional para consultas sobre análisis y recomendaciones personalizadas."
    }
  ];

  const stats = [
    { value: "70%", label: "Aumento en aprobaciones", description: "Incremento en créditos aprobados" },
    { value: "50%", label: "Reducción en impagos", description: "Menor riesgo de morosidad" },
    { value: "24/7", label: "Disponibilidad", description: "Análisis automático continuo" },
    { value: "95%", label: "Precisión", description: "Exactitud en evaluaciones" }
  ];

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 hero-gradient opacity-95"></div>
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Financial AI Technology" 
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <Badge className="mb-6 bg-white/20 text-white hover:bg-white/30 border-white/30">
                <Zap className="mr-2 h-4 w-4" />
                Tecnología IA para Finanzas
              </Badge>
              
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                Evalúa el riesgo financiero de
                <span className="text-brand-accent"> PYMEs con IA</span>
              </h1>
              
              <p className="text-xl lg:text-2xl mb-8 text-gray-200 leading-relaxed">
                Democratiza el acceso al crédito usando datos no tradicionales, 
                comportamiento digital y análisis inteligente para decisiones financieras objetivas.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <BrandButton asChild variant="accent" size="xl">
                  <Link to="/login">
                    Probar Ahora
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </BrandButton>
                
                <BrandButton asChild variant="outline" size="xl">
                  <Link to="#servicios">
                    Ver Demo
                  </Link>
                </BrandButton>
              </div>
            </div>
            
            <div className="lg:flex justify-center hidden">
              <div className="relative">
                <div className="w-96 h-96 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                  <BarChart3 className="h-32 w-32 text-brand-accent" />
                </div>
                <div className="absolute -top-4 -left-4 w-24 h-24 rounded-full bg-brand-accent/20 backdrop-blur-sm"></div>
                <div className="absolute -bottom-4 -right-4 w-32 h-32 rounded-full bg-white/10 backdrop-blur-sm"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-brand-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-lg font-semibold text-foreground mb-1">
                  {stat.label}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              ¿Qué hacemos?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Automatizamos la evaluación de riesgos financieros usando estados financieros, 
              comportamiento digital y referencias para facilitar créditos a PYMEs sin historial formal.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="shadow-brand hover:shadow-lg transition-smooth border-l-4 border-l-brand-primary">
              <CardHeader>
                <TrendingUp className="h-12 w-12 text-brand-primary mb-4" />
                <CardTitle>Análisis Inteligente</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Procesamos automáticamente documentos financieros y datos digitales 
                  para generar insights profundos sobre el riesgo crediticio.
                </p>
              </CardContent>
            </Card>
            
            <Card className="shadow-success hover:shadow-lg transition-smooth border-l-4 border-l-brand-accent">
              <CardHeader>
                <Users className="h-12 w-12 text-brand-accent mb-4" />
                <CardTitle>Inclusión Financiera</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Democratizamos el acceso al crédito para PYMEs que tradicionalmente 
                  quedan excluidas del sistema financiero formal.
                </p>
              </CardContent>
            </Card>
            
            <Card className="shadow-lg hover:shadow-xl transition-smooth border-l-4 border-l-brand-secondary">
              <CardHeader>
                <Shield className="h-12 w-12 text-brand-secondary mb-4" />
                <CardTitle>Decisiones Objetivas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Eliminamos sesgos humanos en la evaluación crediticia mediante 
                  algoritmos de IA transparentes y auditables.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="servicios" className="py-20 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Nuestros Servicios
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Soluciones completas de evaluación financiera potenciadas por inteligencia artificial
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <Card key={index} className="hover:shadow-brand transition-smooth group">
                  <CardHeader>
                    <IconComponent className="h-12 w-12 text-brand-primary group-hover:text-brand-accent transition-smooth mb-4" />
                    <CardTitle className="group-hover:text-brand-primary transition-smooth">
                      {service.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {service.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Casos de Éxito
            </h2>
            <p className="text-xl text-muted-foreground">
              Resultados comprobados en la industria financiera
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-brand-accent mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Aumento del 70% en aprobaciones de créditos
                    </h3>
                    <p className="text-muted-foreground">
                      Instituciones financieras han incrementado significativamente sus 
                      tasas de aprobación al incorporar datos no tradicionales en sus evaluaciones.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-brand-accent mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Reducción del 50% en impagos
                    </h3>
                    <p className="text-muted-foreground">
                      El análisis predictivo mejora la precisión en la evaluación de riesgos, 
                      reduciendo significativamente las tasas de morosidad.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-brand-accent mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Proceso de evaluación 10x más rápido
                    </h3>
                    <p className="text-muted-foreground">
                      La automatización reduce el tiempo de evaluación de semanas a minutos, 
                      mejorando la experiencia del cliente.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <Card className="p-8 shadow-success">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-6 w-6 text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote className="text-lg text-foreground mb-4 italic">
                  "PYME Credit AI transformó completamente nuestro proceso de evaluación crediticia. 
                  Ahora podemos atender a más PYMEs con mayor confianza y precisión."
                </blockquote>
                <cite className="text-brand-primary font-semibold">
                  - Director de Crédito, Banco Regional
                </cite>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 hero-gradient">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            ¿Listo para revolucionar tu evaluación crediticia?
          </h2>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Únete a las instituciones financieras que ya están transformando 
            el acceso al crédito con inteligencia artificial.
          </p>
          
          <BrandButton asChild variant="accent" size="xl">
            <Link to="/login">
              Comenzar Evaluación Gratuita
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </BrandButton>
        </div>
      </section>
    </main>
  );
};

export default Home;
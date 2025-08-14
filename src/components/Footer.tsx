import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Mail, Phone, MapPin, Linkedin, Twitter, Facebook } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gradient-to-r from-brandPrimary to-brandPrimary-dark text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo y descripción */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-lg bg-white/20">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold">PYME Credit AI</span>
                <p className="text-xs text-white/80">Evaluación de Riesgo Financiero</p>
              </div>
            </div>
            <p className="text-sm text-white/80 leading-relaxed">
              Automatizamos la evaluación de riesgo financiero de PYMEs usando datos no tradicionales 
              e inteligencia artificial para democratizar el acceso al crédito.
            </p>
          </div>
          
          {/* Enlaces principales */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Servicios</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/analysis" className="text-white/80 hover:text-white transition-smooth">
                  Análisis Financiero
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-white/80 hover:text-white transition-smooth">
                  Dashboard de Scoring
                </Link>
              </li>
              <li>
                <Link to="/chat" className="text-white/80 hover:text-white transition-smooth">
                  Chatbot Financiero
                </Link>
              </li>
              <li>
                <span className="text-white/80">Scraping de Redes Sociales</span>
              </li>
              <li>
                <span className="text-white/80">Validación de RUC</span>
              </li>
            </ul>
          </div>
          
          {/* Información de contacto */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contacto</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-brandAccent" />
                <span className="text-white/80">info@pymecreditai.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-brandAccent" />
                <span className="text-white/80">+593 2 123-4567</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-brandAccent" />
                <span className="text-white/80">Quito, Ecuador</span>
              </li>
            </ul>
          </div>
          
          {/* Redes sociales y enlaces legales */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Síguenos</h3>
            <div className="flex space-x-3">
              <a 
                href="#" 
                className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-smooth"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a 
                href="#" 
                className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-smooth"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a 
                href="#" 
                className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-smooth"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
            </div>
            
            <div className="space-y-2 text-sm">
              <Link to="#" className="block text-white/80 hover:text-white transition-smooth">
                Política de Privacidad
              </Link>
              <Link to="#" className="block text-white/80 hover:text-white transition-smooth">
                Términos de Uso
              </Link>
              <Link to="#" className="block text-white/80 hover:text-white transition-smooth">
                Seguridad de Datos
              </Link>
            </div>
          </div>
        </div>
        
        {/* Línea divisora y copyright */}
        <div className="border-t border-white/20 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-white/80">
              © {currentYear} PYME Credit AI. Todos los derechos reservados.
            </div>
            <div className="text-sm text-white/80">
              Desarrollado con ❤️ para el ecosistema financiero ecuatoriano
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
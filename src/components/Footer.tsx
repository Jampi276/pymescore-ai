import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, BarChart3 } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-brand-secondary text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo y descripción */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <BarChart3 className="h-8 w-8 text-brand-accent" />
              <span className="text-2xl font-bold">PYME Credit AI</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Democratizamos el acceso al crédito para PYMEs mediante inteligencia artificial, 
              evaluando riesgos con datos no tradicionales para decisiones financieras más inclusivas.
            </p>
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-brand-accent" />
                <span className="text-sm text-gray-300">info@pymecreditai.com</span>
              </div>
            </div>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-brand-accent transition-smooth">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/analysis" className="text-gray-300 hover:text-brand-accent transition-smooth">
                  Análisis
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-300 hover:text-brand-accent transition-smooth">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/chat" className="text-gray-300 hover:text-brand-accent transition-smooth">
                  Chat IA
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contacto</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-brand-accent" />
                <span className="text-gray-300">+593 2 234-5678</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-brand-accent" />
                <span className="text-gray-300">Quito, Ecuador</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-600 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 PYME Credit AI. Todos los derechos reservados. 
            Desarrollado con tecnología de inteligencia artificial para el sector financiero.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
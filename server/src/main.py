import os
import sys
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv

# Agregar el directorio src al path para imports
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Cargar variables de entorno
load_dotenv()

# Importar el blueprint de la API
from api import api_blueprint

def create_app():
    app = Flask(__name__)
    
    # Configurar CORS
    CORS(app, origins=["http://localhost:3000", "http://localhost:5173"])
    
    # Configurar la aplicación
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')
    app.config['UPLOAD_FOLDER'] = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data', 'uploads')
    app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size
    
    # Crear directorios necesarios
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    os.makedirs(os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data', 'chromadb'), exist_ok=True)
    os.makedirs(os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data', 'txt'), exist_ok=True)
    
    # Registrar blueprints
    app.register_blueprint(api_blueprint, url_prefix='/api')
    
    @app.route('/')
    def health_check():
        return {'status': 'Backend PYME Credit AI funcionando correctamente'}
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=5000, debug=True)
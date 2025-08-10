import os
import json
import uuid
import hashlib
from datetime import datetime
from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
from rag.pdfProcessor import extraerTextoDePDF
from rag.vectorStore import crearBaseDeConocimiento, cargarDocumentosEnBaseDeConocimiento
from rag.chat import crearSesionDeChat, enviarMensajeAlChat
from rag.utils import scrapingRedSocial, validarRUC, generarScoring

api_blueprint = Blueprint('api', __name__)

# Simular base de datos en memoria para usuarios
usuarios_db = {}
sesiones_db = {}

@api_blueprint.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        nombre = data.get('nombre')
        email = data.get('email')
        password = data.get('password')
        
        if not all([nombre, email, password]):
            return jsonify({'error': 'Todos los campos son requeridos'}), 400
        
        # Verificar si el usuario ya existe
        if email in usuarios_db:
            return jsonify({'resultado': 'Usuario ya existe'}), 400
        
        # Hash de la contraseña (simplificado para demo)
        password_hash = hashlib.sha256(password.encode()).hexdigest()
        
        # Crear usuario
        usuarios_db[email] = {
            'nombre': nombre,
            'email': email,
            'password': password_hash,
            'created_at': datetime.now().isoformat()
        }
        
        return jsonify({'resultado': 'Usuario registrado con éxito'}), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api_blueprint.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        if not all([email, password]):
            return jsonify({'error': 'Email y contraseña son requeridos'}), 400
        
        # Verificar credenciales
        if email not in usuarios_db:
            return jsonify({'exists': False, 'message': 'Credenciales inválidas'}), 401
        
        password_hash = hashlib.sha256(password.encode()).hexdigest()
        if usuarios_db[email]['password'] != password_hash:
            return jsonify({'exists': False, 'message': 'Credenciales inválidas'}), 401
        
        return jsonify({'exists': True, 'message': 'Inicio exitoso'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api_blueprint.route('/validate-ruc', methods=['POST'])
def validate_ruc():
    try:
        data = request.get_json()
        ruc = data.get('ruc')
        
        if not ruc:
            return jsonify({'error': 'RUC es requerido'}), 400
        
        # Validar RUC usando la función utils
        is_valid = validarRUC(ruc)
        
        if is_valid:
            return jsonify({'valid': True, 'message': 'RUC válido'}), 200
        else:
            return jsonify({'valid': False, 'message': 'RUC no válido'}), 400
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api_blueprint.route('/scrape-social', methods=['POST'])
def scrape_social():
    try:
        data = request.get_json()
        social_url = data.get('social_url')
        
        if not social_url:
            return jsonify({'error': 'URL de red social es requerida'}), 400
        
        # Realizar scraping usando la función utils
        social_data = scrapingRedSocial(social_url)
        
        return jsonify({
            'success': True,
            'data': social_data,
            'message': 'Scraping completado exitosamente'
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e), 'success': False}), 500

@api_blueprint.route('/analyze', methods=['POST'])
def analyze():
    try:
        # Verificar si hay archivo PDF
        if 'pdf' not in request.files:
            return jsonify({'error': 'Archivo PDF es requerido'}), 400
        
        pdf_file = request.files['pdf']
        if pdf_file.filename == '':
            return jsonify({'error': 'No se seleccionó archivo'}), 400
        
        # Guardar archivo PDF
        filename = secure_filename(pdf_file.filename)
        upload_path = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
        pdf_file.save(upload_path)
        
        # Extraer texto del PDF
        texto_pdf = extraerTextoDePDF(upload_path)
        
        # Obtener datos sociales si se proporcionaron
        datos_sociales = request.form.get('datos_sociales', '{}')
        try:
            datos_sociales = json.loads(datos_sociales)
        except:
            datos_sociales = {}
        
        # Crear base de conocimiento
        base_conocimiento = crearBaseDeConocimiento()
        
        # Cargar documentos en la base de conocimiento
        documentos = [
            {'contenido': texto_pdf, 'metadatos': {'tipo': 'estado_financiero', 'archivo': filename}},
        ]
        
        if datos_sociales:
            documentos.append({
                'contenido': json.dumps(datos_sociales),
                'metadatos': {'tipo': 'datos_sociales', 'url': datos_sociales.get('url', '')}
            })
        
        cargarDocumentosEnBaseDeConocimiento(base_conocimiento, documentos)
        
        # Generar scoring usando IA
        scoring_data = generarScoring(texto_pdf, datos_sociales)
        
        return jsonify({
            'secciones': {
                'financiera': scoring_data.get('analisis_financiero', []),
                'digital': scoring_data.get('analisis_digital', []),
                'referencias': scoring_data.get('analisis_referencias', [])
            },
            'riesgos': scoring_data.get('riesgos', []),
            'scoring': scoring_data.get('scoring', {'nivel': 'medio', 'umbral': 30000})
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api_blueprint.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        chat_input = data.get('chatInput', '')
        session_id = data.get('sessionId', str(uuid.uuid4()))
        
        if not chat_input:
            return jsonify({'error': 'Mensaje es requerido'}), 400
        
        # Crear o recuperar sesión de chat
        if session_id not in sesiones_db:
            sesiones_db[session_id] = crearSesionDeChat()
        
        sesion = sesiones_db[session_id]
        
        # Enviar mensaje al chat
        respuesta = enviarMensajeAlChat(sesion, chat_input)
        
        return jsonify({
            'salida': respuesta,
            'sessionId': session_id
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api_blueprint.route('/simulate', methods=['POST'])
def simulate():
    try:
        data = request.get_json()
        escenario_datos = data.get('escenario_datos', {})
        
        # Simular escenarios de mejora con IA
        from rag.config import obtenerLlm
        
        llm = obtenerLlm()
        
        prompt = f"""
        Basándose en los datos del escenario: {json.dumps(escenario_datos)}
        
        Genera una simulación de scoring mejorado considerando:
        1. Mejoras en ventas o ingresos
        2. Mejor presencia digital
        3. Referencias positivas adicionales
        
        Devuelve un JSON con:
        - scoring_mejorado: número del 0-100
        - nivel_riesgo: "bajo", "medio", "alto"
        - umbral_credito: monto recomendado
        - recomendaciones: lista de sugerencias
        """
        
        respuesta = llm.invoke(prompt)
        
        try:
            # Intentar parsear como JSON
            resultado = json.loads(respuesta.content)
        except:
            # Si no es JSON válido, crear respuesta estructurada
            resultado = {
                'scoring_mejorado': 75,
                'nivel_riesgo': 'medio',
                'umbral_credito': 45000,
                'recomendaciones': [
                    'Mejorar presencia en redes sociales',
                    'Diversificar fuentes de ingresos',
                    'Mantener registros financieros actualizados'
                ]
            }
        
        return jsonify(resultado), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
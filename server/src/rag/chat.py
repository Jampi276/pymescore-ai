import json
from typing import Dict, List, Any
from .config import obtenerLlm
from .vectorStore import obtenerBaseDeConocimiento, buscarEnBaseDeConocimiento

class SesionDeChat:
    """Clase para manejar sesiones de chat con contexto."""
    
    def __init__(self, nombre_coleccion: str = "pyme_financial_docs"):
        self.historial = []
        self.coleccion = obtenerBaseDeConocimiento(nombre_coleccion)
        self.llm = obtenerLlm()
        self.personalidad = """
        Eres un asistente financiero especializado en evaluación de riesgos de PYMEs (Pequeñas y Medianas Empresas).
        
        Tu rol es:
        - Analizar datos financieros y no tradicionales de empresas
        - Evaluar riesgos crediticios de forma objetiva
        - Proporcionar insights sobre capacidad de pago
        - Explicar scoring y factores de riesgo de manera clara
        - Responder de forma profesional pero amigable
        - Usar emojis ocasionales para hacer las respuestas más accesibles
        
        Siempre base tus respuestas en los datos proporcionados y mantén un enfoque analítico y objetivo.
        """
    
    def agregar_mensaje(self, rol: str, contenido: str):
        """Agrega un mensaje al historial."""
        self.historial.append({
            'rol': rol,
            'contenido': contenido,
            'timestamp': str(len(self.historial))
        })
    
    def obtener_contexto_relevante(self, consulta: str, n_resultados: int = 3) -> str:
        """Obtiene contexto relevante de la base de conocimiento."""
        try:
            documentos = buscarEnBaseDeConocimiento(self.coleccion, consulta, n_resultados)
            
            if not documentos:
                return "No hay documentos disponibles en la base de conocimiento."
            
            contexto = "Información relevante de los documentos:\n\n"
            
            for i, doc in enumerate(documentos, 1):
                relevancia = doc.get('relevancia', 0)
                if relevancia > 0.7:  # Solo incluir documentos muy relevantes
                    contexto += f"Documento {i} (Relevancia: {relevancia:.2f}):\n"
                    contexto += f"{doc['contenido']}\n\n"
            
            return contexto
            
        except Exception as e:
            print(f"Error al obtener contexto: {str(e)}")
            return "Error al acceder a la base de conocimiento."
    
    def generar_respuesta(self, consulta_usuario: str) -> str:
        """Genera una respuesta usando LLM con contexto RAG."""
        try:
            # Obtener contexto relevante
            contexto = self.obtener_contexto_relevante(consulta_usuario)
            
            # Crear prompt con contexto y personalidad
            prompt = f"""
            {self.personalidad}
            
            Contexto de documentos financieros:
            {contexto}
            
            Historial de conversación reciente:
            {self._obtener_historial_reciente()}
            
            Consulta del usuario: {consulta_usuario}
            
            Instrucciones específicas:
            1. Responde basándote principalmente en el contexto proporcionado
            2. Si no tienes información suficiente, indícalo claramente
            3. Para análisis financieros, menciona específicamente qué datos usas
            4. Incluye recomendaciones prácticas cuando sea apropiado
            5. Mantén un tono profesional pero accesible
            6. Usa formato Markdown para mejorar la legibilidad
            
            Respuesta:
            """
            
            # Generar respuesta con LLM
            respuesta = self.llm.invoke(prompt)
            
            # Agregar intercambio al historial
            self.agregar_mensaje('usuario', consulta_usuario)
            self.agregar_mensaje('asistente', respuesta.content)
            
            return respuesta.content
            
        except Exception as e:
            error_msg = f"Error al generar respuesta: {str(e)}"
            print(error_msg)
            return "Lo siento, ocurrió un error al procesar tu consulta. Por favor, intenta nuevamente."
    
    def _obtener_historial_reciente(self, ultimos_n: int = 4) -> str:
        """Obtiene el historial reciente de la conversación."""
        if not self.historial:
            return "No hay historial previo."
        
        historial_reciente = self.historial[-ultimos_n:]
        historial_texto = ""
        
        for mensaje in historial_reciente:
            rol = "Usuario" if mensaje['rol'] == 'usuario' else "Asistente"
            historial_texto += f"{rol}: {mensaje['contenido']}\n\n"
        
        return historial_texto

def crearSesionDeChat(nombre_coleccion: str = "pyme_financial_docs") -> SesionDeChat:
    """
    Crea una nueva sesión de chat.
    
    Args:
        nombre_coleccion (str): Nombre de la colección de ChromaDB a usar
        
    Returns:
        SesionDeChat: Nueva instancia de sesión de chat
    """
    try:
        sesion = SesionDeChat(nombre_coleccion)
        print("Sesión de chat creada exitosamente")
        return sesion
        
    except Exception as e:
        print(f"Error al crear sesión de chat: {str(e)}")
        raise e

def enviarMensajeAlChat(sesion: SesionDeChat, mensaje: str) -> str:
    """
    Envía un mensaje a la sesión de chat y obtiene respuesta.
    
    Args:
        sesion (SesionDeChat): Sesión de chat activa
        mensaje (str): Mensaje del usuario
        
    Returns:
        str: Respuesta del asistente
    """
    try:
        if not mensaje.strip():
            return "Por favor, envía un mensaje válido."
        
        respuesta = sesion.generar_respuesta(mensaje)
        return respuesta
        
    except Exception as e:
        error_msg = f"Error al enviar mensaje: {str(e)}"
        print(error_msg)
        return "Error al procesar el mensaje. Por favor, intenta nuevamente."

def obtenerHistorialChat(sesion: SesionDeChat) -> List[Dict[str, Any]]:
    """
    Obtiene el historial completo de la sesión de chat.
    
    Args:
        sesion (SesionDeChat): Sesión de chat
        
    Returns:
        List[Dict]: Historial de mensajes
    """
    return sesion.historial.copy()

def limpiarHistorialChat(sesion: SesionDeChat) -> bool:
    """
    Limpia el historial de una sesión de chat.
    
    Args:
        sesion (SesionDeChat): Sesión de chat
        
    Returns:
        bool: True si se limpió exitosamente
    """
    try:
        sesion.historial.clear()
        print("Historial de chat limpiado")
        return True
        
    except Exception as e:
        print(f"Error al limpiar historial: {str(e)}")
        return False
import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain.llms.base import LLM

# Cargar variables de entorno
load_dotenv()

# Configuración de OpenAI
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')

if not OPENAI_API_KEY:
    raise ValueError("OPENAI_API_KEY no está configurada en las variables de entorno")

# Configuración del modelo
DEFAULT_MODEL = "gpt-4o-mini"
DEFAULT_TEMPERATURE = 0.3
DEFAULT_MAX_TOKENS = 2000

# Configuración de embeddings
EMBEDDING_MODEL = "text-embedding-3-small"
EMBEDDING_DIMENSIONS = 1536

def obtenerLlm(
    modelo: str = DEFAULT_MODEL,
    temperatura: float = DEFAULT_TEMPERATURE,
    max_tokens: int = DEFAULT_MAX_TOKENS
) -> ChatOpenAI:
    """
    Crea y configura una instancia del modelo de lenguaje OpenAI.
    
    Args:
        modelo (str): Nombre del modelo a usar
        temperatura (float): Temperatura para la generación (0.0-2.0)
        max_tokens (int): Número máximo de tokens a generar
        
    Returns:
        ChatOpenAI: Instancia configurada del modelo
    """
    try:
        llm = ChatOpenAI(
            model=modelo,
            temperature=temperatura,
            max_tokens=max_tokens,
            openai_api_key=OPENAI_API_KEY,
            streaming=False
        )
        
        print(f"LLM configurado: {modelo} (temp: {temperatura}, max_tokens: {max_tokens})")
        return llm
        
    except Exception as e:
        print(f"Error al configurar LLM: {str(e)}")
        raise e

def obtenerLlmEmbedding(modelo: str = EMBEDDING_MODEL) -> OpenAIEmbeddings:
    """
    Crea y configura una instancia para generar embeddings.
    
    Args:
        modelo (str): Modelo de embeddings a usar
        
    Returns:
        OpenAIEmbeddings: Instancia configurada para embeddings
    """
    try:
        embeddings = OpenAIEmbeddings(
            model=modelo,
            openai_api_key=OPENAI_API_KEY,
            dimensions=EMBEDDING_DIMENSIONS
        )
        
        print(f"Embeddings configurados: {modelo}")
        return embeddings
        
    except Exception as e:
        print(f"Error al configurar embeddings: {str(e)}")
        raise e

def validarConfiguracion() -> bool:
    """
    Valida que la configuración de OpenAI sea correcta.
    
    Returns:
        bool: True si la configuración es válida
    """
    try:
        # Probar conexión con un prompt simple
        llm = obtenerLlm()
        respuesta = llm.invoke("Di 'configuración correcta'")
        
        if respuesta and respuesta.content:
            print("✅ Configuración de OpenAI validada correctamente")
            return True
        else:
            print("❌ Error en la respuesta de OpenAI")
            return False
            
    except Exception as e:
        print(f"❌ Error al validar configuración: {str(e)}")
        return False

def obtenerModelosDisponibles() -> dict:
    """
    Retorna información sobre los modelos disponibles.
    
    Returns:
        dict: Información de modelos configurados
    """
    return {
        'llm': {
            'modelo_por_defecto': DEFAULT_MODEL,
            'temperatura_por_defecto': DEFAULT_TEMPERATURE,
            'max_tokens_por_defecto': DEFAULT_MAX_TOKENS,
            'modelos_soportados': [
                'gpt-4o-mini',
                'gpt-4o',
                'gpt-3.5-turbo'
            ]
        },
        'embeddings': {
            'modelo_por_defecto': EMBEDDING_MODEL,
            'dimensiones': EMBEDDING_DIMENSIONS,
            'modelos_soportados': [
                'text-embedding-3-small',
                'text-embedding-3-large',
                'text-embedding-ada-002'
            ]
        }
    }

# Configuración de logging
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)

def configurarLogging(nivel: str = 'INFO'):
    """
    Configura el nivel de logging.
    
    Args:
        nivel (str): Nivel de logging (DEBUG, INFO, WARNING, ERROR)
    """
    numeric_level = getattr(logging, nivel.upper(), None)
    if not isinstance(numeric_level, int):
        raise ValueError(f'Nivel de logging inválido: {nivel}')
    
    logger.setLevel(numeric_level)
    print(f"Logging configurado en nivel: {nivel}")
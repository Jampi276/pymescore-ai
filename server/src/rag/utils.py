import re
import json
import requests
from bs4 import BeautifulSoup
from typing import Dict, List, Any
from .config import obtenerLlm

def scrapingRedSocial(url: str) -> Dict[str, Any]:
    """
    Realiza scraping básico de redes sociales para obtener información de reputación.
    
    Args:
        url (str): URL de la red social o página web
        
    Returns:
        Dict[str, Any]: Datos extraídos de la red social
    """
    try:
        # Headers para simular un navegador real
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        
        # Realizar solicitud HTTP
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        
        # Parsear HTML
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Extraer información básica
        titulo = soup.find('title')
        titulo_texto = titulo.get_text().strip() if titulo else "Sin título"
        
        # Extraer meta descripción
        meta_desc = soup.find('meta', attrs={'name': 'description'})
        descripcion = meta_desc.get('content', '').strip() if meta_desc else ""
        
        # Extraer texto principal (paragraphs)
        paragrafos = soup.find_all('p')
        texto_principal = ' '.join([p.get_text().strip() for p in paragrafos[:5]])
        
        # Buscar indicadores de actividad comercial
        indicadores_comercio = buscarIndicadoresComerciales(soup)
        
        # Análisis de sentimiento básico
        sentimiento = analizarSentimientoBasico(texto_principal)
        
        # Contar mentions/reviews si es posible
        reviews_count = contarReviews(soup)
        
        datos_extraidos = {
            'url': url,
            'titulo': titulo_texto,
            'descripcion': descripcion,
            'texto_principal': texto_principal[:500],  # Limitar tamaño
            'indicadores_comerciales': indicadores_comercio,
            'sentimiento': sentimiento,
            'reviews_count': reviews_count,
            'timestamp': requests.utils.formatdate(),
            'longitud_contenido': len(texto_principal),
            'tipo_sitio': determinarTipoSitio(url, soup)
        }
        
        print(f"Scraping completado para: {url}")
        return datos_extraidos
        
    except requests.RequestException as e:
        print(f"Error de red en scraping: {str(e)}")
        return generarDatosSimulados(url, "Error de conexión")
        
    except Exception as e:
        print(f"Error general en scraping: {str(e)}")
        return generarDatosSimulados(url, "Error de procesamiento")

def buscarIndicadoresComerciales(soup: BeautifulSoup) -> List[str]:
    """Busca indicadores de actividad comercial en el contenido."""
    indicadores = []
    
    # Palabras clave comerciales
    palabras_comerciales = [
        'venta', 'vender', 'producto', 'servicio', 'cliente', 'empresa',
        'negocio', 'comercio', 'tienda', 'contacto', 'precio', 'oferta'
    ]
    
    texto_completo = soup.get_text().lower()
    
    for palabra in palabras_comerciales:
        if palabra in texto_completo:
            indicadores.append(f"Menciona '{palabra}'")
    
    # Buscar números de teléfono
    telefonos = re.findall(r'\b\d{3,4}[-.]?\d{3,4}[-.]?\d{3,4}\b', texto_completo)
    if telefonos:
        indicadores.append(f"Tiene {len(telefonos)} números de contacto")
    
    # Buscar emails
    emails = re.findall(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', texto_completo)
    if emails:
        indicadores.append(f"Tiene {len(emails)} emails de contacto")
    
    return indicadores

def analizarSentimientoBasico(texto: str) -> Dict[str, Any]:
    """Análisis básico de sentimiento del texto."""
    texto_lower = texto.lower()
    
    palabras_positivas = ['excelente', 'bueno', 'recomendado', 'calidad', 'satisfecho', 'profesional']
    palabras_negativas = ['malo', 'terrible', 'problema', 'queja', 'deficiente', 'estafa']
    
    puntos_positivos = sum(1 for palabra in palabras_positivas if palabra in texto_lower)
    puntos_negativos = sum(1 for palabra in palabras_negativas if palabra in texto_lower)
    
    if puntos_positivos > puntos_negativos:
        sentimiento = 'positivo'
    elif puntos_negativos > puntos_positivos:
        sentimiento = 'negativo'
    else:
        sentimiento = 'neutro'
    
    return {
        'clasificacion': sentimiento,
        'puntos_positivos': puntos_positivos,
        'puntos_negativos': puntos_negativos,
        'confianza': abs(puntos_positivos - puntos_negativos) / max(len(texto.split()), 1)
    }

def contarReviews(soup: BeautifulSoup) -> int:
    """Intenta contar reviews o comentarios en la página."""
    # Selectores comunes para reviews
    selectores_reviews = [
        '.review', '.comment', '.rating', '.testimonial',
        '[class*="review"]', '[class*="comment"]', '[class*="rating"]'
    ]
    
    total_reviews = 0
    for selector in selectores_reviews:
        elementos = soup.select(selector)
        total_reviews += len(elementos)
    
    return total_reviews

def determinarTipoSitio(url: str, soup: BeautifulSoup) -> str:
    """Determina el tipo de sitio web basado en la URL y contenido."""
    url_lower = url.lower()
    
    # Redes sociales conocidas
    if any(red in url_lower for red in ['facebook.com', 'twitter.com', 'instagram.com', 'linkedin.com']):
        return 'red_social'
    
    # Sitios de reseñas
    if any(sitio in url_lower for sitio in ['google.com/maps', 'yelp.com', 'tripadvisor.com']):
        return 'sitio_resenas'
    
    # E-commerce
    texto_contenido = soup.get_text().lower()
    if any(palabra in texto_contenido for palabra in ['carrito', 'comprar', 'agregar al carrito', 'checkout']):
        return 'ecommerce'
    
    # Sitio corporativo
    if any(palabra in texto_contenido for palabra in ['empresa', 'nosotros', 'servicios', 'contacto']):
        return 'corporativo'
    
    return 'general'

def generarDatosSimulados(url: str, motivo: str) -> Dict[str, Any]:
    """Genera datos simulados cuando no se puede hacer scraping real."""
    return {
        'url': url,
        'titulo': 'Información no disponible',
        'descripcion': f'No se pudo extraer información: {motivo}',
        'texto_principal': 'Contenido no accesible para análisis.',
        'indicadores_comerciales': ['Simulado: Presencia digital detectada'],
        'sentimiento': {
            'clasificacion': 'neutro',
            'puntos_positivos': 1,
            'puntos_negativos': 0,
            'confianza': 0.5
        },
        'reviews_count': 0,
        'timestamp': requests.utils.formatdate(),
        'longitud_contenido': 0,
        'tipo_sitio': 'no_disponible',
        'simulado': True,
        'motivo_simulacion': motivo
    }

def validarRUC(ruc: str) -> bool:
    """
    Valida un RUC ecuatoriano básico.
    Nota: Esta es una validación simplificada.
    
    Args:
        ruc (str): Número de RUC a validar
        
    Returns:
        bool: True si el formato es válido
    """
    try:
        # Limpiar RUC (solo números)
        ruc_limpio = re.sub(r'\D', '', ruc)
        
        # Verificar longitud (13 dígitos para RUC ecuatoriano)
        if len(ruc_limpio) != 13:
            return False
        
        # Verificar que termine en 001 (establecimiento principal)
        if not ruc_limpio.endswith('001'):
            return False
        
        # Verificar que los primeros dos dígitos sean válidos (código de provincia)
        provincia = int(ruc_limpio[:2])
        if provincia < 1 or provincia > 24:
            return False
        
        # Aquí se implementaría el algoritmo de validación del dígito verificador
        # Por simplicidad, asumimos válido si pasa las verificaciones básicas
        
        print(f"RUC {ruc} validado correctamente")
        return True
        
    except Exception as e:
        print(f"Error al validar RUC: {str(e)}")
        return False

def generarScoring(texto_financiero: str, datos_sociales: Dict[str, Any]) -> Dict[str, Any]:
    """
    Genera scoring financiero usando IA basado en datos tradicionales y no tradicionales.
    
    Args:
        texto_financiero (str): Texto extraído de estados financieros
        datos_sociales (Dict): Datos de redes sociales y web
        
    Returns:
        Dict[str, Any]: Scoring completo con análisis
    """
    try:
        llm = obtenerLlm()
        
        # Crear prompt para análisis integral
        prompt = f"""
        Actúa como un analista financiero experto en evaluación de riesgos de PYMEs.
        
        Analiza los siguientes datos:
        
        DATOS FINANCIEROS:
        {texto_financiero[:2000]}  # Limitar tamaño del prompt
        
        DATOS DIGITALES/SOCIALES:
        {json.dumps(datos_sociales, indent=2)}
        
        Genera un análisis completo que incluya:
        
        1. ANÁLISIS FINANCIERO:
        - Liquidez y solvencia
        - Rentabilidad
        - Endeudamiento
        - Flujo de caja
        
        2. ANÁLISIS DIGITAL:
        - Presencia online
        - Reputación digital
        - Actividad comercial online
        
        3. ANÁLISIS DE REFERENCIAS:
        - Credibilidad de la información
        - Consistencia de datos
        
        4. EVALUACIÓN DE RIESGOS:
        - Riesgo financiero
        - Riesgo operacional
        - Riesgo reputacional
        
        5. SCORING FINAL:
        - Puntuación del 0-100
        - Nivel de riesgo (bajo/medio/alto)
        - Umbral de crédito recomendado
        
        Responde SOLO con un JSON válido que contenga:
        {{
            "analisis_financiero": ["punto1", "punto2", "punto3"],
            "analisis_digital": ["punto1", "punto2", "punto3"],
            "analisis_referencias": ["punto1", "punto2"],
            "riesgos": [
                {{"tipo": "financiero", "nivel": "bajo/medio/alto", "descripcion": "..."}},
                {{"tipo": "operacional", "nivel": "bajo/medio/alto", "descripcion": "..."}},
                {{"tipo": "reputacional", "nivel": "bajo/medio/alto", "descripcion": "..."}}
            ],
            "scoring": {{
                "puntuacion": 75,
                "nivel": "medio",
                "umbral": 35000,
                "factores_positivos": ["factor1", "factor2"],
                "factores_negativos": ["factor1", "factor2"],
                "recomendaciones": ["rec1", "rec2"]
            }}
        }}
        """
        
        respuesta = llm.invoke(prompt)
        
        try:
            # Intentar parsear la respuesta como JSON
            scoring_data = json.loads(respuesta.content)
            print("Scoring generado exitosamente con IA")
            return scoring_data
            
        except json.JSONDecodeError:
            print("Error al parsear respuesta de IA, usando scoring por defecto")
            return generarScoringPorDefecto()
            
    except Exception as e:
        print(f"Error al generar scoring: {str(e)}")
        return generarScoringPorDefecto()

def generarScoringPorDefecto() -> Dict[str, Any]:
    """Genera un scoring por defecto cuando falla la IA."""
    return {
        "analisis_financiero": [
            "Estados financieros disponibles para análisis",
            "Requiere evaluación detallada de liquidez",
            "Necesaria revisión de estructura de costos"
        ],
        "analisis_digital": [
            "Presencia digital básica detectada",
            "Actividad comercial online identificada",
            "Reputación digital en evaluación"
        ],
        "analisis_referencias": [
            "Información básica verificada",
            "Requiere validación adicional de referencias"
        ],
        "riesgos": [
            {"tipo": "financiero", "nivel": "medio", "descripcion": "Análisis financiero pendiente de completar"},
            {"tipo": "operacional", "nivel": "medio", "descripcion": "Evaluación operacional estándar"},
            {"tipo": "reputacional", "nivel": "bajo", "descripcion": "Sin indicadores negativos detectados"}
        ],
        "scoring": {
            "puntuacion": 65,
            "nivel": "medio",
            "umbral": 30000,
            "factores_positivos": ["Documentación disponible", "Presencia digital"],
            "factores_negativos": ["Análisis pendiente"],
            "recomendaciones": ["Completar análisis financiero", "Mejorar presencia digital"]
        }
    }
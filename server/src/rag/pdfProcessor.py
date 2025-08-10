import fitz  # PyMuPDF
import os
from typing import List, Dict

def extraerTextoDePDF(ruta_pdf: str) -> str:
    """
    Extrae todo el texto de un archivo PDF.
    
    Args:
        ruta_pdf (str): Ruta al archivo PDF
        
    Returns:
        str: Texto extraído del PDF
    """
    try:
        # Abrir el documento PDF
        doc = fitz.open(ruta_pdf)
        texto_completo = ""
        
        # Iterar por todas las páginas
        for num_pagina in range(doc.page_count):
            pagina = doc[num_pagina]
            texto_pagina = pagina.get_text()
            texto_completo += f"\n--- Página {num_pagina + 1} ---\n"
            texto_completo += texto_pagina
        
        doc.close()
        
        # Limpiar el texto
        texto_limpio = limpiarTexto(texto_completo)
        
        return texto_limpio
        
    except Exception as e:
        print(f"Error al extraer texto del PDF: {str(e)}")
        return ""

def extraerTextosDePdfConOCR(ruta_pdf: str) -> str:
    """
    Extrae texto de PDF usando OCR para documentos escaneados.
    Nota: Implementación básica, se puede mejorar con Tesseract OCR.
    
    Args:
        ruta_pdf (str): Ruta al archivo PDF
        
    Returns:
        str: Texto extraído con OCR
    """
    try:
        # Por ahora, usar el método básico
        # En una implementación completa, se usaría Tesseract OCR
        return extraerTextoDePDF(ruta_pdf)
        
    except Exception as e:
        print(f"Error en OCR del PDF: {str(e)}")
        return ""

def limpiarTexto(texto: str) -> str:
    """
    Limpia y normaliza el texto extraído.
    
    Args:
        texto (str): Texto sin procesar
        
    Returns:
        str: Texto limpio y normalizado
    """
    if not texto:
        return ""
    
    # Eliminar caracteres de control y espacios excesivos
    texto = texto.replace('\x00', '')
    texto = ' '.join(texto.split())
    
    # Eliminar líneas vacías múltiples
    lineas = texto.split('\n')
    lineas_limpias = []
    
    for linea in lineas:
        linea = linea.strip()
        if linea or (lineas_limpias and lineas_limpias[-1]):
            lineas_limpias.append(linea)
    
    return '\n'.join(lineas_limpias)

def dividirTextoEnChunks(texto: str, tamaño_chunk: int = 1000, solapamiento: int = 200) -> List[str]:
    """
    Divide el texto en chunks más pequeños para procesamiento.
    
    Args:
        texto (str): Texto a dividir
        tamaño_chunk (int): Tamaño máximo de cada chunk
        solapamiento (int): Número de caracteres de solapamiento entre chunks
        
    Returns:
        List[str]: Lista de chunks de texto
    """
    if not texto:
        return []
    
    chunks = []
    inicio = 0
    
    while inicio < len(texto):
        fin = inicio + tamaño_chunk
        
        # Si no es el último chunk, buscar un punto de corte natural
        if fin < len(texto):
            # Buscar el último espacio o salto de línea en los últimos 100 caracteres
            punto_corte = texto.rfind(' ', fin - 100, fin)
            if punto_corte > inicio:
                fin = punto_corte
        
        chunk = texto[inicio:fin].strip()
        if chunk:
            chunks.append(chunk)
        
        # Mover el inicio considerando el solapamiento
        inicio = fin - solapamiento if fin - solapamiento > inicio else fin
    
    return chunks

def extraerMetadatosPDF(ruta_pdf: str) -> Dict[str, str]:
    """
    Extrae metadatos del archivo PDF.
    
    Args:
        ruta_pdf (str): Ruta al archivo PDF
        
    Returns:
        Dict[str, str]: Diccionario con metadatos del PDF
    """
    try:
        doc = fitz.open(ruta_pdf)
        metadatos = doc.metadata
        doc.close()
        
        return {
            'titulo': metadatos.get('title', ''),
            'autor': metadatos.get('author', ''),
            'asunto': metadatos.get('subject', ''),
            'creador': metadatos.get('creator', ''),
            'productor': metadatos.get('producer', ''),
            'fecha_creacion': metadatos.get('creationDate', ''),
            'fecha_modificacion': metadatos.get('modDate', ''),
            'nombre_archivo': os.path.basename(ruta_pdf)
        }
        
    except Exception as e:
        print(f"Error al extraer metadatos del PDF: {str(e)}")
        return {'nombre_archivo': os.path.basename(ruta_pdf)}
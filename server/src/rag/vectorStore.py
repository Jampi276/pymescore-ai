import os
import chromadb
from chromadb.config import Settings
from typing import List, Dict, Any
from .config import obtenerLlmEmbedding
from .pdfProcessor import dividirTextoEnChunks

# Configuración de ChromaDB
CHROMA_DB_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'data', 'chromadb')

def crearBaseDeConocimiento(nombre_coleccion: str = "pyme_financial_docs") -> chromadb.Collection:
    """
    Crea o recupera una base de conocimiento usando ChromaDB.
    
    Args:
        nombre_coleccion (str): Nombre de la colección en ChromaDB
        
    Returns:
        chromadb.Collection: Instancia de la colección de ChromaDB
    """
    try:
        # Crear cliente de ChromaDB
        client = chromadb.PersistentClient(
            path=CHROMA_DB_PATH,
            settings=Settings(
                anonymized_telemetry=False,
                allow_reset=True
            )
        )
        
        # Crear o recuperar colección
        try:
            coleccion = client.get_collection(name=nombre_coleccion)
            print(f"Colección '{nombre_coleccion}' recuperada exitosamente")
        except:
            coleccion = client.create_collection(
                name=nombre_coleccion,
                metadata={"description": "Documentos financieros de PYMEs para análisis de riesgo"}
            )
            print(f"Colección '{nombre_coleccion}' creada exitosamente")
        
        return coleccion
        
    except Exception as e:
        print(f"Error al crear base de conocimiento: {str(e)}")
        raise e

def cargarDocumentosEnBaseDeConocimiento(coleccion: chromadb.Collection, documentos: List[Dict[str, Any]]) -> bool:
    """
    Carga documentos en la base de conocimiento vectorial.
    
    Args:
        coleccion (chromadb.Collection): Colección de ChromaDB
        documentos (List[Dict]): Lista de documentos con 'contenido' y 'metadatos'
        
    Returns:
        bool: True si la carga fue exitosa
    """
    try:
        # Obtener función de embedding
        embedding_function = obtenerLlmEmbedding()
        
        textos_para_vectorizar = []
        metadatos_documentos = []
        ids_documentos = []
        
        for i, doc in enumerate(documentos):
            contenido = doc.get('contenido', '')
            metadatos = doc.get('metadatos', {})
            
            if not contenido:
                continue
            
            # Dividir texto en chunks
            chunks = dividirTextoEnChunks(contenido)
            
            for j, chunk in enumerate(chunks):
                chunk_id = f"doc_{i}_chunk_{j}"
                
                textos_para_vectorizar.append(chunk)
                metadatos_documentos.append({
                    **metadatos,
                    'chunk_index': j,
                    'total_chunks': len(chunks),
                    'documento_id': i,
                    'texto_length': len(chunk)
                })
                ids_documentos.append(chunk_id)
        
        if not textos_para_vectorizar:
            print("No hay contenido para vectorizar")
            return False
        
        # Generar embeddings
        print(f"Generando embeddings para {len(textos_para_vectorizar)} chunks...")
        embeddings = []
        
        for texto in textos_para_vectorizar:
            try:
                embedding = embedding_function.embed_query(texto)
                embeddings.append(embedding)
            except Exception as e:
                print(f"Error al generar embedding: {str(e)}")
                # Usar embedding vacío como fallback
                embeddings.append([0.0] * 1536)  # Tamaño típico de OpenAI embeddings
        
        # Cargar en ChromaDB
        coleccion.add(
            documents=textos_para_vectorizar,
            metadatas=metadatos_documentos,
            ids=ids_documentos,
            embeddings=embeddings
        )
        
        print(f"Cargados {len(textos_para_vectorizar)} chunks en la base de conocimiento")
        return True
        
    except Exception as e:
        print(f"Error al cargar documentos: {str(e)}")
        return False

def obtenerBaseDeConocimiento(nombre_coleccion: str = "pyme_financial_docs") -> chromadb.Collection:
    """
    Recupera una base de conocimiento existente.
    
    Args:
        nombre_coleccion (str): Nombre de la colección
        
    Returns:
        chromadb.Collection: Instancia de la colección
    """
    try:
        client = chromadb.PersistentClient(
            path=CHROMA_DB_PATH,
            settings=Settings(
                anonymized_telemetry=False,
                allow_reset=True
            )
        )
        
        coleccion = client.get_collection(name=nombre_coleccion)
        return coleccion
        
    except Exception as e:
        print(f"Error al obtener base de conocimiento: {str(e)}")
        # Si no existe, crear una nueva
        return crearBaseDeConocimiento(nombre_coleccion)

def buscarEnBaseDeConocimiento(coleccion: chromadb.Collection, consulta: str, n_resultados: int = 5) -> List[Dict[str, Any]]:
    """
    Busca documentos relevantes en la base de conocimiento.
    
    Args:
        coleccion (chromadb.Collection): Colección de ChromaDB
        consulta (str): Consulta de búsqueda
        n_resultados (int): Número máximo de resultados
        
    Returns:
        List[Dict]: Lista de documentos relevantes con scores
    """
    try:
        # Generar embedding para la consulta
        embedding_function = obtenerLlmEmbedding()
        query_embedding = embedding_function.embed_query(consulta)
        
        # Buscar documentos similares
        resultados = coleccion.query(
            query_embeddings=[query_embedding],
            n_results=n_resultados,
            include=['documents', 'metadatas', 'distances']
        )
        
        documentos_relevantes = []
        
        for i in range(len(resultados['documents'][0])):
            documento = {
                'contenido': resultados['documents'][0][i],
                'metadatos': resultados['metadatas'][0][i],
                'distancia': resultados['distances'][0][i],
                'relevancia': 1 - resultados['distances'][0][i]  # Convertir distancia a score de relevancia
            }
            documentos_relevantes.append(documento)
        
        # Ordenar por relevancia
        documentos_relevantes.sort(key=lambda x: x['relevancia'], reverse=True)
        
        return documentos_relevantes
        
    except Exception as e:
        print(f"Error en búsqueda: {str(e)}")
        return []

def limpiarBaseDeConocimiento(nombre_coleccion: str = "pyme_financial_docs") -> bool:
    """
    Limpia todos los documentos de una colección.
    
    Args:
        nombre_coleccion (str): Nombre de la colección a limpiar
        
    Returns:
        bool: True si la limpieza fue exitosa
    """
    try:
        client = chromadb.PersistentClient(
            path=CHROMA_DB_PATH,
            settings=Settings(
                anonymized_telemetry=False,
                allow_reset=True
            )
        )
        
        # Eliminar colección existente
        try:
            client.delete_collection(name=nombre_coleccion)
            print(f"Colección '{nombre_coleccion}' eliminada")
        except:
            print(f"Colección '{nombre_coleccion}' no existía")
        
        return True
        
    except Exception as e:
        print(f"Error al limpiar base de conocimiento: {str(e)}")
        return False
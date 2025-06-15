# from langchain_core.embeddings import Embeddings
# from sentence_transformers import SentenceTransformer
# from typing import List
# from loguru import logger
# import os
# from src.services.gcp_storage_service import GCPStorageService

# class CustomHuggingFaceEmbeddings(Embeddings):
#     def __init__(self, model_path: str):
#         logger.info(f"Loading model from {model_path}")
#         self.model = SentenceTransformer(model_path)
#         self.model.to('cpu')

#     @classmethod
#     def from_local_path(cls, model_path: str):
#         return cls(model_path)
    
#     @classmethod
#     def from_gcp(cls,
#                  gcp_storage_service: GCPStorageService,
#                  bucket_name: str = "legira-bucket",
#                  source_blob_name: str = "model",
#                  ):
#         temp_folder = gcp_storage_service.download_from_gcs_to_temporary_folder(bucket_name, source_blob_name)
#         return cls(temp_folder)

#     def embed_documents(self, texts: List[str]) -> List[List[float]]:
#         """Embed a list of documents using batch processing."""
#         try:
#             # Generate embeddings using batch processing
#             embeddings = self.model.encode(
#                 texts,
#                 batch_size=32,
#                 show_progress_bar=True,
#                 convert_to_numpy=True,
#                 normalize_embeddings=True
#             )
#             return embeddings.tolist()
#         except Exception as e:
#             logger.error(f"Error generating embeddings: {str(e)}")
#             raise

#     def embed_query(self, text: str) -> List[float]:
#         """Embed a single query text using the model."""
#         logger.critical(f"Embedding query: {text}")
#         try:
#             # Use the same batch processing for consistency
#             embedding = self.model.encode(
#                 [text],
#                 batch_size=1,
#                 show_progress_bar=False,
#                 convert_to_numpy=True,
#                 normalize_embeddings=True
#             )
#             return embedding[0].tolist()
#         except Exception as e:
#             logger.error(f"Error generating query embedding: {str(e)}")
#             raise

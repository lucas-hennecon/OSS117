from typing import List
from pydantic import BaseModel, Field


class SearchQueryList(BaseModel):
    query: List[str] = Field(
        description="Une liste de requêtes de recherche à utiliser pour la recherche web."
    )
    rationale: str = Field(
        description="Une brève explication de la pertinence de ces requêtes par rapport au sujet de recherche."
    )


class Reflection(BaseModel):
    is_sufficient: bool = Field(
        description="Indique si les résumés fournis sont suffisants pour répondre à la question de l'utilisateur."
    )
    knowledge_gap: str = Field(
        description="Une description des informations manquantes ou nécessitant des éclaircissements."
    )
    follow_up_queries: List[str] = Field(
        description="Une liste de requêtes complémentaires pour combler les lacunes dans les connaissances."
    )


class ResearchNeeded(BaseModel):
    is_research_needed: bool = Field(
        description="Indique si une recherche est nécessaire pour répondre à la question de l'utilisateur."
    )
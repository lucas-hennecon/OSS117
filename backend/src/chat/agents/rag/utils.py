from typing import List
from langchain_core.messages import AnyMessage, AIMessage, HumanMessage


def get_research_topic(messages: List[AnyMessage]) -> str:
    """
    Get the research topic from the messages.
    """
    # check if request has a history and combine the messages into a single string
    if len(messages) == 1:
        research_topic = messages[-1].content
    else:
        research_topic = ""
        for message in messages:
            if isinstance(message, HumanMessage):
                research_topic += f"User: {message.content}\n"
            elif isinstance(message, AIMessage):
                research_topic += f"Assistant: {message.content}\n"
    return research_topic

def remove_duplicated_sources(sources: List[dict], text_field: str = "snippet") -> List[dict]:
    """
    Remove duplicates from the sources.
    """
    # manage articles
    seen_content = set()
    unique_sources = []
    for source in sources:  
        if source[text_field] not in seen_content:
            seen_content.add(source[text_field])
            unique_sources.append(source)
    return unique_sources

def transform_sources_to_txt(sources: List[dict], text_field: str = "snippet", id_field: str = "link") -> str:
    """
    Transform the sources to a text format.
    """
    sources = remove_duplicated_sources(sources)
    sources_txt = ""
    for source in sources:
        source_id = source.get(id_field, "Unknown")
        doc_info = f"source: {source_id}\n"
        doc_info += f"Content: {source[text_field]}\n"
        sources_txt += doc_info

    sources_txt += "\n\n---\n\n"
    return sources_txt
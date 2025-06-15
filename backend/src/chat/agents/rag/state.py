from __future__ import annotations

from typing import TypedDict, List

from langgraph.graph import add_messages
from typing_extensions import Annotated
from pydantic import BaseModel

import operator
from typing_extensions import Annotated


class OverallState(TypedDict):
    messages: Annotated[list, add_messages]
    facts_checked: Annotated[list, operator.add]


class FactCheckingState(TypedDict):
    facts: List[str]

class FactList(BaseModel):
    facts: List[str]

class FactCheckLevel(BaseModel):
    level: int

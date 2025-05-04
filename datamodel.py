from pydantic import BaseModel
from typing import List, Literal


class Ambulatorio(BaseModel) :
    orario: str 
    telefono: str 
    segreteria: str
    comune: str
    ubicazione: str
    principale: Literal["Y", "N"]


class Doc(BaseModel) :
     nome: str 
     cognome: str
     tipologia: Literal["PLS","MMG"]
     ambito: str
     aft: str
     codice_regionale: str
     scelte_disponibili: int
     id: str
     ambulatori : List[Ambulatorio]
     
class Location(BaseModel) :
    latitude : float
    longitude : float
    
class QueryDoc(BaseModel) :
    tipo_medico : Literal["PLS", "MMG"]
    asl : Literal["asl_centro","asl_nord", "asl_sud"]
    comune : str
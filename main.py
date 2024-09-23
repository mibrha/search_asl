import requests

from typing import List, Literal, Any, Annotated
from geopy.geocoders import Nominatim

from fastapi import FastAPI, Query
from fastapi.responses import HTMLResponse
from datamodel import Ambulatorio,  Doc,  Location , QueryDoc
from helper import make_call_medici_asl_toscana, get_lat_log_from_address, add_marker_to_map
import folium

app = FastAPI()


@app.get("/medici")
def get_lista_medici_comune(parametri_ricerca : Annotated[QueryDoc,  Query()]) -> list[Doc]:
    medici = make_call_medici_asl_toscana(parametri_ricerca.tipo_medico , 
                                          parametri_ricerca.asl ,
                                          parametri_ricerca.comune)
    if medici :
        medici = [Doc(**doc) for doc in medici]
        
    #print(medici)
    return medici

@app.get("/mappa", response_class=HTMLResponse)
def place_doc_on_map( parametri_ricerca : Annotated[QueryDoc,  Query()]) :
    geocoder = Nominatim(user_agent="asl_ricerca")
    location_base = get_lat_log_from_address(parametri_ricerca.comune, geocoder)
    mappa_base = folium.Map(location=[location_base.latitude, location_base.longitude], zoom_start=13)
    lista_doc = get_lista_medici_comune(parametri_ricerca)
    if lista_doc  :
        mappa_base = add_marker_to_map(lista_doc, mappa_base, geocoder)
    response = HTMLResponse(content=mappa_base.get_root().render(), status_code=200)
    #response.headers['Content-Type'] = "application/octet-stream"
    return response
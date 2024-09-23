import re
import requests
from folium.plugins import MarkerCluster
from folium import Marker, Circle, Icon
from geopy.geocoders import Nominatim
import folium
from typing import List, Literal, Any, Annotated
from datamodel import Location, Doc, Ambulatorio




def make_call_medici_asl_toscana(tipo_medico : str, asl :str, comune : str) -> list | None :
    dict_nome_to_cod_asl = {"asl_centro" : "1813960" ,
                            "asl_nord" : "1813961",
                            "asl_sud" : "1813962"}
    url_call = f"https://servizi.estar.toscana.it/adiba/ambulatori.php?a=0&tipologia={tipo_medico}&azienda={dict_nome_to_cod_asl[asl]}&comune={comune}"
    response = requests.get(url_call)
    #print(response.content)
    medici = None
    if response.status_code == 200 :
        medici=  response.json()["medici"]
    return medici




####Localization 

def check_valid_word(word :str,) :
    if len(word) <= 1 :
        if word.isdigit() :
            return True
        else :
            return False
    return True


def simplify_address(address : str, pattern : str = "[^a-zA-Z0-9/]+") :
    cancellatore = re.compile(pattern)
    clean_address = re.sub(cancellatore, " ", address)
    new_address= ""
    for word in clean_address.split() :
        if check_valid_word(word) :
            new_address += word + " "
    return new_address.strip(" ") 


def get_lat_log_from_address(address :str, geolocator : object) -> Location :
    location = geolocator.geocode(address.lower(), country_codes="IT")
    if location is None :
        location = geolocator.geocode(simplify_address(address))
    #print(location)
    lock_return  = None
    if location is None :
        print(f"sorry could not locate {address}")
    else :
        lock_return = Location(latitude=location.latitude, longitude=location.longitude)
    return lock_return


def set_icon_color(value : int) :
    if value > 10 :
        return "green"
    if (value <= 10) and (value > 0) :
        return "orange"
    if value  <= 0 :
        return "red"
    
    
def make_popup_str(doc : Doc, ambulatorio : Ambulatorio) -> str :
    pop_up_string = f"{doc.nome} {doc.cognome}\n posti disponibili: {doc.scelte_disponibili} \n orario : {ambulatorio.orario} \n telefono : {ambulatorio.telefono}\n segreteria: {ambulatorio.segreteria}  \nindirizzo: {ambulatorio.ubicazione}"
    return pop_up_string
    
def add_marker_to_map(lista_medici :List[Doc], mappa_base : folium.Map, geocoder : object) :
    #geocoder = Nominatim(user_agent="asl_ricerca")
    marker_cluster = MarkerCluster().add_to(mappa_base)
    for medici in lista_medici :
        lista_unbicazioni = medici.ambulatori
        for location in lista_unbicazioni :
            #controlla che non sia la contattabilità telefonica
            if ("contattabilit" not in location.ubicazione.lower()) and ("per prenotazion" not in location.ubicazione.lower()) and ("per richiest" not in location.ubicazione.lower()):
                #print(location)
                
                location_geo = get_lat_log_from_address(location.ubicazione, geocoder)
                #print(location_geo)
                if location_geo is None :
                    print(f"could not locate {location.ubicazione} of {medici.nome} {medici.cognome}")
                if location_geo is not None :
                    icon = Icon(icon="house-medical",  color = set_icon_color(medici.scelte_disponibili) , prefix="fa")
                    merk = Marker([location_geo.latitude, location_geo.longitude],popup=make_popup_str(medici, location),
                                  icon=icon).add_to(marker_cluster)
    return mappa_base   
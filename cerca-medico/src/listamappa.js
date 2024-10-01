import { MapContainer, TileLayer, useMap, Marker, Popup, Tooltip } from 'react-leaflet';
import { useGeosearch } from './services';
import {  useEffect, useState, useRef } from 'react';
import L from 'leaflet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouseMedical, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { renderToString } from 'react-dom/server';
import MarkerClusterGroup from 'react-leaflet-cluster';





function useFaIcon(disponibilita, idMedico, medicoSelected) {
    var colorDisponibilità = "green"
    if (disponibilita <= 10 && disponibilita !== 0 ) {
        colorDisponibilità = "orange"
    }
    if (disponibilita === 0) {
        colorDisponibilità = "red"
    }
    var iconHTML = renderToString(<FontAwesomeIcon icon={faHouseMedical} color={colorDisponibilità}  size="2x" pull="left" /> )
    
    if (idMedico === medicoSelected) {
        iconHTML = renderToString(<FontAwesomeIcon icon={faHouseMedical} color={colorDisponibilità}  size="2x" pull="left" spin /> )
    }
    console.log(idMedico, medicoSelected, "ppo")
    
    const customIcon = new L.divIcon({
        html: iconHTML,
        className: 'dioPorco' // Specify something to get rid of the default class.
      })
    return customIcon


}


function MapMarker({indirizzo, nomeMedico, orari, disponibilita, idMedico, medicoSelected, medicoSetter, ambulatorioSelected, ambulatorioSetter, centroSetter }) {
    const idAmbu =  idMedico + "_" + indirizzo;
    const [position , setPosition ] = useState([43.7700 , 11.2577])
    
    
     console.log(idMedico , medicoSelected, idAmbu, "marker")
    
    const [locloc , setLocLoc ] = new useGeosearch(indirizzo, "chiamo_marker")

    const iCon = useFaIcon(disponibilita, idMedico, medicoSelected)
    useEffect(  ()=> {
        setPosition( [locloc.long, locloc.lat]);

    }, [locloc, indirizzo])
   
    function handleambulatorio(e) {
        console.log(e.target.options.id)
        if (ambulatorioSelected !== e.target.options.id ) {
            ambulatorioSetter(e.target.options.id);
            medicoSetter(e.target.options.id.split('_')[0])
            centroSetter(e.target.options.id.split('_')[1])
            console.log("setted key", e.target.options.id, e.target.options.id.split('_')[0])
        }
    }
    

          
   return (
        
            <Marker position={position} id={idAmbu} key={idAmbu} icon={iCon} eventHandlers={{ click : handleambulatorio}}   
        
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'>
                <Popup>
                   {nomeMedico} <br /> {orari} <br /> {disponibilita}
    
                </Popup>
                <Tooltip>{nomeMedico}  {disponibilita}</Tooltip>
    
            </Marker>
            
        )
   

       }
    


function Recenter({comune}) {
    const map = useMap()
    const [ comuneLocation, setComune] = new useGeosearch(comune)
    
    console.log("run comune", comune)
    useEffect(() => {
        setComune(comune)
        map.setView([comuneLocation.long, comuneLocation.lat]);
        console.log("i changed location", comuneLocation)
      }, [ comune, comuneLocation]);
    return null
  }


export default function Mappissima({medicData, comune, selectedMedico, medicoSetter, ambulatorioSelected, ambulatorioSetter, centro, centroSetter }) {
    const [markers, setMarker] = useState([]);
    /**const comuneLoc = useGeosearch(comune); **/
    
    
    const loadMarker = [];
    
    console.log("mappissima", selectedMedico)
    useEffect( () => { 
        
        console.log("reloaded data >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<")

        medicData.forEach((medico) => { 
        const nomeMedico = medico.nome + " " + medico.cognome;
       
       medico.ambulatori.forEach( (ambulatorio) => {
        loadMarker.push(
               < MapMarker indirizzo={ambulatorio.ubicazione} nomeMedico={nomeMedico} orari={ambulatorio.orario} disponibilita={medico.scelte_disponibili}
               idMedico={medico.id} medicoSelected={selectedMedico} medicoSetter={medicoSetter}
               ambulatorioSelected={ambulatorioSelected} ambulatorioSetter={ambulatorioSetter} centroSetter={centroSetter} />
            )
        } )
       }
       );
    setMarker(loadMarker);
    
             }, [ medicData, selectedMedico, ambulatorioSelected, comune] ) 

    
    return (
       
        <MapContainer center={[ 43.7700,11.2577]} zoom={13} style={{ height: "50vh", width: "100%" }}  >
            <TileLayer
    attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"   />
               
    
    <MarkerClusterGroup maxClusterRadius={50}
      >


              {markers} 
           
              </MarkerClusterGroup>
            <Recenter comune={centro} />
        </MapContainer>
        
    )     }








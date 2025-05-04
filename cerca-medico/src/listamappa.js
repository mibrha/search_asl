import { MapContainer, TileLayer, useMap, Marker, Popup, Tooltip } from 'react-leaflet';
import { useGeosearch } from './services';
import {  useEffect, useState } from 'react';
import L from 'leaflet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouseMedical } from '@fortawesome/free-solid-svg-icons';
import { renderToString } from 'react-dom/server';
import MarkerClusterGroup from 'react-leaflet-cluster';






function useFaIcon(disponibilita, idMedico, medicoSelected) {
    var colorDisponibilità = "green"
    if (disponibilita <= 10 && disponibilita >= 1 ) {
        colorDisponibilità = "orange"
    }
    if (disponibilita <= 0) {
        colorDisponibilità = "grey"
    }
    var iconHTML = renderToString(<FontAwesomeIcon icon={faHouseMedical} color={colorDisponibilità}  size="2x" pull="left" /> )
    
    if (idMedico === medicoSelected) {
        
        iconHTML = renderToString(<FontAwesomeIcon icon={faHouseMedical} className="fa-solid fa-house-medical fa-bounce" color={colorDisponibilità}  size="2x" pull="left" 
             style={{"--fa-bounce-land-scale-x": "1.2",
                "--fa-bounce-land-scale-y": ".8",
                "--fa-bounce-rebound": "5px"
            }}
            
            /> )
    }
    
    
    
    const customIcon = new L.divIcon({
        html: iconHTML,
        className: 'dioPorco' + idMedico
         // Specify something to get rid of the default class.
      })

      

    return customIcon


}


function MapMarker({indirizzo, nomeMedico, orari, disponibilita, idMedico, medicoSelected, medicoSetter, ambulatorioSelected, ambulatorioSetter, centroSetter }) {
    const idAmbu =  idMedico + "_" + indirizzo + "_marker";
    const [ position, , ] = useGeosearch(indirizzo)
    const [markerPosition, setMarkerPosition ] = useState(null)
    const iCon = useFaIcon(disponibilita, idMedico, medicoSelected)
     
    
     
    

    
   
    

    
    useEffect(  ()=> {
        if (position !== null) {
            
        setMarkerPosition( [position.long, position.lat]);

    }}, [position])
    
    
   
    function handleambulatorio(e) {
        if (ambulatorioSelected !== e.target.options.id ) {
            medicoSetter(e.target.options.id.split('_')[0])
            ambulatorioSetter(idAmbu)
           
        }
    }
   

    if (markerPosition !== null) {

          
   return (
           <> 
            <Marker position={markerPosition} id={idAmbu} key={idAmbu} icon={iCon} eventHandlers={{ click : handleambulatorio}}   
        
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'>
                <Popup>
                   {nomeMedico} <br /> {orari} <br /> Posti disponibili: {disponibilita}
    
                </Popup>
                <Tooltip>      {nomeMedico} Posti: {disponibilita}</Tooltip>
    
            </Marker>
            </>
            
        )
    } 
       }
    


function Recenter({location}) {
    const map = useMap()
    useEffect(()=> {
        if (location !== null) {
            
        
            map.setView([location.long, location.lat],);
        }


    }, [location, map])    
    
    /** 
    console.log("run comune", comune)
    useEffect(() => {
        setComune(comune)
        
      }, [  comuneLocation]);
    */

      return null
  }




export default function Mappissima({medicData, comune, selectedMedico, medicoSetter, ambulatorioSelected, ambulatorioSetter, centro, centroSetter, location, show }) {
    
    /**const comuneLoc = useGeosearch(comune); **/
    const [markers, setMakers] = useState([])
    
    
    
    useEffect (()=> {
        const loadMarker = [];
        
        

           
        medicData.forEach((medico) => { 
        const nomeMedico = medico.nome + " " + medico.cognome;
       
         medico.ambulatori.forEach( (ambulatorio) => {  
           
            loadMarker.push( < MapMarker indirizzo={ambulatorio.ubicazione} nomeMedico={nomeMedico} orari={ambulatorio.orario} disponibilita={medico.scelte_disponibili}
                idMedico={medico.id} medicoSelected={selectedMedico} medicoSetter={medicoSetter} key={medico.id + "_" + ambulatorio.ubicazione}
               ambulatorioSelected={ambulatorioSelected} ambulatorioSetter={ambulatorioSetter} centroSetter={centroSetter} /> )
        } )
       }

    
       );
       setMakers(loadMarker);
    }, [medicData, selectedMedico, ambulatorioSelected, ambulatorioSetter, medicoSetter, centroSetter])

    
    
    

     if (centro !== null && markers.length >=1 && show ) {
    return (
         <MapContainer key={medicData}  center={[11.2569291 , 43.7686976]} zoom={13} style={{ height: "50vh", width: "100%" }}  >
            <TileLayer
    attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"   />
        <MarkerClusterGroup maxClusterRadius={15}  spiderfyDistanceMultiplier={2} >      
            
        {markers}
        </MarkerClusterGroup>
    
              
            <Recenter comune={centro} locSetter={centroSetter} location={location}/>
        </MapContainer>
        
    )  
}
         }








import { useState , useEffect, useRef} from 'react';
import axios from 'axios';
import { OpenStreetMapProvider, EsriProvider } from 'leaflet-geosearch';


export function useGetMedici(initalUrl) {
    const [data, setData ] = useState([]) ;
    const [urlRichiesta, setUrlRichiesta] = useState(initalUrl) ;
    

    useEffect(() => { axios.get(urlRichiesta)
        .then( function (response) {
            if (response.data.messaggio === "ok") {
            setData(response.data.medici);
        }
    })
        .catch(function (error) {
            console.log(error);
        });}, [urlRichiesta]);
    
    
    return [data, setUrlRichiesta]


}


export  function useGeosearch(searchText) {
    const [location, setLocation] = useState({lat : 0, long : 0, address :""});
    const [searhTerm, setSearchTerm] = useState(searchText)
    
    const provider = new EsriProvider() ;
    

        useEffect( () => {
            
           
            
            const locat = async() => { const loc = await provider.search({query : searchText})
        .then( (respo) => {
            
        if (respo.length >=1) {
           
            setLocation({lat : respo[0]["x"], long : respo[0].y, address : respo[0].label})
            console.log("got location", respo[0])
            
        }})
        .catch(function (error) {
            console.log(error);
        });}
        locat()
        
        }, [searhTerm]);
        
        return [location,setSearchTerm ]
    

}
import { useState , useEffect} from 'react';
import axios from 'axios';
import {  EsriProvider } from 'leaflet-geosearch';


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
            console.error("did not fetch", error);
        });}, [urlRichiesta]);
    
    
    return [data, setUrlRichiesta]


}


export  function useGeosearch(searchText) {
    const [location, setLocation] = useState(null);
    const [searchTerm, setSearchTerm] = useState(searchText)
    
    

        useEffect( () => {

            const provider = new EsriProvider() ;
            let loading = false;
            const baseMaessage = 'no addrress found for' + ' ' + searchTerm
            setLocation(null);
            provider.search({query : searchTerm}).then( result => {
                if (!loading) {
                    if (result.length >=1 ) {
                    setLocation({ lat : result[0].x, long : result[0].y})
                    }
                    else {
                        setLocation({ lat : 0 , long : 0 , address : baseMaessage})
                    }
                }
            });
            return () => {
                loading = true
            };}, [searchTerm] )
            console.log(location)
        
            return [location , searchTerm, setSearchTerm]
            
            
        /**    
            async function fetchLocation() { 
                setLocation(null);
                const result = await provider.search({query : searchText})
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
        **/

       
    

}
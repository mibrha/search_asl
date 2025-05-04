
import {  useState } from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Container from 'react-bootstrap/Container';
import comuniData from './comuni.json';
import MeDicoCard from './SelezionMedico';
import {useGetMedici, useGeosearch} from './services' ;
import Mappissima from './listamappa';
import {  useEffect } from 'react';
import Button from 'react-bootstrap/Button';




const dictComuni = {"1813960": "FIRENZE", "1813961" : "LIVORNO", "1813962": "AREZZO"}

function OptionItem({nome_option}) {
return (
    <option key={nome_option} value={nome_option}>{nome_option}</option>
);
}


function ComuniSelect({code_asl,comune, comuneSetter, centerSetter, ricercaLauncer}) {
    
    const comuniRef = comuniData[code_asl]
    const firstComune = dictComuni[code_asl]
    const idxFirstCom = comuniData[code_asl].indexOf(firstComune)
    comuniRef.splice(idxFirstCom, 1)
    
    const all_comuni = [firstComune, ...comuniRef.sort()]

    const scelte = [];
   
    all_comuni.forEach( (comun) => {
        scelte.push(
            < OptionItem nome_option={comun}  key={comun} /> 
        )

    });

    return (<> <Form.Group as={Row}  controlId='sceltaComune'>
    <Form.Select  defaultValue={'Firenze'} onChange={(e)=> {
        comuneSetter(e.target.value); centerSetter(e.target.value)}} > 
        {scelte}
        </Form.Select>
        </Form.Group>
        </> 
    )
}

function MapTabs({aslSetter, comuneSetter, centerSetter}) {

    function handleAslchange(e) {
        const comuneBase = dictComuni[e]
        aslSetter(e);
        comuneSetter(comuneBase)
        centerSetter(comuneBase)

    }


    return (
        <Tabs
        defaultActiveKey="1813960"
        id="aslSelect"
        className="mb-3"
        fill
        onSelect={(e) => handleAslchange(e)} >
      
        <Tab as={Col} eventKey="1813960" key = "1813960" title="Asl Toscana Centro"      >
        </Tab>
        <Tab as={Col} eventKey="1813961" key = "1813961" title="Azienda Usl Toscana nord ovest"   >
        </Tab>
        <Tab as={Col} eventKey="1813962" key = "1813962" title="Azienda Usl Toscana sud est"      >
        </Tab>
        </Tabs>
    )
}


export default function Ricerca() {
    const [selezioneAsl, setSelezioneAsl ] =  useState('1813960');
    const [selezioneComune, setSelezioneComune ] = useState('Firenze');
    
    const [selezioneTipoMedico, setSelezioneTipoMedico] = useState('PLS');
    const [selectedMedico, setSelectedMedico ] = useState("")
    const [ambulatorioSelected, setAmbulatorioSelected] = useState("")
    const [showMappa, setShowMappa] = useState(true)
    
    const [location,  center , setCenter ] = useGeosearch('Firenze')
    const [listaMedici, fetchUrl] = useGetMedici( "https://servizi.estar.toscana.it/adiba/ambulatori.php?a=0&tipologia="+ selezioneTipoMedico + "&azienda=" + selezioneAsl +"&comune="+selezioneComune);  /**--useState([]);**/
    const medicishow = [];


    function handleshowmappa(e) { 
        e.preventDefault();
        if (showMappa === false) {
            setShowMappa(true);
        };
        if (showMappa === true) {
            setShowMappa(false);
        }
      }




    listaMedici.forEach((medico) => {
        medicishow.push(<MeDicoCard medico_data={medico} key={medico.id} medicoSelected={selectedMedico} 
            medicoSetter={setSelectedMedico} centroSetter={setCenter} 
            ambulatorioSelected={ambulatorioSelected} ambulatorioSetter={setAmbulatorioSelected}
           />);
    });
    

    useEffect (()=> {
        fetchUrl( "https://servizi.estar.toscana.it/adiba/ambulatori.php?a=0&tipologia="+ selezioneTipoMedico + "&azienda=" + selezioneAsl +"&comune="+selezioneComune);
        
    } ,[selezioneTipoMedico, selezioneAsl,fetchUrl, selezioneComune])


    

   


    return (
        <> 
            <Container fluid >
            <Row  >
            
            <Col >
            <Row className="mb-3">
            < MapTabs aslSetter={setSelezioneAsl} comuneSetter={setSelezioneComune} centerSetter={setCenter} />
            </Row>
            <Row className="mb-3">
            <Col >
                <Form  onChange={(e)=> setSelezioneTipoMedico(e.target.value)}>
        <Form.Group as={Col} controlId='tipoMedico'>
        <Form.Check // prettier-ignore
            inline
            type="radio"
            id="pds_mmg_1"
            name="group1"
            label="Pediatra"
            value="PLS" 
            defaultChecked='true'/>
          <Form.Check
          inline
            label="Medico di base"
            name="group1"
            type="radio"
            value="MMG"
            id="pds_mmg_1" />
             <Form.Check
             inline
             
            label="Entrambi"
            name="group1"
            type="radio"
            value=""
            id="pds_mmg_1" />
            </Form.Group>
        </Form>
                </Col>
            <Col >
                <ComuniSelect 
            code_asl={selezioneAsl}
            comuneSetter={setSelezioneComune} comune={selezioneComune} centerSetter={setCenter}/>
                </Col>
               
                
            </Row>
        
        </Col>
        
        
        
        </Row>
        <Row>
            
        <Container fluid>
        <Row >
        
           
           <Col xs={{span : 12, order : 'last' } } md={!showMappa  ?  { span : 10, order :'first' } : { span : 6, order :'first' } } style={ {'overflowY' : 'scroll' , height: "90vh"}}>{medicishow}</Col>
          
           
           <Col xs={{span : 12, order : 'first' }} md={!showMappa  ?  { span : 2, order :'last' } : { span : 6, order :'last' } } >
           <Button variant={!showMappa ? "secondary" : "primary" } onClick={handleshowmappa}>{!showMappa ? 'Mostra Mappa' : 'Nascondi Mappa'}</Button>
           
           <Mappissima medicData={listaMedici} comune={selezioneComune} selectedMedico={selectedMedico} medicoSetter={setSelectedMedico}
            ambulatorioSelected={ambulatorioSelected}  ambulatorioSetter={setAmbulatorioSelected} centro={center} centroSetter={setCenter}
            location={location} key={listaMedici} show={showMappa} /> </Col>
        
        
        
        </Row>
        </Container>
        </Row>
        </Container>
        

        
        </>
    );

} 
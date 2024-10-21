
import {  useState } from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Container from 'react-bootstrap/Container';
import comuniData from './comuni.json';
import Button from 'react-bootstrap/Button';
import MeDicoCard from './SelezionMedico';
import {useGetMedici, useGeosearch} from './services' ;
import Mappissima from './listamappa';






function OptionItem({nome_option}) {
return (
    <option value={nome_option}>{nome_option}</option>
);
}


function ComuniSelect({code_asl,comune, comuneSetter, centerSetter}) {
    const comuni = comuniData[code_asl];
    const scelte = [];
    console.log("in comune", comuni)
    comuni.forEach( (comune) => {
        scelte.push(
            < OptionItem nome_option={comune}  key={comune} /> 
        )

    });

    return (<><Form.Select aria-label="default" onChange={(e)=> {
        comuneSetter(e.target.value); centerSetter(e.target.value)}} > 
        {scelte}
        </Form.Select></> 
    )
}

function MapTabs({aslSetter, comuneSetter, centerSetter}) {

    function handleAslchange(e) {
        const comuneBase = comuniData[e][0]
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
      
        <Tab eventKey="1813960" title="Asl Toscana Centro"      >
        </Tab>
        <Tab eventKey="1813961" title="Azienda Usl Toscana nord ovest"   >
        </Tab>
        <Tab eventKey="1813962" title="Azienda Usl Toscana sud est"      >
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
    
    const [location,  center , setCenter ] = useGeosearch('Firenze')
    const [listaMedici, fetchUrl] = useGetMedici( "https://servizi.estar.toscana.it/adiba/ambulatori.php?a=0&tipologia="+ selezioneTipoMedico + "&azienda=" + selezioneAsl +"&comune="+selezioneComune);  /**--useState([]);**/
    const medicishow = [];
    console.log(selectedMedico)
    console.log("this is center", center )
    listaMedici.forEach((medico) => {
        medicishow.push(<MeDicoCard medico_data={medico} key={medico} medicoSelected={selectedMedico} 
            medicoSetter={setSelectedMedico} centroSetter={setCenter} 
            ambulatorioSelected={ambulatorioSelected} ambulatorioSetter={setAmbulatorioSelected}
           />);
    });
    

    console.log("medicData cambiato", listaMedici.length, selezioneAsl)

    

    function handleRicerca(e) {
        e.preventDefault();
        fetchUrl( "https://servizi.estar.toscana.it/adiba/ambulatori.php?a=0&tipologia="+ selezioneTipoMedico + "&azienda=" + selezioneAsl +"&comune="+selezioneComune) ;
        
        /**const 
        console.log(urlCall);
        axios.get(urlCall)
        .then( function (response) {
            setListaMedici(response.data.medici);
            console.log(response.data.medici);
        })
        .catch(function (error) {
            console.log(error);
        });**/
        
    };


    return (
        <> 
            <Container fluid >
            <Row  >
            
            <Col >
            <Row>
            < MapTabs aslSetter={setSelezioneAsl} comuneSetter={setSelezioneComune} centerSetter={setCenter}/>
            </Row>
            <Row>
            <Col >
                <ComuniSelect 
            code_asl={selezioneAsl}
            comuneSetter={setSelezioneComune} comune={selezioneComune} centerSetter={setCenter}/>
                </Col>
                <Col >
                <Form onChange={(e)=> setSelezioneTipoMedico(e.target.value)}>
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
        </Form>
                </Col>
                
            </Row>
        
        </Col>
        
        <Col  >
        <Button  size="lg" style={{"height":"100%", "width" :"100%"}}  onClick={handleRicerca}>CERCA</Button>
        
        </Col>
        
        </Row>
        <Row>
            
        <Container fluid>
        <Row >
        
           
           <Col style={ {'overflowY' : 'scroll' , height: "90vh"}}>{medicishow}</Col>
          
           
           <Col>
          
           
           <Mappissima medicData={listaMedici} comune={selezioneComune} selectedMedico={selectedMedico} medicoSetter={setSelectedMedico}
            ambulatorioSelected={ambulatorioSelected}  ambulatorioSetter={setAmbulatorioSelected} centro={center} centroSetter={setCenter}
            location={location} key={listaMedici}/> </Col>
        
        
        
        </Row>
        </Container>
        </Row>
        </Container>
        

        
        </>
    );

} 
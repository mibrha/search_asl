
import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import comuniData from './comuni.json';
import RicercaMedico from './listamappa';
import Button from 'react-bootstrap/Button';
import MeDicoCard from './SelezionMedico';
import axios from 'axios';
import {useGetMedici, useGeosearch} from './services' ;
import Mappissima from './listamappa';




function OptionItem({nome_option}) {
return (
    <option value={nome_option}>{nome_option}</option>
);
}


function ComuniSelect({code_asl, comuneSetter, centerSetter}) {
    const comuni = comuniData[code_asl];
    const scelte = [];
    comuni.forEach( (comune) => {
        scelte.push(
            < OptionItem nome_option={comune} /> 
        )

    });

    return (<div><h3>Comune</h3><Form.Select aria-label="default"  onChange={(e)=> {comuneSetter(e.target.value); centerSetter(e.target.value)}} > 
        {scelte}
        </Form.Select></div> 
    )
}




export default function Ricerca() {
    const [selezioneAsl, setSelezioneAsl ] =  useState('1813960');
    const [selezioneComune, setSelezioneComune ] = useState('Firenze');
    const [selezioneTipoMedico, setSelezioneTipoMedico] = useState('MMG');
    const [selectedMedico, setSelectedMedico ] = useState("")
    const [ambulatorioSelected, setAmbulatorioSelected] = useState("")
    const [center , setCenter ] = useState('Firenze')
    const [listaMedici, fetchUrl] = useGetMedici("");  /**--useState([]);**/
    const medicishow = [];
    console.log(selectedMedico)
    listaMedici.forEach((medico) => {
        medicishow.push(<MeDicoCard medico_data={medico} medicoSelected={selectedMedico} medicoSetter={setSelectedMedico} centroSetter={setCenter} ambulatorioSetter={setAmbulatorioSelected}/>);
    });

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
                <Row>
                <Container fluid >
            <Row  >
            <Col>
            <Form>
               
        <h3>Asl</h3><Form.Select aria-label="Azienda Usl Toscana centro"  onChange={(e) => setSelezioneAsl(e.target.value)}   >
            <option value="1813960">Azienda Usl Toscana centro</option>
            <option value="1813961">Azienda Usl Toscana nord ovest</option>
            <option value="1813962">Azienda Usl Toscana sud est</option>
        </Form.Select>
        </Form>
        </Col>
        
        <Col>
        
        <Form onChange={(e)=> setSelezioneTipoMedico(e.target.value)}>
        <Form.Check // prettier-ignore
            type="radio"
            id="pds_mmg_1"
            name="group1"
            label="Pediatra"
            value="PLS" />
          <Form.Check
            label="Medico di base"
            name="group1"
            type="radio"
            value="MMG"
            id="pds_mmg_1" />
             <Form.Check
            label="Entrambi"
            name="group1"
            type="radio"
            value=""
            id="pds_mmg_1" />
        </Form>
        </Col>
        <Col>
            <ComuniSelect 
            code_asl={selezioneAsl}
            comuneSetter={setSelezioneComune} centerSetter={setCenter}/>   
        </Col>
        <Button variant="primary" onClick={handleRicerca}>Cerca</Button>
        
        </Row>
        </Container>
        </Row>
        <Row>
        <Container fluid>
        <Row >
        
           
           <Col style={ {'overflow-y' : 'scroll' , height: "90vh"}}>{medicishow}</Col>
          
           
           <Col><Mappissima medicData={listaMedici} comune={selezioneComune} selectedMedico={selectedMedico} medicoSetter={setSelectedMedico}
            ambulatorioSelected={ambulatorioSelected}  ambulatorioSetter={setAmbulatorioSelected} centro={center} centroSetter={setCenter}/> </Col>
        
        
        
        </Row>
        </Container>
        </Row>
        </Container>
        

        
        </>
    );

} 
import { useRef, useState } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/esm/Row';
import Badge from 'react-bootstrap/Badge';
import { useGeosearch } from './services';


function AmbulaTorio( {ambulatorio_data,idMedico, ambulatorioSetter, centroSetter}) {
  const idAmbu =  idMedico + "_" + ambulatorio_data.ubicazione
  const indirizzo = ambulatorio_data.ubicazione
  function handleShowOnMap(e) {
    e.preventDefault();
    console.log(e)
    ambulatorioSetter(idAmbu)
    centroSetter(ambulatorio_data.ubicazione)
  
  
  }    
  
    return (
        <Card key={idAmbu} id={idAmbu} onClick={handleShowOnMap}>
            <Card.Header as="h5">{ambulatorio_data.comune}</Card.Header>
            <Card.Body>
            <Card.Title>{ambulatorio_data.ubicazione}</Card.Title>
            <Card.Text>
                {ambulatorio_data.orario}
            </Card.Text>
        <ListGroup as="ol" >
            <ListGroup.Item
        as="li"
        className="d-flex justify-content-between align-items-start"  >
            {ambulatorio_data.telefono} 

      </ListGroup.Item>
            <ListGroup.Item
        as="li"
        className="d-flex justify-content-between align-items-start"  >
            {ambulatorio_data.segreteria} 

      </ListGroup.Item>
        </ListGroup>
        </Card.Body>
        </Card>
    );


}

function BadgeDisponibilità({disponibilita}) {
  var type;
  var text;

  if (disponibilita >= 10) {
    type = "success";
    text = "light"
  };
  if (disponibilita <= 10 && disponibilita >= 0) {
    type = "warning";
    text = "dark"
  };
  if (disponibilita === 0 ) {
    type = "danger";
    text  ="light"
  }
return (
   <Badge pill bg={type} text={text}>{disponibilita}</Badge>
  


)

}

function OnlyMedico({medico_data, ambulatori}) {
    const nome_cognome = medico_data.nome + " " + medico_data.cognome;
    console.log(medico_data.scelte_disponibili);
return (
    <Card>
    <Card.Body>
      <Card.Title>{nome_cognome} <BadgeDisponibilità disponibilita={medico_data.scelte_disponibili} /></Card.Title>
      <Card.Text>
      {medico_data.tipologia === "PLS" ? ("Pediatra"):("Medico")}  --- {medico_data.ambito}
      </Card.Text>
      <Button variant="primary">Mostra Ambulatori</Button>
    </Card.Body>
  </Card>
)
}




function Ambulatori({ambulatori, showambulatori, idMedico, ambulatorioSetter, centroSetter={centroSetter}}) {
const ambushow = [];



ambulatori.forEach((ambulatorio) => {
  if (showambulatori === true) {
    ambushow.push(
      <AmbulaTorio ambulatorio_data={ambulatorio} ambulatorioSetter={ambulatorioSetter} idMedico={idMedico} centroSetter={centroSetter}/>
    )
  };
  if (showambulatori === false) {
    return ;
  }
} )
return (
  <Row>
  {ambushow}
  </Row>
)


}



export default function MeDicoCard({medico_data, medicoSelected, medicoSetter, ambulatorioSelected, ambulatorioSetter, centroSetter}) {
    const [showAmbulatori, setShowAmbulatori] = useState(false);
    const nome_cognome = medico_data.nome + " " + medico_data.cognome;
    const ambulatori = [];
    const medRef = useRef(null)

    function handleshow(e) { 
      e.preventDefault();
      if (showAmbulatori === false) {
        setShowAmbulatori(true);
      };
      if (showAmbulatori === true) {
        setShowAmbulatori(false);
      }
    }

    function handleSelect(e) {
      e.preventDefault();
      medicoSetter(medico_data.id )
      

    }

    if (medicoSelected === medico_data.id && medRef.current) {
      medRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })

    }
  
    return (
        <Card key={nome_cognome} bg={medicoSelected === medico_data.id ? "success" : "ligth" } onClick={handleSelect}  style={{cursor : "pointer"}}
        ref={medRef}>
        <Card.Body>
          <Card.Title>{nome_cognome} <BadgeDisponibilità disponibilita={medico_data.scelte_disponibili} /></Card.Title>
          <Card.Text>
          {medico_data.tipologia === "PLS" ? ("Pediatra"):("Medico")}  --- {medico_data.ambito}
          </Card.Text>
          <Button variant="primary" onClick={handleshow}>Mostra Ambulatori</Button>
          <Ambulatori ambulatori={medico_data.ambulatori} showambulatori={showAmbulatori} idMedico={medico_data.id} ambulatorioSetter={ambulatorioSetter} centroSetter={centroSetter} />
        </Card.Body>
      </Card>
    )

}


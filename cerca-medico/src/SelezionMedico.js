import { useState } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/esm/Row';
import Badge from 'react-bootstrap/Badge';


function AmbulaTorio( {ambulatorio_data, nomecognome}) {
  const keyambu = nomecognome + '_' +'ambulatorio'+ ambulatorio_data.ubicazione
    return (
        <Card key={keyambu} >
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

function showAmbulatorio(showstate, showstatesetter) {
    if (showstate === false) {
      showstatesetter(true); }
    if (showstate === true) {
      showstatesetter(false);
    }
    return }


function Ambulatori({ambulatori, showambulatori, nomecognome}) {
const ambushow = [];
ambulatori.forEach((ambulatorio) => {
  if (showambulatori === true) {
    ambushow.push(
      <AmbulaTorio ambulatorio_data={ambulatorio} nomecognome={nomecognome} />
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



export default function MeDicoCard({medico_data}) {
    const [showAmbulatori, setShowAmbulatori] = useState(false);
    const nome_cognome = medico_data.nome + " " + medico_data.cognome;
    const ambulatori = [];

    function handleshow() {
      if (showAmbulatori === false) {
        setShowAmbulatori(true);
      };
      if (showAmbulatori === true) {
        setShowAmbulatori(false);
      }
    }
  
    return (
        <Card key={nome_cognome}>
        <Card.Body>
          <Card.Title>{nome_cognome} <BadgeDisponibilità disponibilita={medico_data.scelte_disponibili} /></Card.Title>
          <Card.Text>
          {medico_data.tipologia === "PLS" ? ("Pediatra"):("Medico")}  --- {medico_data.ambito}
          </Card.Text>
          <Button variant="primary" onClick={handleshow}>Mostra Ambulatori</Button>
          <Ambulatori ambulatori={medico_data.ambulatori} showambulatori={showAmbulatori} nomecognome={nome_cognome} />
        </Card.Body>
      </Card>
    )

}


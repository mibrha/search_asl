import { useRef, useState } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import Badge from 'react-bootstrap/Badge';


function AmbulaTorio( {ambulatorio_data,idMedico, ambulatorioSelected, centroSetter}) {
  const idAmbu =  idMedico + "_" + ambulatorio_data.ubicazione
  
  const ambuRef = useRef(null)
  let studi = <><ListGroup.Item   key={ambulatorio_data.telefono + "_telefono"} as="li"   className="d-flex justify-content-between align-items-start"  >   {ambulatorio_data.telefono} </ListGroup.Item> </>
  if (ambulatorio_data.telefono !== ambulatorio_data.segreteria && ambulatorio_data.segreteria) {
    studi = <> <ListGroup.Item   key={ambulatorio_data.telefono+"_segreteria"}  as="li"     className="d-flex justify-content-between align-items-start"  >
        {ambulatorio_data.telefono} </ListGroup.Item>
        <ListGroup.Item  key={ambulatorio_data.segreteria}  as="li"
         className="d-flex justify-content-between align-items-start"  >
        {ambulatorio_data.segreteria}   </ListGroup.Item>  </> 
  }


  function handleShowOnMap(e) {
    e.preventDefault();
    
    centroSetter(ambulatorio_data.ubicazione)
    
    
   
  
  } 
  
  if (ambulatorioSelected === idAmbu && ambuRef.current) {
    ambuRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })

  }
  
    return (
        <Card key={idAmbu} id={idAmbu} onClick={handleShowOnMap}>
            <Card.Header as="h5">{ambulatorio_data.comune}</Card.Header>
            <Card.Body>
            <Card.Title>{ambulatorio_data.ubicazione}</Card.Title>
            <Card.Text>
                {ambulatorio_data.orario}
            </Card.Text>
        <ListGroup as="ol" key={idAmbu}>
           {studi}
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
  if (disponibilita <= 10 && disponibilita >= 1) {
    type = "warning";
    text = "dark"
  };
  if (disponibilita <= 0 ) {
    type = "secondary";
    text  ="light"
  }
return (
   <Badge pill bg={type} text={text}>{disponibilita}</Badge>
  


)

}






function Ambulatori({ambulatori, showambulatori, idMedico, ambulatorioSelected, centroSetter}) {
const ambushow = [];



ambulatori.forEach((ambulatorio) => {
  if (showambulatori === true | ambulatorioSelected === idMedico+ '_'+ambulatorio.ubicazione) {
    ambushow.push(
      <AmbulaTorio ambulatorio_data={ambulatorio} idMedico={idMedico} key={idMedico + "_" + ambulatorio.ubicazione} ambulatorioSelected={ambulatorioSelected} centroSetter={centroSetter}/>
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



export default function MeDicoCard({medico_data, medicoSelected, medicoSetter, centroSetter, ambulatorioSelected, ambulatorioSetter}) {
    const [showAmbulatori, setShowAmbulatori] = useState(false);
    const nome_cognome = medico_data.nome + " " + medico_data.cognome;
    const medRef = useRef(null)
    const orari = []

    function handleshow(e) { 
      e.preventDefault();
      if (showAmbulatori === false) {
        setShowAmbulatori(true);
      };
      if (showAmbulatori === true) {
        setShowAmbulatori(false);
        ambulatorioSetter('')
      }
    }

    function handleSelect(e) {
      e.preventDefault();
      medicoSetter(medico_data.id )
      

    }
    

  function handleShowOnMap(e) {
    e.preventDefault();
    centroSetter(e.target.id)
    
    
  
  
  }

    medico_data.ambulatori.forEach((ambulatorio) => {
      if (ambulatorio.orario) {

      
      orari.push(<ListGroup.Item
        as="li" onClick={handleShowOnMap}  id ={ambulatorio.ubicazione} key = {medico_data.id + "_" + ambulatorio.ubicazione + "_item"}
        className="d-flex justify-content-between align-items-start"  >
        <Card.Text id ={ambulatorio.ubicazione} key = {medico_data.id + "_" + ambulatorio.ubicazione + "_card"}>{ambulatorio.ubicazione.split(",")[0]} : {ambulatorio.orario} </Card.Text>
        </ListGroup.Item>
       )
      }


    })

    if (medicoSelected === medico_data.id && medRef.current) {
      
      medRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
  
    }
  
    return (
        <Card key={nome_cognome} bg={medicoSelected === medico_data.id ? "success" : "ligth" } onClick={handleSelect}  style={{cursor : "pointer"}}
        ref={medRef}>
        <Card.Body>
          < Row> 
          <Col md={{ span : 3, order :'first' }} xs={{span : 3,display : "none", order : 'first' }} className="d-md-block d-none">
          <Card.Img variant="top" src={medico_data.nome.split(" ")[0].at(-1).toLowerCase() !== "a" ? "/dottore_yes.jpg" :  "/female_doc.png" } />
          </Col>
          <Col >
          <Card.Title >{nome_cognome} <BadgeDisponibilità disponibilita={medico_data.scelte_disponibili} /></Card.Title>
          <Card.Subtitle>
          {medico_data.tipologia === "PLS" ? ("Pediatra"):("Medico")}  --- {medico_data.ambito.split("-")[0]}
          </Card.Subtitle>
          <ListGroup as="ol" >
          {orari}
          </ListGroup>
          </Col>
          </Row>
          < Row>
          <Button variant="primary" onClick={handleshow}>{!showAmbulatori ? 'Mostra Ambulatori' : 'Nascondi'}</Button>
          <Col >
          <Ambulatori ambulatori={medico_data.ambulatori} showambulatori={showAmbulatori} idMedico={medico_data.id} 
          centroSetter={centroSetter} ambulatorioSelected={ambulatorioSelected} key={medico_data.id} />
        </Col>
        </Row>
        </Card.Body>
      </Card>
    )

}


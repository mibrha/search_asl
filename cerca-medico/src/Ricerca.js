
import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

export default function Ricerca() {
    const [selezioneAsl, setSelezioneAsl ] =  useState('1813960')


    return (
        <> <Form>
            <Row>
                <Col>
        <h1>Seleziona Asl</h1><Form.Select aria-label="Azienda Usl Toscana centro" >
            <option value="1813960">Azienda Usl Toscana centro</option>
            <option value="1813961">Azienda Usl Toscana nord ovest</option>
            <option value="1813962">Azienda Usl Toscana sud est</option>
        </Form.Select>
        </Col>
        <Col>
        <Form.Check // prettier-ignore
            type="radio"
            id="pds_mmg_1"
            name="group1"
            label="Pediatra"
            value="PDS" />
          <Form.Check
            label="Medico di base"
            name="group1"
            type="radio"
            id="pds_mmg_1" />
        </Col>
        <Col>
               
        </Col>
        </Row>
        </Form>
        </>
    );

} 
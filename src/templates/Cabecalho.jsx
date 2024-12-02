import { Alert } from "react-bootstrap";
export default function Cabecalho(props) {
    return (
        <header>
            <Alert variant="sucess" className={'text-center'}>
            <Alert.Heading>{props.conteudo}</Alert.Heading>
            </Alert>
        </header>
    )
}
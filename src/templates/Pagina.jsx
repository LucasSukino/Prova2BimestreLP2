import Cabecalho from "./Cabecalho";
import Rodape from "./Rodape";
import Menu from "./Menu";

export default function Pagina(props) {
    return (
        <>
            <Menu />
            <div>
                {}
                {props.children} 
            </div>
            
        </>
    )
}


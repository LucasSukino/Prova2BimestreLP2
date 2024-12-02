import { Container, Button, Form } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { getUsuarios } from "../redux/usuarioReducer";
import Estado from "../Estados/estado";
import { Link } from "react-router-dom";
import Pagina from "../templates/Pagina";

export default function Mensagens() {
    const { estado, mensagem, usuarios } = useSelector((state) => state.usuario);
    const dispatch = useDispatch();

    const [atualizarMensagens, setAtualizarMensagens] = useState(false);

    useEffect(() => {
        dispatch(getUsuarios());
    }, [dispatch, atualizarMensagens]);

    const usuariosComMensagens = usuarios.filter(usuario => usuario.mensagens.length > 0);

    const excluirMensagem = async (mensagemId, dataHora) => {
    
        const confirmacao = window.confirm("Tem certeza que deseja excluir esta mensagem?");
        if (!confirmacao) {
            return; // Se o usuário clicar em "Cancelar", a exclusão não será realizada
        }
    
        try {
            const response = await fetch("http://localhost:3000/mensagem", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ id: mensagemId }) // Envia o ID da mensagem no corpo
            });
    
            if (response.ok) {
                console.log(`Mensagem ${mensagemId} excluída com sucesso.`);
                setAtualizarMensagens(!atualizarMensagens); // Atualiza a lista de mensagens
            } else {
                console.error("Erro ao excluir mensagem:", response.statusText);
            }
        } catch (error) {
            console.error("Erro ao excluir mensagem:", error);
        }
    };


    return (
        <Container>
             <Pagina />
            <div>
                <h2>Mensagens dos usuarios</h2>
                {estado === Estado.PENDENTE && <p>Carregando usuários...</p>}
                {estado === Estado.ERRO && <p>Erro: {mensagem}</p>}
                {estado === Estado.OCIOSO && usuariosComMensagens.length === 0 && <p>Nenhum usuário com mensagens encontrado.</p>}

                <ul>
                    {usuariosComMensagens.map((usuario) => (
                        <li key={usuario.id}>
                            <img
                                src={usuario.urlAvatar}
                                alt={`Avatar de ${usuario.nickname}`}
                                style={{ width: "50px", borderRadius: "50%" }}
                            />
                            <strong>{usuario.nickname}</strong>
                            <ul>
                                {usuario.mensagens.map((mensagem) => (
                                    <li key={mensagem.id} className="d-flex justify-content-between align-items-center">
                                        <span>
                                            <strong>Mensagem:</strong> {mensagem.mensagem} |{" "}
                                            <strong>Data:</strong> {mensagem.dataHora}
                                        </span>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => excluirMensagem(mensagem.id)}
                                        >
                                            Excluir
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>

                <Button as={Link} to="/" variant="secondary" className="mt-4">
                    Voltar para o Menu
                </Button>
            </div>
        </Container>
    );
}

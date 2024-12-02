import { Container, Button, Form, Dropdown, DropdownButton } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { getUsuarios } from "../redux/usuarioReducer";
import Estado from "../Estados/estado";
import { Link } from "react-router-dom";
import Pagina from "../templates/Pagina";

export default function BatePapoTela() {
    const { estado, mensagem, usuarios } = useSelector((state) => state.usuario);
    const dispatch = useDispatch();

    const [mensagemInput, setMensagemInput] = useState("");
    const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);
    const [atualizarMensagens, setAtualizarMensagens] = useState(false);

    useEffect(() => {
        dispatch(getUsuarios());
    }, [dispatch, atualizarMensagens]);  // Adicionando 'atualizarMensagens' como dependência

    const usuariosComMensagens = usuarios.filter(usuario => usuario.mensagens.length > 0);

    // Combina usuários e suas mensagens em uma única lista
    const mensagensComUsuarios = usuariosComMensagens.flatMap(usuario =>
        usuario.mensagens.map(mensagem => ({ usuario, mensagem }))
    );

    // Ordena as mensagens pela data
    mensagensComUsuarios.sort((a, b) => new Date(a.mensagem.dataHora) - new Date(b.mensagem.dataHora));

    // Função para enviar a mensagem
    const enviarMensagem = async () => {
        if (usuarioSelecionado && mensagemInput.trim()) {
            try {
                const response = await fetch("http://localhost:3000/mensagem", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        mensagem: mensagemInput,
                        usuario: { id: usuarioSelecionado.id }
                    })
                });

                if (response.ok) {
                    setMensagemInput("");
                    console.log(`Mensagem para ${usuarioSelecionado.nickname}: ${mensagemInput}`);
                    setAtualizarMensagens(!atualizarMensagens);  // Força a atualização da lista
                } else {
                    console.error("Erro ao enviar a mensagem:", response.statusText);
                }
            } catch (error) {
                console.error("Erro ao enviar a mensagem:", error);
            }
        }
    };

    const handleSelectUsuario = (usuarioId) => {
        const usuario = usuarios.find(u => u.id === usuarioId);
        setUsuarioSelecionado(usuario);
    };

    // Função para marcar mensagem como lida
    const marcarMensagemComoLida = async (mensagemId) => {
        try {
            const response = await fetch(`http://localhost:3000/mensagem`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: mensagemId,
                    lida: true
                })
            });

            if (response.ok) {
                console.log(`Mensagem com ID ${mensagemId} marcada como lida.`);
            } else {
                console.error("Erro ao marcar mensagem como lida:", response.statusText);
            }
        } catch (error) {
            console.error("Erro ao marcar mensagem como lida:", error);
        }
    };

    useEffect(() => {
        mensagensComUsuarios.forEach(({ mensagem }) => {
            if (!mensagem.lida) {
                marcarMensagemComoLida(mensagem.id);
            }
        });
    }, [mensagensComUsuarios]);

    return (
        <Container>
             <Pagina />
            <div>
                <h2>Bate Papo</h2>

                {estado === Estado.PENDENTE && <p>Carregando usuários...</p>}
                {estado === Estado.ERRO && <p>Erro: {mensagem}</p>}
                {estado === Estado.OCIOSO && usuariosComMensagens.length === 0 && <p>Nenhum usuário com mensagens encontrado.</p>}

                <ul>
                    {mensagensComUsuarios.map(({ usuario, mensagem }) => (
                        <li key={`${usuario.id}-${mensagem.id}`}>
                            <img
                                src={usuario.urlAvatar}
                                alt={`Avatar de ${usuario.nickname}`}
                                style={{ width: "50px", borderRadius: "50%" }}
                            />
                            <strong> ID:</strong> {usuario.id} |
                            <strong> Nickname:</strong> {usuario.nickname} |
                            <strong> Data de Ingresso:</strong> {usuario.dataIngresso}
                            <ul>
                                <h3>Mensagem</h3>
                                <li>
                                    <p><strong>ID:</strong> {mensagem.id}</p>
                                    <p><strong>Mensagem:</strong> {mensagem.mensagem}</p>
                                    <p><strong>Data e Hora:</strong> {mensagem.dataHora}</p>
                                    <p><strong>Lida:</strong> {mensagem.lida ? "Sim" : "Não"}</p>
                                </li>
                            </ul>
                        </li>
                    ))}
                </ul>

                <div className="mt-4">
                    <h3>Enviar Mensagem</h3>

                    <DropdownButton 
                        variant="outline-primary" 
                        title={usuarioSelecionado ? usuarioSelecionado.nickname : "Selecione um usuário"} 
                        className="mb-3"
                    >
                        {usuarios.map((usuario) => (
                            <Dropdown.Item
                                key={usuario.id}
                                onClick={() => handleSelectUsuario(usuario.id)}
                            >
                                {usuario.nickname}
                            </Dropdown.Item>
                        ))}
                    </DropdownButton>

                    {usuarioSelecionado && (
                        <div className="ml-3">
                            <strong>Usuário Selecionado:</strong> {usuarioSelecionado.nickname}
                        </div>
                    )}

                    <Form.Group className="mt-3">
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Digite sua mensagem..."
                            value={mensagemInput}
                            onChange={(e) => setMensagemInput(e.target.value)}
                        />
                    </Form.Group>

                    <Button 
                        variant="success" 
                        className="mt-3" 
                        onClick={enviarMensagem}
                        disabled={!usuarioSelecionado || !mensagemInput.trim()} 
                    >
                        Enviar
                    </Button>
                </div>

                <Button as={Link} to="/" variant="secondary" className="mt-4">
                    Voltar para o Menu
                </Button>
            </div>
        </Container>
    );
}

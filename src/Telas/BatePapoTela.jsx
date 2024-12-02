import { Container, Button, Form, Dropdown, DropdownButton } from "react-bootstrap";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getUsuarios } from "../redux/usuarioReducer";
import Estado from "../Estados/estado";
import Pagina from "../templates/Pagina";

export default function BatePapoTela() {
    const { estado, mensagem, usuarios } = useSelector((state) => state.usuario);
    const dispatch = useDispatch();

    const [mensagemInput, setMensagemInput] = useState("");
    const [usuarioLogado, setUsuarioLogado] = useState(null);
    const [nickname, setNickname] = useState("");
    const [senha, setSenha] = useState("");
    const [erroLogin, setErroLogin] = useState("");
    const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);
    const [atualizarMensagens, setAtualizarMensagens] = useState(false);

    useEffect(() => {
        dispatch(getUsuarios());
    }, [dispatch, atualizarMensagens]);

    const usuariosComMensagens = usuarios.filter(usuario => usuario.mensagens.length > 0);
    const mensagensComUsuarios = usuariosComMensagens.flatMap(usuario =>
        usuario.mensagens.map(mensagem => ({ usuario, mensagem }))
    );

    mensagensComUsuarios.sort((a, b) => new Date(a.mensagem.dataHora) - new Date(b.mensagem.dataHora));

    const autenticarUsuario = async () => {
        try {
            const response = await fetch("https://backend-bcc-2-b.vercel.app/usuario/verificarSenha", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nickname, senha }),
            });

            if (response.ok) {
                const resultado = await response.json();
                if (resultado.senhaCorreta) {
                    const usuario = usuarios.find(u => u.nickname === nickname);
                    setUsuarioLogado(usuario);
                    setUsuarioSelecionado(usuario);
                    setErroLogin("");
                } else {
                    setErroLogin("Senha incorreta. Tente novamente.");
                }
            } else {
                setErroLogin("Erro ao verificar a senha. Tente novamente mais tarde.");
            }
        } catch (error) {
            console.error("Erro ao autenticar o usuário:", error);
            setErroLogin("Erro no servidor.");
        }
    };

    const enviarMensagem = async () => {
        if (usuarioLogado && usuarioSelecionado && mensagemInput.trim()) {
            try {
                const response = await fetch("https://backend-bcc-2-b.vercel.app/mensagem", {
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
                    setAtualizarMensagens(!atualizarMensagens);
                } else {
                    console.error("Erro ao enviar a mensagem:", response.statusText);
                }
            } catch (error) {
                console.error("Erro ao enviar a mensagem:", error);
            }
        }
    };

    const excluirMensagem = async (mensagemId, usuarioId) => {
        if (usuarioLogado.id !== usuarioId) {
            alert("Você só pode excluir suas próprias mensagens!");
            return;
        }

        const confirmacao = window.confirm("Tem certeza que deseja excluir esta mensagem?");
        if (!confirmacao) {
            return;
        }

        try {
            const response = await fetch("https://backend-bcc-2-b.vercel.app/mensagem", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ id: mensagemId })
            });

            if (response.ok) {
                console.log(`Mensagem ${mensagemId} excluída com sucesso.`);
                setAtualizarMensagens(!atualizarMensagens);
            } else {
                console.error("Erro ao excluir mensagem:", response.statusText);
            }
        } catch (error) {
            console.error("Erro ao excluir mensagem:", error);
        }
    };

    const marcarMensagemComoLida = async (mensagemId) => {
        try {
            const response = await fetch("https://backend-bcc-2-b.vercel.app/mensagem", {
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

    const marcarMensagemComoNaoLida = async (mensagemId) => {
        try {
            const response = await fetch("https://backend-bcc-2-b.vercel.app/mensagem", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: mensagemId,
                    lida: false
                })
            });

            if (response.ok) {
                console.log(`Mensagem ${mensagemId} marcada como não lida.`);
                setAtualizarMensagens(!atualizarMensagens); // Atualiza a lista de mensagens
            } else {
                console.error("Erro ao marcar mensagem como não lida:", response.statusText);
            }
        } catch (error) {
            console.error("Erro ao marcar mensagem como não lida:", error);
        }
    };



    return (
        <Container>
            <Pagina />
            <div>
                <h2>Bate Papo</h2>

                {!usuarioLogado ? (
                    <div>
                        <h3>Login</h3>
                        {erroLogin && <p className="text-danger">{erroLogin}</p>}
                        <Form>
                            <Form.Group>
                                <Form.Label>Nickname</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Digite seu nickname"
                                    value={nickname}
                                    onChange={(e) => setNickname(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Senha</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Digite sua senha"
                                    value={senha}
                                    onChange={(e) => setSenha(e.target.value)}
                                />
                            </Form.Group>
                            <Button onClick={autenticarUsuario} className="mt-3">
                                Entrar
                            </Button>
                        </Form>
                    </div>
                ) : (
                    <div>
                        <h3 className="mb-0">Bem-vindo, {usuarioLogado.nickname}!</h3>
                        <div className="mt-4">
                            <h3>Mensagens</h3>
                            <div className="d-flex flex-column gap-3">
                                {mensagensComUsuarios.map(({ usuario, mensagem }) => (
                                    <div key={`${usuario.id}-${mensagem.id}`} className="card p-3 shadow-sm">
                                        <div className="d-flex align-items-center">
                                            <img
                                                src={usuario.urlAvatar}
                                                alt={`Avatar de ${usuario.nickname}`}
                                                style={{
                                                    width: "50px",
                                                    height: "50px",
                                                    borderRadius: "50%",
                                                    marginRight: "15px",
                                                }}
                                            />
                                            <div>
                                                <strong>{usuario.nickname}</strong>
                                                <span className="text-muted" style={{ fontSize: "0.9rem", marginLeft: "10px" }}>
                                                    {new Date(mensagem.dataHora).toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                        <p className="mt-2 mb-0">{mensagem.mensagem}</p>
                                        <div className="mt-2 text-muted">
                                            <small>ID: {mensagem.id}</small>
                                            <br />
                                            <small>{mensagem.lida ? "Mensagem lida" : "Mensagem não lida"}</small>
                                        </div>
                                        {usuario.id === usuarioLogado.id && (
                                            <div className="mt-2">
                                                <Button variant="danger" onClick={() => excluirMensagem(mensagem.id, usuario.id)}>
                                                    Excluir
                                                </Button>
                                            </div>
                                        )}
 
                                            {usuario.id === usuarioLogado.id && mensagem.lida && (
                                                 <div className="mt-2">
                                                 <Button variant="warning" onClick={() => marcarMensagemComoNaoLida(mensagem.id)}>
                                                     Marcar N/Lida
                                                 </Button>
                                             </div>
                                            )}


                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-4">
                            <h3>Enviar Mensagem</h3>
                            <DropdownButton 
                                variant="outline-primary" 
                                title={usuarioLogado ? usuarioLogado.nickname : "Selecione um usuário"} 
                                className="mb-3"
                                disabled
                            >
                                {usuarioLogado && (
                                    <Dropdown.Item
                                        key={usuarioLogado.id}
                                        onClick={() => setUsuarioSelecionado(usuarioLogado)}
                                    >
                                        {usuarioLogado.nickname}
                                    </Dropdown.Item>
                                )}
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
                    </div>
                )}

                <Button as={Link} to="/" variant="secondary" className="mt-4">
                    Voltar para o Menu
                </Button>
            </div>
        </Container>
    );
}

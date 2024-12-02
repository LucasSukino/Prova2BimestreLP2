import { useState, useEffect } from "react";
import { Button, Container, Row, Col, ListGroup, Modal, Form, FloatingLabel } from "react-bootstrap";
import { Link } from "react-router-dom"; 
import { useSelector, useDispatch } from "react-redux";
import { getUsuarios, excluirUsuario, alterarUsuario } from "../redux/usuarioReducer";
import Estado from "../Estados/estado";
import Pagina from "../templates/Pagina";

export default function CadastroUsuario() {
    const usuarioIni = {
        nickname: "",
        urlAvatar: "",
        senha: "",
    };

    const [usuario, setUsuario] = useState(usuarioIni);
    const [showAlterar, setShowAlterar] = useState(false); 
    const [senha, setSenha] = useState(""); 
    const [senhaErro, setSenhaErro] = useState(""); // Adiciona estado para mensagem de erro de senha
    const [usuarioExcluir, setUsuarioExcluir] = useState(null); 
    const [showExcluir, setShowExcluir] = useState(false); 

    const { estado, mensagem, usuarios } = useSelector((state) => state.usuario);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getUsuarios());
    }, [dispatch]);

    // Função para abrir o modal de edição
    function handleAlterar(usuario) {
        setUsuario({ ...usuario, senha: "" });
        setShowAlterar(true);
    }

    // Função para confirmar a alteração
    function confirmarAlteracao() {
        if (senha) {
            const usuarioAlterado = { ...usuario, senha };
            dispatch(alterarUsuario(usuarioAlterado));
            setShowAlterar(false);
        } else {
            alert("A senha é obrigatória para confirmar a alteração!");
        }
    }

    // Função para abrir o modal de exclusão
    function handleExcluir(usuario) {
        setUsuarioExcluir(usuario);
        setShowExcluir(true);
    }

    // Função para confirmar a exclusão
    function confirmarExclusao() {
        if (!senha) {
            setSenhaErro("A senha é obrigatória para confirmar a exclusão!");
            return;
        }
        if (senha && usuarioExcluir) {
            dispatch(excluirUsuario({ id: usuarioExcluir.id, senha }))
                .then(response => {
                    setShowExcluir(false);
                })
                .catch(err => {
                    setSenhaErro("Senha incorreta!");
                });
        }
    }

    return (
        
        <Container>
             <Pagina />
            <Row>
                <Col md={12} className="mt-4">
                    <h3>Usuários Cadastrados</h3>
                    {estado === Estado.PENDENTE && <p>Carregando usuários...</p>}
                    {estado === Estado.ERRO && <p>Erro: {mensagem}</p>}
                    {estado === Estado.OCIOSO && usuarios.length === 0 && <p>Nenhum usuário encontrado.</p>}
                    {estado === Estado.OCIOSO && usuarios.length > 0 && (
                        <ListGroup>
                            {usuarios.map((usuario) => (
                                <ListGroup.Item key={usuario.id}>
                                    <img
                                        src={usuario.urlAvatar}
                                        alt={`Avatar de ${usuario.nickname}`}
                                        style={{ width: "50px", borderRadius: "50%" }}
                                    />
                                    <strong>Nickname:</strong> {usuario.nickname} |
                                    <strong> Data de Ingresso:</strong> {usuario.dataIngresso}
                                    <div className="d-flex justify-content-end mt-2">
                                        <Button
                                            variant="warning"
                                            size="sm"
                                            className="me-2"
                                            onClick={() => handleAlterar(usuario)}
                                        >
                                            Alterar
                                        </Button>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => handleExcluir(usuario)}
                                        >
                                            Excluir
                                        </Button>
                                    </div>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    )}
                </Col>

                {/* Adicionado botão "Voltar" */}
                <Col md={6} className="d-flex justify-content-end mt-4">
                    <Button type="button" variant="secondary" as={Link} to="/">
                        Voltar
                    </Button>
                </Col>
            </Row>

            {/* Modal para Alteração */}
            <Modal show={showAlterar} onHide={() => setShowAlterar(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Alterar Usuário</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <FloatingLabel label="Nickname:" className="mb-3">
                            <Form.Control
                                type="text"
                                placeholder="Informe o seu nickname"
                                value={usuario.nickname}
                                onChange={(e) => setUsuario({ ...usuario, nickname: e.target.value })}
                                required
                            />
                        </FloatingLabel>
                        <FloatingLabel label="Foto de Perfil:" className="mb-3">
                            <Form.Control
                                type="text"
                                placeholder="URL da foto de perfil"
                                value={usuario.urlAvatar}
                                onChange={(e) => setUsuario({ ...usuario, urlAvatar: e.target.value })}
                                required
                            />
                        </FloatingLabel>
                        <FloatingLabel label="Senha:" className="mb-3">
                            <Form.Control
                                type="password"
                                placeholder="Informe a sua senha"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                required
                            />
                        </FloatingLabel>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowAlterar(false)}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={confirmarAlteracao}>
                        Confirmar Alteração
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal para Exclusão */}
            <Modal show={showExcluir} onHide={() => setShowExcluir(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar Exclusão</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Control
                        type="password"
                        placeholder="Digite sua senha para confirmar"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                    />
                    {senhaErro && <p style={{ color: "red" }}>{senhaErro}</p>} {/* Exibe mensagem de erro */}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowExcluir(false)}>
                        Cancelar
                    </Button>
                    <Button variant="danger" onClick={confirmarExclusao}>
                        Confirmar Exclusão
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

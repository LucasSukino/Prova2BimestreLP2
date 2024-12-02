import { useState, useEffect } from "react";
import { Button, Container, Form, Row, Col, FloatingLabel, ListGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import Pagina from "../templates/Pagina";
import { useSelector, useDispatch } from 'react-redux';
import { getUsuarios, cadastrarUsuario } from "../redux/usuarioReducer";
import Estado from "../Estados/estado";

export default function CadastroUsuario(props) {
    // Estado inicial do formulário de cadastro
    const usuarioIni = {
        nickname: "",
        urlAvatar: "",
        senha: "", // Adicionando campo de senha
    };
    
    const [usuario, setUsuario] = useState(usuarioIni);
    const [formValidado, setFormValidado] = useState(false);

    // Pegando dados do estado do Redux
    const { estado, mensagem, usuarios } = useSelector((state) => state.usuario);
    const dispatch = useDispatch();

    // Função para atualizar os dados no formulário
    function escreveu(e) {
        const componente = e.currentTarget;
        setUsuario({ ...usuario, [componente.name]: componente.value });
    }

    // Função para manipular a submissão do formulário
    function manipularSubmissao(e) {
        const form = e.currentTarget;
        if (form.checkValidity()) {
            dispatch(cadastrarUsuario(usuario));  // Envia o usuário para o backend
            setUsuario(usuarioIni);  // Limpa o formulário após o envio
            setFormValidado(false);  // Reseta o estado de validação
        } else {
            setFormValidado(true);  // Marca o formulário como inválido
        }

        e.stopPropagation();
        e.preventDefault();
    }

    // Carregar os usuários ao montar o componente
    useEffect(() => {
        dispatch(getUsuarios());
    }, [dispatch]);

    return (
        <Container>
            <Pagina />
            <Row>
                {/* Formulário de cadastro */}
                <Col md={6}>
                    <Form noValidate validated={formValidado} onSubmit={manipularSubmissao}>
                        <Row>
                            <Col md={12}>
                                <Form.Group>
                                    <FloatingLabel label="Nickname:" className="mb-3">
                                        <Form.Control 
                                            type="text" 
                                            placeholder="Informe o seu nickname" 
                                            id="nickname" 
                                            name="nickname" 
                                            value={usuario.nickname}
                                            onChange={escreveu}
                                            required 
                                        />
                                        <Form.Control.Feedback type="invalid">Informe o nickname!</Form.Control.Feedback>
                                    </FloatingLabel>
                                </Form.Group>
                            </Col>

                            <Col md={12}>
                                <Form.Group>
                                    <FloatingLabel label="Foto de Perfil:" className="mb-3">
                                        <Form.Control 
                                            type="text" 
                                            placeholder="URL da foto de perfil" 
                                            id="urlAvatar" 
                                            name="urlAvatar" 
                                            onChange={escreveu}
                                            value={usuario.urlAvatar}
                                            required 
                                        />
                                    </FloatingLabel>
                                    <Form.Control.Feedback type="invalid">Informe a URL da foto de perfil!</Form.Control.Feedback>
                                </Form.Group>
                            </Col>

                            {/* Adicionando o campo de senha */}
                            <Col md={12}>
                                <Form.Group>
                                    <FloatingLabel label="Senha:" className="mb-3">
                                        <Form.Control 
                                            type="password" 
                                            placeholder="Informe a sua senha" 
                                            id="senha" 
                                            name="senha" 
                                            value={usuario.senha}
                                            onChange={escreveu}
                                            required 
                                        />
                                    </FloatingLabel>
                                    <Form.Control.Feedback type="invalid">Informe a senha!</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Button type="submit" variant="primary">Cadastrar</Button>
                            </Col>
                            <Col md={6} className="d-flex justify-content-end">
                                <Button type="button" variant="secondary" as={Link} to="/">Voltar</Button>
                 
                            </Col>
                        </Row>
                    </Form>
                </Col>

                {/* Exibição da lista de usuários cadastrados */}
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
                                    <strong>ID:</strong>{usuario.id} |
                                    <strong>Nickname:</strong> {usuario.nickname} | 
                                    <strong> Data de Ingresso:</strong> {usuario.dataIngresso}
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    )}
                </Col>
            </Row>
        </Container>
    );
}

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Estado from "../Estados/estado";
const urlBase = "http://localhost:3000/usuario";

// Função para obter usuários
export const getUsuarios = createAsyncThunk('getUsuarios', async () => {
    try {
        const resposta = await fetch(urlBase, { method: "GET" });
        const response = await resposta.json();
        if (response.status) {
            return {
                status: response.status,
                listaUsuarios: response.listaUsuarios
            };
        } else {
            return {
                status: response.status,
                listaUsuarios: []
            };
        }
    } catch (erro) {
        return {
            status: false,
            listaUsuarios: []
        };
    }
});

// Função para cadastrar usuário
export const cadastrarUsuario = createAsyncThunk('cadastrarUsuario', async (usuario) => {
    try {
        const resposta = await fetch(urlBase, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(usuario)
        });
        const response = await resposta.json();
        if (response.status) {
            return {
                status: response.status,
                usuario: usuario,
                mensagem: response.mensagem
            };
        } else {
            return {
                status: response.status,
                mensagem: response.mensagem
            };
        }
    } catch (erro) {
        return {
            status: false,
            mensagem: "Não foi possível cadastrar o usuario: " + erro.message
        };
    }
});

export const cadastrarMensagem = createAsyncThunk('cadastrarMensagem', async (usuario) => {
    try {
        const resposta = await fetch(urlBase, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(usuario)
        });
        const response = await resposta.json();
        if (response.status){
            return {
                status: response.status,
                mensagem: response.mensagem
            }
        }
        else{
            return {
                status: response.status,
                mensagem: response.mensagem
            }
        }
    }
    catch (erro) {
        return {
            status: false,
            mensagem: "Não foi possível cadastrar mensagem: " + erro.message
        }
    }
});

export const excluirUsuario = createAsyncThunk('excluirUsuario', async (usuario) => {
    try {
        const resposta = await fetch(urlBase, {
            method: "DELETE",  // Manter o método DELETE
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: usuario.id,  // Passando o id no corpo da requisição
                senha: usuario.senha  // Passando a senha no corpo
            })
        });

        // Verificar se a resposta do servidor é JSON
        const contentType = resposta.headers.get("Content-Type");

        if (!contentType || !contentType.includes("application/json")) {
            const text = await resposta.text();
            throw new Error(`Resposta do servidor não é um JSON válido. Corpo da resposta: ${text}`);
        }

        // Parse da resposta JSON
        const response = await resposta.json();
        if (response.status) {
            return {
                status: response.status,
                id: usuario.id,
                mensagem: response.mensagem
            };
        } else {
            return {
                status: response.status,
                mensagem: response.mensagem
            };
        }
    } catch (erro) {
        return {
            status: false,
            mensagem: "Não foi possível excluir o usuário: " + erro.message
        };
    }
});


export const alterarUsuario = createAsyncThunk('alterarUsuario', async (usuario) => {
    try {
        // Separar a senha do restante dos dados do usuário
        const { senha, ...usuarioSemSenha } = usuario;

        // Criar o payload com os dados permitidos e a senha para validação
        const payload = {
            ...usuarioSemSenha,
            senha,
        };

        // Fazer a requisição ao backend
        const resposta = await fetch(`${urlBase}/${usuario.id}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload),
        });

        // Tratar a resposta
        if (!resposta.ok) {
            throw new Error(`Erro HTTP: ${resposta.status}`);
        }

        const response = await resposta.json();

        // Verificar a estrutura do JSON retornado
        if (response.status) {
            return {
                status: response.status,
                usuario: response.usuario,
                mensagem: response.mensagem
            };
        } else {
            return {
                status: false,
                mensagem: response.mensagem
            };
        }
    } catch (erro) {
        // Capturar e retornar erros da requisição
        return {
            status: false,
            mensagem: "Não foi possível alterar o usuário: " + erro.message
        };
    }
});
const estadoInicial = {
    estado: Estado.OCIOSO,
    mensagem: "",
    usuarios: []
};

const usuarioslice = createSlice({
    name: 'usuario',
    initialState: estadoInicial,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getUsuarios.pending, (state, action) => {
                state.estado = Estado.PENDENTE;
                state.mensagem = 'Buscando usuarios...';
            })
            .addCase(getUsuarios.fulfilled, (state, action) => {
                if (action.payload.status) {
                    state.estado = Estado.OCIOSO;
                    state.mensagem = "Usuarios recuperados do backend!";
                    state.usuarios = action.payload.listaUsuarios;
                } else {
                    state.estado = Estado.ERRO;
                    state.mensagem = action.payload.mensagem;
                    state.usuarios = [];
                }
            })
            .addCase(getUsuarios.rejected, (state, action) => {
                state.estado = Estado.ERRO;
                state.mensagem = action.payload.mensagem;
                state.usuarios = [];
            })
            .addCase(cadastrarUsuario.pending, (state, action) => {
                state.estado = Estado.PENDENTE;
                state.mensagem = 'Processando a requisição...';
            })
            .addCase(cadastrarUsuario.fulfilled, (state, action) => {
                if (action.payload.status) {
                    state.estado = Estado.OCIOSO;
                    state.mensagem = action.payload.mensagem;
                    state.usuarios.push(action.payload.usuario);
                } else {
                    state.estado = Estado.ERRO;
                    state.mensagem = action.payload.mensagem;
                }
            })
            .addCase(cadastrarUsuario.rejected, (state, action) => {
                state.estado = Estado.ERRO;
                state.mensagem = action.payload.mensagem;
            })
            .addCase(cadastrarMensagem.pending, (state, action) => {
                state.estado = Estado.PENDENTE;
                state.mensagem = 'Processando a requisição...';
            })
            .addCase(cadastrarMensagem.fulfilled, (state, action) => {
                if (action.payload.status) {
                    state.estado = Estado.OCIOSO;
                    state.mensagem = action.payload.mensagem;
                } else {
                    state.estado = Estado.ERRO;
                    state.mensagem = action.payload.mensagem;
                }
            })
            .addCase(cadastrarMensagem.rejected, (state, action) => {
                state.estado = Estado.ERRO;
                state.mensagem = action.payload.mensagem;
            })
            // Adicionando a lógica para o caso de exclusão do usuário
            .addCase(excluirUsuario.pending, (state, action) => {
                state.estado = Estado.PENDENTE;
                state.mensagem = 'Excluindo usuário...';
            })
            .addCase(excluirUsuario.fulfilled, (state, action) => {
                if (action.payload.status) {
                    state.estado = Estado.OCIOSO;
                    state.mensagem = action.payload.mensagem;
                    state.usuarios = state.usuarios.filter(usuario => usuario.id !== action.payload.id);
                } else {
                    state.estado = Estado.ERRO;
                    state.mensagem = action.payload.mensagem;
                }
            })
            .addCase(excluirUsuario.rejected, (state, action) => {
                state.estado = Estado.ERRO;
                state.mensagem = action.payload.mensagem;
            })
            .addCase(alterarUsuario.pending, (state, action) => {
                state.estado = Estado.PENDENTE;
                state.mensagem = 'Alterando usuário...';
            })
            .addCase(alterarUsuario.fulfilled, (state, action) => {
                if (action.payload.status) {
                    state.estado = Estado.OCIOSO;
                    state.mensagem = action.payload.mensagem;
                    // Atualize o usuário na lista de usuários
                    const index = state.usuarios.findIndex(usuario => usuario.id === action.payload.usuario.id);
                    if (index !== -1) {
                        state.usuarios[index] = action.payload.usuario;
                    }
                } else {
                    state.estado = Estado.ERRO;
                    state.mensagem = action.payload.mensagem;
                }
            })
            .addCase(alterarUsuario.rejected, (state, action) => {
                state.estado = Estado.ERRO;
                state.mensagem = action.payload.mensagem;
            });
    }
});

export default usuarioslice.reducer;

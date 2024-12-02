import { BrowserRouter, Routes, Route } from "react-router-dom";
import CadastroUsuario from "./Telas/CadastroUsuario";
import ExcluirAlterarUsuario from "./Telas/ExcluirAlterarUsuario";
import BatePapoTela from "./Telas/BatePapoTela";
import Home from "./Telas/Home";
import store from "./redux/store";
import { Provider } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
function App() {
  return (
    <div className="App">
      <Provider store={store}>
      <BrowserRouter>
        <Routes>
          {
          }
        
          <Route path="/batepapogeral" element={<BatePapoTela />} />
          <Route path="/usuario" element={<CadastroUsuario />} />
          <Route path="/usuarioExcluirAlterar" element={<ExcluirAlterarUsuario />} />
          <Route path="/" element={<Home />} />
          {
          }
        </Routes>
      </BrowserRouter>
      </Provider>
     <ToastContainer/>
    </div>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import Pagina from "../templates/Pagina";

export default function Home(props) {
 
  return (
    <Pagina>
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <h1>Bem-vindo!</h1>
        <p>Estamos felizes em tê-lo de volta. Explore as funcionalidades do site.</p>
        <p>Confira as últimas atualizações no menu de navegação.</p>
      </div>
    </Pagina>
  );
}

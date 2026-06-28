# SpaceCandy - Front-End

Aplicativo de e-commerce construído com **React Native (Expo)**. Este aplicativo consome a API de microsserviços do SpaceCandy.

## Como rodar o projeto

1. Abra um terminal na pasta `SpaceCandy`.
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Configure o IP da API:
   - O aplicativo foi configurado para bater na URL `http://10.0.2.2:8765`, que é o alias de rede que o Emulador Android usa para acessar o `localhost` da sua máquina host. 
   - Se for rodar num dispositivo físico, altere a variável `API_URL` dentro de `src/services/api.js` para o IP da sua rede local (ex: `http://192.168.0.10:8765`).

4. Inicie o Expo:
   ```bash
   npx expo start
   ```
5. Pressione `a` para abrir no Emulador Android, ou escaneie o QR Code usando o aplicativo **Expo Go**.

## Telas e Funcionalidades
- **Autenticação:** Telas de Login e Registro.
- **Loja:** Catálogo de doces consumidos via API, com preços dinâmicos.
- **Carrinho e Checkout:** Finalização de compra.
- **Histórico:** Visualização de comprovantes passados.
- **Área Admin:** Manutenção de catálogo e estoque para usuários com privilégio de administrador.

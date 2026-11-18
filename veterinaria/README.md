# CoffeeHouse frontend

Frontend Angular de la cafetería. Todos los datos visibles se consultan desde
la API Node.js en `/api`; el proxy local se configura en `proxy.conf.json`.

## Desarrollo

Inicia primero el backend y después, desde esta carpeta, ejecuta:

```powershell
npm install
npm start
```

Abre `http://localhost:4200`. El comando `npm start` ya activa el proxy hacia
`http://127.0.0.1:3000`. El contenido se vuelve a consultar cada cinco
segundos.

## Verificación

```powershell
npm test
npm run build
```

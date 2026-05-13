# Frontend da Camisa da Sede

Este projeto agora deve chamar um backend separado.

## Variáveis de ambiente

Crie um `.env` local a partir do `.env.example`:

```env
VITE_API_URL=http://localhost:3002
```

Em produção no Netlify, configure:

```env
VITE_API_URL=https://backend-da-camisa-sede.onrender.com
```

## Rodar local

```bash
npm install
npm run dev
```

## Observações

- O frontend não consulta diretamente o MongoDB.
- O frontend não deve ter `UMADRUR_API_TOKEN`.
- A consulta CPF passa pelo backend da camisa da Sede.
- O backend da camisa é quem conversa com o sistema de cadastro da UMADRUR.

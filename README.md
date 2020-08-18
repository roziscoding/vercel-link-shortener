Vercel Link Shortener
---

Criado ao vivo em https://twitch.tv/roziscoding

Par de funções serverless que funciona com o [Vercel](https://vercel.com) para criar um encurtador de URLs e um bot para gerenciar as URLs encurtadas

## Variáveis de ambiente

- `NOTFOUND_URL`: URL a ser utilizada caso um link com aquele shortcode não seja encontrado
- `DB_NAME`: Nome do banco de dados onde os links serão armazenados
- `DB_URI`: String de conexão com o MongoDB
- `TELEGRAM_TOKEN`: Token do chatbot no Telegram (obtenha um com o [@botfather](t.me/botfather))
- `ADMIN_ID`: Seu ID no Telegram. O bot só responderá a pessoa dona desse ID. Deixe em branco caso queira que ele responda qualquer pessoa
- `SHORT_URL_PREFIX`: Prefixo / domínio das URLs geradas, incluindo o protocolo

## Deploy

Clique no botão para fazer deploy com o Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/import/git?s=https%3A%2F%2Fgithub.com%2Froziscoding%2Fvercel-link-shortener&env=NOTFOUND_URL,DB_NAME,DB_URI,TELEGRAM_TOKEN,ADMIN_ID,SHORT_URL_PREFIX&project-name=vercel-link-shortener&repo-name=vercel-link-shortener)
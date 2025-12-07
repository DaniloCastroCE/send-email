import path from "path";
const __dirname = path.resolve();

export const home = (req, res) => {
  return res.sendFile(path.join(__dirname, "public", "html", "index.html"));
};

export const help = (req, res) => {
  return res.status(200).json({
    status: "success",
    message:
      "Bem-vindo à API de envio de e-mails. Abaixo estão as instruções sobre como utilizar a rota '/send-email'.",
    usage: {
      endpoint: "/send-email",
      method: "POST",
      description:
        "Esta rota permite enviar um e-mail, podendo incluir um corpo com texto HTML (como rich text ou imagens) e arquivos anexados.",
      request_body: {
        from: "Endereço de e-mail do remetente (obrigatório)",
        password:
          "Senha do e-mail do remetente ou senha de aplicativo (obrigatório)",
        to: "Endereço de e-mail do destinatário (obrigatório)",
        subject: "Assunto do e-mail",
        body: "Corpo do e-mail, podendo ser HTML (obrigatório). Caso queira enviar imagens, cole-as diretamente na área de edição. O conteúdo será convertido automaticamente em base64 e enviado no corpo do e-mail.",
        host: "Servidor SMTP (opcional, se não fornecido, o valor padrão será 'mail.locktec.com.br')",
        files:
          "Arquivos adicionais para anexar ao e-mail (opcional). Envie imagens ou outros tipos de arquivos com o nome 'files'.",
      },
      response: {
        status: "success",
        message: "Email enviado com sucesso",
        info: "Informações sobre o envio, como o ID da mensagem.",
        error: "Mensagem de erro em caso de falha, incluindo detalhes do erro.",
      },
      example_request: {
        from: "exemplo@dominio.com",
        password: "senha_de_app_123",
        to: "destinatario@dominio.com",
        subject: "Assunto do e-mail",
        body: "<h1>Este é um e-mail de teste</h1><p>Com conteúdo HTML e <img src='data:image/png;base64,...' /> embutido.</p>",
        host: "smtp.dominio.com",
        files: [
          {
            filename: "image.png",
            content: "base64encodedstring",
          },
        ],
      },
      error_handling: {
        400: "Se algum campo obrigatório não for enviado ou se o corpo do e-mail não for um conteúdo válido, a resposta será '400 Bad Request'.",
        500: "Se ocorrer um erro interno no servidor, a resposta será '500 Internal Server Error'.",
      },
    },
    author: {
      nome: "Danilo de Castro",
      email: "danilocastroce01@gmail.com",
      github: "https://github.com/DaniloCastroCE",
    },
  });
};


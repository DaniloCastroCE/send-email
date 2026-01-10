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
        name: "Nome do usuário de email rementente.",
        from: "Endereço de e-mail do remetente (obrigatório)",
        password:
          "Senha do e-mail do remetente ou senha de aplicativo (obrigatório)",
        to: "Endereço de e-mail do destinatário (obrigatório)",
        subject: "Assunto do e-mail",
        body: "Corpo do e-mail, podendo ser HTML (obrigatório). Caso queira enviar imagens, cole-as diretamente na área de edição. O conteúdo será convertido automaticamente em base64 e enviado no corpo do e-mail.",
        host: "Servidor SMTP (opcional, se não fornecido o padrão será 'mail.locktec.com.br')",
        files:
          "Arquivos adicionais para anexar ao e-mail (opcional). Envie imagens ou outros tipos de arquivos com o nome 'files'.",
      },

      response: {
        status: "success",
        message: "Email enviado com sucesso",
        info: "Informações sobre o envio, como o ID da mensagem.",
        error: "Mensagem de erro em caso de falha, incluindo detalhes.",
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
        400: "Erro de requisição — campos obrigatórios ausentes ou corpo inválido.",
        500: "Erro interno do servidor.",
      },
    },

    repository: {
      link: "https://github.com/DaniloCastroCE/send-email",
      front_end_exemple:
        "O arquivo de exemplo está no repositório, na pasta public/html/exemplo.html",
    },

    author: {
      nome: "Danilo de Castro",
      email: "danilocastroce01@gmail.com",
      github: "https://github.com/DaniloCastroCE",
    },
  });
};




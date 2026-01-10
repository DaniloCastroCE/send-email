import nodemailer from "nodemailer";
import { getDateSimple } from "../../utils/getDate.js";

/**
 * Função para enviar um e-mail com suporte a anexos (imagens embutidas) usando o Nodemailer.
 * 
 * @param {import("express").Request} req - O objeto de requisição contendo os dados do e-mail a ser enviado.
 * @param {import("express").Response} res - O objeto de resposta para retornar a resposta ao cliente.
 * 
 * A função espera que o corpo da requisição contenha os seguintes campos:
 * - from: Endereço de e-mail do remetente.
 * - password: Senha do e-mail do remetente (preferencialmente uma senha de app, e não a senha da conta diretamente).
 * - to: Endereço de e-mail do destinatário.
 * - subject: Assunto do e-mail.
 * - body: Corpo do e-mail (pode ser HTML).
 * - host (opcional): Servidor SMTP do qual o e-mail será enviado. Se não fornecido, o padrão será "mail.locktec.com.br".
 * 
 * Retorna uma resposta JSON com o status da operação (sucesso ou erro).
 */
export const sendEmail = async (req, res) => {
  // Extrai os dados do corpo da requisição (incluindo arquivos enviados)
  let { name, from, password, to, subject, body, host } = req.body;
  const files = req.files || [];  // Caso haja arquivos (imagens) anexados

  // Valida se todos os campos obrigatórios estão presentes na requisição
  if (!from || !password || !to || !body) {
    return res.status(400).json({
      status: "error",
      message: "Os campos FROM, PASSWORD, TO E BODY são obrigatórios",
    });
  }

  try {
    // Se o host não for informado, usa-se o valor padrão para o servidor SMTP da Locktec
    if (!host || host.trim() === "") host = "mail.locktec.com.br";

    // Configuração do transporte SMTP para enviar e-mails com o Nodemailer
    const transporter = nodemailer.createTransport({
      host: host,               // Endereço do servidor SMTP
      port: 587,                // Porta SMTP para envio (587 é para STARTTLS)
      secure: false,            // Não utilizamos SSL direto, mas o STARTTLS para segurança
      auth: {
        user: from,             // E-mail do remetente (usuário)
        pass: password,         // Senha do remetente (senha de app recomendada)
      },
      tls: {
        rejectUnauthorized: false, // Ignora erros de certificado SSL (útil para servidores de teste)
      },
    });

    // Cria os anexos das imagens, utilizando a propriedade `cid` para referenciá-las no HTML
    const attachments = files.map((file, index) => ({
      filename: file.originalname,  // Nome do arquivo original
      content: file.buffer,         // Conteúdo do arquivo como buffer
      cid: `image${index}@email.com`,  // ID único (CID) para cada imagem, usado para referência no corpo HTML
    }));

    // O corpo do e-mail será o texto fornecido, que pode incluir tags HTML (exemplo: <img src="cid:image0">)
    let htmlBody = body;

    // Substitui as referências de imagens no corpo HTML (como 'cid:image0') pelos CIDs completos
    attachments.forEach((attachment, index) => {
      htmlBody = htmlBody.replace(
        new RegExp(`cid:image${index}`, 'g'),  // Substitui todas as ocorrências de 'cid:imageX' no corpo do e-mail
        `cid:${attachment.cid}`               // Referência completa com o CID
      );
    });

    let sendFromName = null
    if(name) {
      sendFromName = `"${name}" <${from}>;`
    }
    
    // Envio do e-mail com o corpo HTML e os anexos (imagens embutidas)
    const info = await transporter.sendMail({
      from,        // E-mail do remetente
      to,          // E-mail do destinatário
      subject,     // Assunto do e-mail
      text: body,  // Corpo do e-mail em texto simples (caso o destinatário não suporte HTML)
      html: htmlBody,  // Corpo do e-mail com HTML (inclui imagens embutidas)
      attachments,  // Anexos (imagens embutidas no e-mail)
    });

    // Retorna uma resposta de sucesso com informações sobre o envio do e-mail
    console.log(`\n\n - ${getDateSimple()} - \nEmail enviado com sucesso!\nDe: ${info.envelope.from}\nPara: ${info.envelope.to}\n - - - - - - - - - - - -\n`);
    
    return res.status(200).json({
      status: "success",
      message: "Email enviado com sucesso",  // Mensagem de sucesso
      info,  // Informações adicionais sobre o envio (ex: ID da mensagem)
    });
  } catch (err) {
    // Em caso de erro, retorna uma resposta com código 500 (erro interno do servidor)
    //console.error("Erro interno:", err);  // Log do erro para depuração
    return res.status(500).json({
      status: "error",
      message: "Erro interno",  // Mensagem genérica para o usuário
      error: err.message,       // Detalhes do erro para depuração (não recomendado expor em produção)
    });
  }
};

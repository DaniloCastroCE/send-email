// Função para mostrar ou ocultar o indicador de "loading"
const func_loading = () => {
  const loading = document.querySelector(".loading");
  loading.classList.toggle("show");
}

// Função para lidar com o paste de imagens na área de edição
const handlePaste = async (event) => {
  // Impede o comportamento padrão do paste (que pode causar colagem dupla)
  event.preventDefault();

  const clipboardItems = event.clipboardData.items;
  for (let i = 0; i < clipboardItems.length; i++) {
    const item = clipboardItems[i];
    if (item.type.indexOf("image") === 0) {
      const blob = item.getAsFile();
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result;
        const imgElement = document.createElement("img");
        imgElement.src = base64data;  // Definindo a imagem com base64
        document.getElementById("body").appendChild(imgElement);  // Adicionando a imagem à div de edição
      };
      reader.readAsDataURL(blob);
    }
  }
};

// Adiciona um ouvinte para o evento de "paste" na área de edição
document.getElementById("body").addEventListener("paste", handlePaste);

const form = document.getElementById("form");
const submitButton = form.querySelector('button[type="submit"]');
const bodyEditor = document.getElementById("body");  // A div com contenteditable

if (!form._isListener) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();  // Impede o envio normal do formulário
    func_loading();      // Mostra a animação de "loading"
    submitButton.disabled = true;  // Desabilita o botão de envio para evitar múltiplos envios

    const formData = new FormData(form);  // Pega os dados do formulário
    const data = Object.fromEntries(formData.entries());  // Converte para um objeto JSON

    // Obtém o conteúdo HTML da div com contenteditable e adiciona ao objeto data
    const bodyContent = bodyEditor.innerHTML;
    data.body = bodyContent;

    const tentativas = 3;
    for (let i = 0; i <= tentativas; i++) {
      try {
        // Envia os dados para o servidor
        const response = await fetch("/send-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        // Processa a resposta do servidor
        const result = await response.json();

        if (result.status === "success") {
          alert("Email enviado com sucesso!");
          console.log("Email enviado com sucesso:", result.info)
          form.reset();  // Limpa o formulário (inputs)
          bodyEditor.innerHTML = '';  // Limpa o conteúdo da área de edição (div)
          submitButton.disabled = false;  // Habilita o botão de envio novamente
          break; // Sai do loop se o envio for bem-sucedido
        } else {
          if (i < tentativas) {
            console.warn(`Erro ao enviar email: ${result.message}.\n(${i+1}) Tentando novamente...`);
            await new Promise(resolve => setTimeout(resolve, 3000));
          } else {
            alert(`Erro ao enviar email!\nVerificar se todos os campos obrigatorios estão preenchidos corretamente e tente novamente.\n\nCampos Obrigatorios: DE, SENHA, PARA e MENSAGEM`);
            submitButton.disabled = false; 
            break;
          }
        }
      } catch (err) {
        if (i < tentativas) {
          console.error("Erro Interno, tentativa " + i + ": ", err);
          await new Promise(resolve => setTimeout(resolve, 3000));
        } else {
          console.error("Erro após todas as tentativas: ", err);
          alert("Ocorreu um erro inesperado após todas as tentativas.");
          submitButton.disabled = false;  
          break;
        }
      }      
    }
    
    func_loading(); 
  });

  form._isListener = true;  
}
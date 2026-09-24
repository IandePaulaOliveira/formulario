
// Gabarito: pergunta -> alternativa correta
const gabarito = {
  p1: "B",  // <br>
  p2: "C",  // src
  p3: "B",  // <ol>
  p4: "B",  // #
  p5: "C",  // font-family
  p6: "A",  // font-weight: bold;
  p7: "C",  // // Comentário
  p8: "D",  // Array
  p9: "B",  // Function
  p10: "A"  // alert()
};
 
const form = document.getElementById("Quiz");
 
// Cria (uma vez) a área onde o resultado aparece na tela
let resultadoEl = document.getElementById("resultado");
if (!resultadoEl) {
  resultadoEl = document.createElement("p");
  resultadoEl.id = "resultado";
  resultadoEl.style.fontWeight = "bold";
  resultadoEl.style.marginTop = "16px";
  form.appendChild(resultadoEl);
}
 
form.addEventListener("submit", function (evento) {
  evento.preventDefault();
 
  const nome = document.getElementById("nome").value.trim();
  const data = document.getElementById("data").value;
 
  if (!nome) {
    alert("Digite seu nome antes de enviar.");
    return;
  }
 
  let acertos = 0;
  const total = Object.keys(gabarito).length;
  const naoRespondidas = [];
  const linhas = [];
 
  for (const pergunta in gabarito) {
    const numero = pergunta.replace("p", "");
    const marcada = form.querySelector(`input[name="${pergunta}"]:checked`);
    const resposta = marcada ? marcada.value : null;
 
    if (!resposta) {
      naoRespondidas.push(numero);
    }
 
    const correta = resposta === gabarito[pergunta];
    if (correta) acertos++;
 
    linhas.push(
      `Pergunta ${numero}: resposta = ${resposta ?? "(em branco)"} | ` +
      `correta = ${gabarito[pergunta]} | ${correta ? "ACERTOU" : "ERROU"}`
    );
  }
 
  if (naoRespondidas.length > 0) {
    alert("Responda todas as perguntas. Faltam: " + naoRespondidas.join(", "));
    return;
  }
 
  const nota = (acertos / total) * 10;
  const mensagem =
    `${nome}, você acertou ${acertos} de ${total} perguntas. ` +
    `Sua nota é ${nota.toFixed(1).replace(".", ",")}.`;
 
  // 1. Mostra na tela
  resultadoEl.textContent = mensagem;
 
  // 2. Fala o resultado
  falar(mensagem);
 
  // 3. Salva as respostas em um arquivo .txt
  const conteudo =
    `Nome: ${nome}\n` +
    `Data: ${data || "(não informada)"}\n` +
    `----------------------------------------\n` +
    linhas.join("\n") +
    `\n----------------------------------------\n` +
    `Acertos: ${acertos}/${total}\n` +
    `Nota: ${nota.toFixed(1)}\n`;
 
  baixarTxt(conteudo, `resultado_${nome.replace(/\s+/g, "_")}.txt`);
});
 
function falar(texto) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const fala = new SpeechSynthesisUtterance(texto);
  fala.lang = "pt-BR";
  window.speechSynthesis.speak(fala);
}
 
function baixarTxt(conteudo, nomeArquivo) {
  const blob = new Blob([conteudo], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = nomeArquivo;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
 
function talk() {
    // Initialisez la synthèse vocale
    const synth = window.speechSynthesis;
  
    // Questions prédéfinies pour la démonstration
    const responses = {
      "bonjour": "Bonjour, comment puis-je vous aider ?",
      "présence": "Votre enfant est marqué présent aujourd'hui.",
      "retard": "Votre enfant a été en retard à 8h15.",
      "comportement": "Votre enfant a montré un comportement positif en classe aujourd'hui.",
      "au revoir": "Au revoir, passez une excellente journée !"
    };
  
    // Utilisez Web Speech API pour recevoir une entrée vocale
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "fr-FR";
  
    recognition.onstart = () => {
      document.getElementById("response").textContent = "Écoute en cours...";
    };
  
    recognition.onresult = (event) => {
      const userMessage = event.results[0][0].transcript.toLowerCase();
      document.getElementById("response").textContent = `Vous avez dit : "${userMessage}"`;
  
      // Réponse de l'assistant
      const reply = responses[userMessage] || "Je ne comprends pas votre question.";
      const utterance = new SpeechSynthesisUtterance(reply);
      synth.speak(utterance);
  
      // Affiche la réponse
      document.getElementById("response").textContent = reply;
    };
  
    recognition.start();
  }
const startBtn = document.getElementById('start-btn');
const messagesDiv = document.getElementById('messages');
const introText = document.getElementById('intro-text');

// Simuler une base de données des parents et des élèves
const parents = [
    {
        numero: "0601020304",
        nom: "Mme ATHON",
        enfant: { nom: "Maxime", statut: "présent aujourd'hui" }
    },
    {
        numero: "0605060708",
        nom: "M. Durand",
        enfant: { nom: "Paul Durand", statut: "absent aujourd'hui" }
    },
    {
        numero: "0611121314",
        nom: "Mme Curie",
        enfant: { nom: "Marie Curie", statut: "en retard ce matin" }
    }
];

// Simuler le numéro de téléphone du parent qui "appelle"
const numeroAppelant = "0601020304"; // Changez ce numéro pour tester différents parents

// Trouver le parent correspondant au numéro
const parentActuel = parents.find(parent => parent.numero === numeroAppelant);

// Initialisation de l'API Web Speech
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = 'fr-FR';

const synth = window.speechSynthesis;

// Fonction pour afficher un message dans le chatbox
function addMessage(text, sender = 'bot') {
    const message = document.createElement('div');
    message.textContent = sender === 'bot' ? `Assistant: ${text}` : `Vous: ${text}`;
    message.className = sender;
    messagesDiv.appendChild(message);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Fonction pour faire parler l'assistant
function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    synth.speak(utterance);
}

// Message de bienvenue vocal au chargement de la page
window.onload = () => {
    if (parentActuel) {
        const welcomeMessage = `Bonjour ${parentActuel.nom}, bienvenue sur le portail de gestion de l'école. Comment puis-je vous aider concernant votre enfant, ${parentActuel.enfant.nom} ?`;
        addMessage(welcomeMessage, 'bot');
        speak(welcomeMessage);
    } else {
        const errorMessage = "Numéro inconnu. Veuillez vérifier votre numéro ou contacter l'administration.";
        addMessage(errorMessage, 'bot');
        speak(errorMessage);
    }
};

// Gestion de la reconnaissance vocale
recognition.onresult = (event) => {
    const userSpeech = event.results[0][0].transcript.toLowerCase();
    addMessage(userSpeech, 'user');

    let response = "Je ne suis pas sûr de comprendre. Pouvez-vous répéter ?";
    if (parentActuel) {
        if (userSpeech.includes("mon enfant") || userSpeech.includes(parentActuel.enfant.nom.toLowerCase())) {
            response = `${parentActuel.enfant.nom} est ${parentActuel.enfant.statut}.`;
        } else if (userSpeech.includes("merci")) {
            response = "Avec plaisir ! Je suis là pour vous aider.";
        } else if (userSpeech.includes("au revoir")) {
            response = "Au revoir ! Merci de nous avoir contactés.";
        }
    } else {
        response = "Je ne peux pas vous identifier. Veuillez contacter l'administration.";
    }

    addMessage(response, 'bot');
    speak(response);
};

recognition.onerror = (event) => {
    addMessage("Erreur lors de la reconnaissance vocale : " + event.error, 'bot');
};

startBtn.addEventListener('click', () => {
    if (parentActuel) {
        addMessage("Démarrage de la reconnaissance vocale...", 'bot');
        recognition.start();
    } else {
        const errorMessage = "Impossible de démarrer la reconnaissance vocale. Numéro inconnu.";
        addMessage(errorMessage, 'bot');
        speak(errorMessage);
    }
});

// Animation d'introduction
let introMessage = "Bienvenue dans l'Assistant de Gestion d'École";
let index = 0;

function typeEffect() {
    if (index < introMessage.length) {
        introText.textContent += introMessage[index];
        index++;
        setTimeout(typeEffect, 100);
    }
}

typeEffect();

const audio = new Audio('background.mp3');
audio.loop = true;
audio.volume = 0.2;
audio.play();
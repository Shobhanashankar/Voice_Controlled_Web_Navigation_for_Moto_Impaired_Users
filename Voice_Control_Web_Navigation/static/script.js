// script.js

document.getElementById("start-button").addEventListener("click", () => {
  fetch("/get-speech-token")
    .then(res => res.json())
    .then(data => {
      const speechConfig = SpeechSDK.SpeechConfig.fromAuthorizationToken(data.token, data.region);
      speechConfig.speechRecognitionLanguage = "en-US";

      const audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
      const recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);

      updateStatus(" Listening...");

      recognizer.recognizeOnceAsync(result => {
        const command = result.text.toLowerCase().replace(/\./g, "").trim();
        updateStatus(` Heard: "${command}"`);
        handleCommand(command);
        recognizer.close();
      });
    })
    .catch(() => updateStatus(" Unable to fetch speech token"));
});

function handleCommand(command) {
  if (command.includes("scroll down")) {
    window.scrollBy({ top: 300, behavior: "smooth" });
    speak("Scrolling down");

  } else if (command.includes("scroll up")) {
    window.scrollBy({ top: -300, behavior: "smooth" });
    speak("Scrolling up");

  } else if (command.includes("click menu")) {
    document.getElementById("menu")?.click();
    speak("Menu opened");

  } else if (command.includes("go to contact")) {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
    speak("Navigating to contact section");

  } else if (command.startsWith("search for")) {
    const term = command.replace("search for", "").trim();
    document.getElementById("search").value = term;
    document.getElementById("search").focus();
    speak(`Searching for ${term}`);

  } else if (command.includes("go home")) {
    window.scrollTo({ top: 0, behavior: "smooth" });
    speak("Returning to top of the page");

  } else if (command.includes("increase text size")) {
    document.body.style.fontSize = "larger";
    speak("Text size increased");

  } else if (command.includes("decrease text size")) {
    document.body.style.fontSize = "smaller";
    speak("Text size decreased");

  } else if (command.includes("highlight links")) {
    document.querySelectorAll("a").forEach(a => a.style.backgroundColor = "yellow");
    speak("Links highlighted");

  } else if (command.includes("dark mode")) {
    document.body.style.backgroundColor = "#121212";
    document.body.style.color = "#ffffff";
    speak("Dark mode activated");

  } else if (command.includes("read page")) {
    speak(document.body.innerText.slice(0, 500));  // reads first 500 chars for demo

  } else if (command.includes("open help")) {
    alert("Voice Commands:\n- Scroll up/down\n- Search for X\n- Go to contact\n- Dark mode\n- Increase text size\n- Read page");
    speak("Help opened");

  } else {
    updateStatus("Command not recognized.");
    speak("Sorry, I didn't understand that.");
  }
}

function updateStatus(message) {
  document.getElementById("status").innerText = message;
}

function speak(text) {
  if ('speechSynthesis' in window) {
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "en-US";
    window.speechSynthesis.speak(utter);
  }
}

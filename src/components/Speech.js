export const speakText = (text) => {
    if ('speechSynthesis' in window) {
        const synth = window.speechSynthesis;

        const utterThis = (chunk) => {
            const utterance = new SpeechSynthesisUtterance(chunk);
            utterance.rate = 1.12; // Adjust the rate to make the speech faster

            const setVoice = () => {
                const voices = synth.getVoices();
                const femaleVoice = voices.find(voice => 
                    voice.name.includes("Google UK English Female") || 
                    voice.name.includes("Google US English Female") || 
                    voice.name.includes("Microsoft Zira Desktop") || 
                    voice.gender === "female"
                );

                if (femaleVoice) {
                    utterance.voice = femaleVoice;
                    synth.speak(utterance);
                }
            };

            // If voices are already loaded, set the voice immediately
            if (synth.getVoices().length !== 0) {
                setVoice();
            } else {
                // Otherwise, wait for voices to be loaded
                const voiceInterval = setInterval(() => {
                    if (synth.getVoices().length !== 0) {
                        setVoice();
                        clearInterval(voiceInterval);
                    }
                }, 10);
            }
        };

        // Split text into chunks
        const chunks = text.match(/[^.!?]+[.!?]+|[^.!?]+/g) || [text];
        chunks.forEach(chunk => utterThis(chunk));
    } else {
        console.warn('Speech Synthesis API is not supported in this browser.');
    }
};

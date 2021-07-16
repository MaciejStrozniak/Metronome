
import Timer from "./app/JS/timer.js";

// ----------------------- Deklaracja klasy -------------------------------------

class Tempo {
    constructor(tempoTextElement) {
        this.tempoTextElement = tempoTextElement;
        this.metronomeStartSetup();
    }

    metronomeStartSetup() {
        this.classTempo = 100;
    }

    changeTempoUp() {
        if (this.classTempo >= 300) return;
        this.classTempo++;
    }

    changeTempoDown() {
        if (this.classTempo <= 30) return;
        this.classTempo--;
    }

    changeTempoFiveUp() {
        if (this.classTempo >= 295) {
            let missingValue = this.classTempo - 300;
            this.classTempo = this.classTempo - missingValue;
        } else this.classTempo += 5;
    }

    changeTempoFiveDown() {
        if (this.classTempo <= 35) {
            let missingValue = this.classTempo - 30;
            this.classTempo = this.classTempo - missingValue;
        } else this.classTempo -= 5;
    }

    sliderTempoUpdate() {
        tempoSlider.value = this.classTempo;
        if (isNaN(tempoSlider.value))
            parseFloat(tempoSlider.value);
    }

    updateDisplay() {
        this.tempoTextElement.innerText = this.classTempo;
    }

}

// ---------------------- stworzenie AudioContext ----------------

const audioContext = new AudioContext();
// buffer definiuje czas trwania dźwięku
const buffer = audioContext.createBuffer(
    1, audioContext.sampleRate * 0.01, audioContext.sampleRate
);
// czytanie danych z kanałów stworzonych w buffer
const channelData = buffer.getChannelData(0); // 0 odpowiada pierwszemu kanałowi

// WHITE NOISE
for (let i = 0; i < buffer.length; i++) {
    channelData[i] = Math.random() * 2 - 1;
}

const masterVolume = audioContext.createGain();
masterVolume.gain.setValueAtTime(0.5, 0);

masterVolume.connect(audioContext.destination); // podpięcie całości do master

// WHITE NOISE FILTER
const whiteNoiseFilter = audioContext.createBiquadFilter();
whiteNoiseFilter.type = 'lowpass';
whiteNoiseFilter.frequency.value = 3000;
whiteNoiseFilter.connect(masterVolume);

//const audioContext = new AudioContext;
// let audio;

// fetch("./samples/click.mp3")
//     .then(data => data.arrayBuffer())
//     .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
//     .then(decodedAudio => {
//         audio = decodedAudio;
//     });

// function playClick() {
//     const playSound = audioContext.createBufferSource();
//     playSound.buffer = audio;
//     playSound.connect(masterVolume);
//     masterVolume.connect(audioContext.destination);
//     playSound.start();
// }




// ---------------------- przypisanie elementów JS do index.html ----------------

const tempoTextElement = document.querySelector('[data-tempo]');
const tempoUp = document.querySelector('[data-tempo-up]');
const tempoDown = document.querySelector('[data-tempo-down]');
const tempoFiveUp = document.querySelector('[data-tempo-5up]');
const tempoFiveDown = document.querySelector('[data-tempo-5down]');
const tempoSlider = document.querySelector('[data-tempo-slider]');
// const clickHtml = document.querySelector('[data-audio-click]');
const startBtn = document.querySelector('[data-start-btn]');
const stopBtn = document.querySelector('[data-stop-btn]');

// ---------------------- nowy obiekt typu Tempo --------------------------------

const tempo = new Tempo(tempoTextElement);

// ---------------------- wywoływanie klas ---------------------------------------

// // CLICK
// clickChannelData[1] = audioContext.createMediaElementSource(clickHtml);

tempoUp.addEventListener('click', () => {
    tempo.changeTempoUp();
    tempo.sliderTempoUpdate();
    tempo.updateDisplay();
});

tempoDown.addEventListener('click', () => {
    tempo.changeTempoDown();
    tempo.sliderTempoUpdate();
    tempo.updateDisplay();
});

tempoFiveUp.addEventListener('click', () => {
    tempo.changeTempoFiveUp();
    tempo.sliderTempoUpdate();
    tempo.updateDisplay();
});

tempoFiveDown.addEventListener('click', () => {
    tempo.changeTempoFiveDown();
    tempo.sliderTempoUpdate();
    tempo.updateDisplay();
});

tempoSlider.addEventListener('input', () => {
    tempo.classTempo = parseFloat(tempoSlider.value);
    tempo.updateDisplay();
})

// --------------------- odtworzenie dźwięku ----------------------

startBtn.addEventListener('click', () => {
    // // stworzenie buffer source czyli połączenie audio odpowiedzialne za odtw. dźwięku
    // // przenesione do event listenera ze względu na to, że buffer musi być tworzony
    // // za każdym razem na nowo. Plus wynika to z zarządzania pamięcią w 
    // // webAudioAPI   

    const whiteNoiseSource = audioContext.createBufferSource();
    whiteNoiseSource.buffer = buffer;
    whiteNoiseSource.detune.setValueAtTime(7, 0);
    whiteNoiseSource.connect(whiteNoiseFilter); // podpięcie pod volume gain

    whiteNoiseSource.start();
});

// startBtn.addEventListener('click', () => {
//     const sample = new Audio('./samples/click.mp3');
//     sample.play();
// });


const metronome = new Timer(playClick, 60000 / bpm, { immediate: true });

metronome.play();
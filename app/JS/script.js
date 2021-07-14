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
        this.classTempo ++;
    }  

    changeTempoDown() {
        if (this.classTempo <= 30) return;
        this.classTempo --;
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

// let context;
// window.addEventListener('load', init, false);
// function init() {
//     try {
//         window.AudioContext = 
//             window.AudioContext || window.webkitAudioContext;
//         context = new AudioContext();
//     } catch (error) {
//         alert('Web Audio API is not supported');
//     }
// }



// ---------------------- przypisanie elementów JS do index.html ----------------

const tempoTextElement = document.querySelector('[data-tempo]');
const tempoUp = document.querySelector('[data-tempo-up]');
const tempoDown = document.querySelector('[data-tempo-down]');
const tempoFiveUp = document.querySelector('[data-tempo-5up]');
const tempoFiveDown = document.querySelector('[data-tempo-5down]');
const tempoSlider = document.querySelector('[data-tempo-slider]');
const startBtn = document.querySelector('[data-start-btn]');
const stopBtn = document.querySelector('[data-stop-btn]');

// ---------------------- nowy obiekt typu Tempo --------------------------------

const tempo = new Tempo(tempoTextElement);

// ---------------------- wywoływanie klas ---------------------------------------

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

    const context = new AudioContext();
    context.createOscillator();
    context.start();
    console.log('Play!');

    
    tempo.updateDisplay();
    // const audio = new (window.AudioContext || window.webkitAudioContext)();
    // const osc = AudioContext.createOscillator();
    // osc.frequency.value = 800;
    // osc.connect(AudioContext.destination);
    // osc.start(AudioContext.currentTime + 1);
    // console.log('play!');
    // tempo.updateDisplay();
});

// ----------------------- Deklaracja timera -------------------------------------

class Metronome
{
    constructor(tempo)
    {
        this.audioContext = null;
        this.notesInQueue = [];         // notes that have been put into the web audio and may or may not have been played yet {note, time}
        this.currentQuarterNote = 0;
        this.tempo = tempo;
        this.lookahead = 25;          // How frequently to call scheduling function (in milliseconds)
        this.scheduleAheadTime = 0.1;   // How far ahead to schedule audio (sec)
        this.nextNoteTime = 0.0;     // when the next note is due
        this.isRunning = false;
        this.intervalID = null;
    }

    nextNote()
    {
        // Advance current note and time by a quarter note (crotchet if you're posh)
        var secondsPerBeat = 60.0 / this.tempo; // Notice this picks up the CURRENT tempo value to calculate beat length.
        this.nextNoteTime += secondsPerBeat; // Add beat length to last beat time
    
        this.currentQuarterNote++;    // Advance the beat number, wrap to zero
        if (this.currentQuarterNote == 4) {
            this.currentQuarterNote = 0;
        }
    }

    scheduleNote(beatNumber, time)
    {
        // push the note on the queue, even if we're not playing.
        this.notesInQueue.push({ note: beatNumber, time: time });
    
        // create an oscillator
        const osc = this.audioContext.createOscillator();
        const envelope = this.audioContext.createGain();
        
        osc.frequency.value = (beatNumber % 4 == 0) ? 1000 : 800;
        envelope.gain.value = 1;
        envelope.gain.exponentialRampToValueAtTime(1, time + 0.001);
        envelope.gain.exponentialRampToValueAtTime(0.001, time + 0.02);

        osc.connect(envelope);
        envelope.connect(this.audioContext.destination);
    
        osc.start(time);
        osc.stop(time + 0.03);
    }

    scheduler()
    {
        // while there are notes that will need to play before the next interval, schedule them and advance the pointer.
        while (this.nextNoteTime < this.audioContext.currentTime + this.scheduleAheadTime ) {
            this.scheduleNote(this.currentQuarterNote, this.nextNoteTime);
            this.nextNote();
        }
    }

    start()
    {
        if (this.isRunning) return;

        if (this.audioContext == null)
        {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }

        this.isRunning = true;

        this.currentQuarterNote = 0;
        this.nextNoteTime = this.audioContext.currentTime + 0.05;

        this.intervalID = setInterval(() => this.scheduler(), this.lookahead);
    }

    stop()
    {
        this.isRunning = false;

        clearInterval(this.intervalID);
    }

    startStop()
    {
        if (this.isRunning) {
            this.stop();
        }
        else {
            this.start();
        }
    }
}

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

    updateMetronomeTempo() {
        return this.classTempo;
    }

    updateDisplay() {
        this.tempoTextElement.innerText = this.classTempo;
    }

}

console.log('Check');

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

function playClick() {

    const whiteNoiseSource = audioContext.createBufferSource();
    whiteNoiseSource.buffer = buffer;
    whiteNoiseSource.detune.setValueAtTime(7, 0);
    whiteNoiseSource.connect(whiteNoiseFilter); // podpięcie pod volume gain
    whiteNoiseSource.start();
    
}

const metronome = new Metronome(tempo.classTempo);

startBtn.addEventListener('click', () => {
    metronome.startStop();
    console.log(tempoTextElement);

    
});

let tempoChangeButtons = document.querySelector('[data-tempo]');
for (var i = 0; i < tempoChangeButtons.length; i++) {
    tempoChangeButtons[i].addEventListener('click', function() {
    metronome.tempo += parseInt(this.dataset.change);
    tempo.textContent = metronome.tempo;

    });
}

// var tempoChangeButtons = document.getElementsByClassName('tempo-change');
// for (var i = 0; i < tempoChangeButtons.length; i++) {
//     tempoChangeButtons[i].addEventListener('click', function() {
//         metronome.tempo += parseInt(this.dataset.change);
//         tempo.textContent = metronome.tempo;
//     });
// }

// // ----------------------- Deklaracja klasy Metronome ---------------------------------

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
        this.dotCount = 1;
    }

    nextNote()
    {
        // Advance current note and time by a quarter note (crotchet if you're posh)
        var secondsPerBeat = 60.0 / this.tempo; // Notice this picks up the CURRENT tempo value to calculate beat length.
        this.nextNoteTime += secondsPerBeat; // Add beat length to last beat time
    
        this.currentQuarterNote++;    // Advance the beat number, wrap to zero
        if (this.currentQuarterNote == measureObject.measure) {
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
        
        // osc.frequency.value = (beatNumber % measureObject.measure == 0) ? 1000 : 800;

        if(beatNumber % measureObject.measure === 0) {
            osc.frequency.value = 1000;
                document.getElementById("dot1").style.backgroundColor = 'cyan';
                setTimeout(() => {
                    document.getElementById("dot1").style.backgroundColor = 'snow';
                }, 70);
        } else {
            osc.frequency.value = 800;

            if(this.dotCount == measureObject.measure)
                this.dotCount = 1;

                this.dotCount ++;
                
                document.getElementById(`dot${this.dotCount}`).style.backgroundColor = 'rgb(166, 214, 186)';
                setTimeout(() => {
                    document.getElementById(`dot${this.dotCount}`).style.backgroundColor = 'snow';
                    
                }, 70);
                
                console.log(`Numer kropki: ${this.dotCount}`);
        }

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
        this.dotCount = 1;

        if (this.isRunning) return;

        if (this.audioContext == null)
        {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)(); // ????
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

// ----------------------- Deklaracja klasy Tempo -------------------------------------

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

    updateTempo() {
        metronome.tempo = this.classTempo;
        console.log(metronome.tempo);
    }

    updateDisplay() {
        this.tempoTextElement.innerText = this.classTempo;
    }

}


// ----------------------- Deklaracja klasy Measure -----------------------------

class Measure {
    constructor(measure) {
        this.measure = measure;
        this.r;
        this.reset = false;
    }

// PO ZROBIENIU HOVER MENU USTAWI?? WYB??R METRUM NA SWITCHu !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

    changeMeasure() {

        if(metronome.isRunning === true) return;
        else {
            if(this.measure < 9) {
                this.measure ++;
            }
            else {
                this.measure = 1;
            }
        }    
    } 

    dotsManipulate() {
       
        if(metronome.isRunning === true) return;
        else {
                let dot = document.createElement("div"); // dot przechowuje nowy element
                dot.classList.add("dot"); // dodanie klasy do nowego dot
                dot.setAttribute("id", `dot${this.measure}`); // dodatnie id do nowego dot
            const element = document.getElementById("dots"); // powi??zanie z section dots
        
            if(this.measure <= 9 && this.measure != 1) {
                
                element.appendChild(dot); // dodanie elementu do sekcji dots

            }
            else {
                for(let i = 1; i <= 9; i++) {
                    const elementsToRemove = document.getElementById(`dot${i}`);
                        element.removeChild(elementsToRemove);
                        
                }
                this.r = 1;
                this.reset = true;
            }

            if(this.reset === true) {
                element.appendChild(dot);
                this.reset = false;
            }

        }

        
    }
    

    updateMeasureDisplay() {
        measureBtn.innerText = this.measure;
    }
}


// // ---------------------- import modu????w ----------------

// import Tempo from "./tempoClass.js";
// import Metronome from "./metronomeClass.js";
// import Measure from "./measureClass.js";

// ---------------------- przypisanie element??w JS do index.html ----------------

const tempoTextElement = document.querySelector('[data-tempo]');
const tempoUp = document.querySelector('[data-tempo-up]');
const tempoDown = document.querySelector('[data-tempo-down]');
const tempoFiveUp = document.querySelector('[data-tempo-5up]');
const tempoFiveDown = document.querySelector('[data-tempo-5down]');
export const tempoSlider = document.querySelector('[data-tempo-slider]');
const startBtn = document.querySelector('[data-start-btn]');
export const measureBtn = document.querySelector('[data-measure-btn]');

// ---------------------- stworzenie obiekt??w --------------------------------

const tempo = new Tempo(tempoTextElement);
const measureObject = new Measure(measureBtn.innerText);
export {measureObject};
const metronome = new Metronome();
export {metronome};
tempo.updateTempo();

// ---------------------- wywo??ywanie klas ---------------------------------------

tempoUp.addEventListener('click', () => {
    tempo.changeTempoUp();
    tempo.sliderTempoUpdate();
    tempo.updateTempo();
    tempo.updateDisplay();
});

tempoDown.addEventListener('click', () => {
    tempo.changeTempoDown();
    tempo.sliderTempoUpdate();
    tempo.updateTempo();
    tempo.updateDisplay();
});

tempoFiveUp.addEventListener('click', () => {
    tempo.changeTempoFiveUp();
    tempo.sliderTempoUpdate();
    tempo.updateTempo();
    tempo.updateDisplay();
});

tempoFiveDown.addEventListener('click', () => {
    tempo.changeTempoFiveDown();
    tempo.sliderTempoUpdate();
    tempo.updateTempo();
    tempo.updateDisplay();
});

tempoSlider.addEventListener('input', () => {
    tempo.classTempo = parseFloat(tempoSlider.value);
    tempo.updateTempo();
    tempo.updateDisplay();
})

// --------------------- odtworzenie d??wi??ku ----------------------

startBtn.addEventListener('click', () => {
    if(metronome.isRunning === false) {
        startBtn.textContent = "STOP";
    } else {
        startBtn.textContent = "START";

    }
    tempo.updateTempo();
    metronome.startStop();   
});


// --------------------- zmiana metrum ----------------------------

measureBtn.addEventListener('click', () => {
    measureObject.changeMeasure();
    measureObject.dotsManipulate();
    measureObject.updateMeasureDisplay();
    console.log(measureObject.measure);
});


function Timer(callback, timeInterval, options) {
    this.timeInterval = timeInterval;
    
    // Add method to start timer
    this.start = () => {
      // Set the expected time. The moment in time we start the timer plus whatever the time interval is. 
      this.expected = Date.now() + this.timeInterval;
      // Start the timeout and save the id in a property, so we can cancel it later
      this.theTimeout = null;
      
      if (options.immediate) {
        callback();
      } 
      
      this.timeout = setTimeout(this.round, this.timeInterval);
      console.log('Timer Started');
    }
    // Add method to stop timer
    this.stop = () => {
  
      clearTimeout(this.timeout);
      console.log('Timer Stopped');
    }
    // Round method that takes care of running the callback and adjusting the time
    this.round = () => {
      console.log('timeout', this.timeout);
      // The drift will be the current moment in time for this round minus the expected time..
      let drift = Date.now() - this.expected;
      // Run error callback if drift is greater than time interval, and if the callback is provided
      if (drift > this.timeInterval) {
        // If error callback is provided
        if (options.errorCallback) {
          options.errorCallback();
        }
      }
      callback();
      // Increment expected time by time interval for every round after running the callback function.
      this.expected += this.timeInterval;
      console.log('Drift:', drift);
      console.log('Next round time interval:', this.timeInterval - drift);
      // Run timeout again and set the timeInterval of the next iteration to the original time interval minus the drift.
      this.timeout = setTimeout(this.round, this.timeInterval - drift);
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

// startBtn.addEventListener('click', () => {
//     // // stworzenie buffer source czyli połączenie audio odpowiedzialne za odtw. dźwięku
//     // // przenesione do event listenera ze względu na to, że buffer musi być tworzony
//     // // za każdym razem na nowo. Plus wynika to z zarządzania pamięcią w 
//     // // webAudioAPI   

//     const whiteNoiseSource = audioContext.createBufferSource();
//     whiteNoiseSource.buffer = buffer;
//     whiteNoiseSource.detune.setValueAtTime(7, 0);
//     whiteNoiseSource.connect(whiteNoiseFilter); // podpięcie pod volume gain

//     whiteNoiseSource.start();
// });

// startBtn.addEventListener('click', () => {
//     const sample = new Audio('./samples/click.mp3');
//     sample.play();
// });


function playClick() {

    const whiteNoiseSource = audioContext.createBufferSource();
    whiteNoiseSource.buffer = buffer;
    whiteNoiseSource.detune.setValueAtTime(7, 0);
    whiteNoiseSource.connect(whiteNoiseFilter); // podpięcie pod volume gain

    whiteNoiseSource.start();
    // console.log(count);
    // if (count === beatsPerMeasure) {
    //     count = 0;
    // }
    // if (count === 0) {
    //     click1.play();
    //     click1.currentTime = 0;
    // } else {
    //     click2.play();
    //     click2.currentTime = 0;
    // }
    // count++;
}

const metronome = new Timer(playClick, 60000 / bpm, { immediate: true });

metronome.start();
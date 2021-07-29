export default class Tempo {
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
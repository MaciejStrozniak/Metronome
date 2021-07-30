import { metronome, measureBtn } from "./script.js";

export default class Measure {
    constructor(measure) {
        this.measure = measure;
        this.r;
        this.reset = false;
    }

    changeMeasure() {

        if(metronome.isRunning === true) return;
        else {
            if(this.measure < 12) {
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
            const element = document.getElementById("dots"); // powiązanie z section dots
        
            if(this.measure <= 12 && this.measure != 1) {
                
                element.appendChild(dot); // dodanie elementu do sekcji dots

            }
            else {
                for(let i = 1; i <= 12; i++) {
                    const elementsToRemove = document.getElementById(`dot${i}`);
                        element.removeChild(elementsToRemove);
                        //   dotsArray.pop[i];
                        this.r = 1;
                        this.reset = true;
                }
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
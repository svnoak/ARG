document.querySelector("button").addEventListener("click", checkPass);
if( !localStorage.getItem("buttonPress") ){
    localStorage.setItem("buttonPress", 0);
}

function checkPass(){
    let buttonPress = localStorage.getItem("buttonPress");
    const input = document.querySelector("input").value;
    let pass = input.trim().toLowerCase();
    const correct = "kinder sind in gefahr";
    if( pass == 07020104 || pass == 7214 ){
        alert("Die Zahlen sind der Weg, nicht die Antwort.");
    } else{
        if (pass == correct ) {
            alert("Geschafft! Danke, dass du mein Rätsel testest :)")
    }   else{
        alert("Du verstehst noch nicht.");
        console.log(intParse(buttonPress) === 5);
            switch (intParse(buttonPress)) {
                case 5:
                    alert("Datum und Zeit sind nicht immer nur dafür da, um Zeit anzugeben.");
                    break;
                case 8:
                    alert("Jede Zahl gehört zu einem Block");
                    break;
                case 10:
                    alert("Es gibt 4 Blöcke.");
                    break;
                default:
                    break;
            }
            buttonPress++
            localStorage.setItem("buttonPress", buttonPress);
        }
    }
}
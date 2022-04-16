document.querySelector("button").addEventListener("click", checkPass);
if( !sessionStorage.getItem("buttonPress") ){
    sessionStorage.setItem("buttonPress", 0);
}

function checkPass(){
    let buttonPress = sessionStorage.getItem("buttonPress");
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
            switch (buttonPress) {
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
            sessionStorage.setItem("buttonPress", buttonPress);
        }
    }
}
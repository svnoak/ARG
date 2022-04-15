document.querySelector("button").addEventListener("click", checkPass);

function checkPass(){
    const input = document.querySelector("input").value;
    let pass = input.trim().toLowerCase();
    const correct = "kinder sind in gefahr";
    if( pass == 07061105 || pass == 76115 ){
        alert("Die Zahlen sind der Weg, nicht die Antwort.");
    }else{
        pass == correct ? alert("Richtig!") : alert("Du verstehst noch nicht.");
    }
}
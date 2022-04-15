document.querySelector("button").addEventListener("click", checkPass);

function checkPass(){
    const input = document.querySelector("input").value;
    let pass = input.trim().toLowerCase();
    const correct = "kinder sind in gefahr";
    pass == correct ? alert("Richtig!") : alert("Du verstehst noch nicht.");
}
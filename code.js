document.querySelector("button").addEventListener("click", checkPass);

function checkPass(){
    const input = document.querySelector("input").value;
    let pass = input.trim().toLowerCase();
    const correct = "barnen är i fara";
    pass == correct ? alert("Rätt svar!") : alert("Du förstår inte riktigt än.");
}
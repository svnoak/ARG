window.onload(function() {
    document.querySelector("button").addEventListener("click", checkPass);
});

function checkPass(){
    const input = document.querySelector("input").value;
    let pass = input.trim().toLowerCase();
    const correct = "barnen är i fara";
    if( pass == 07061105 || pass == 76115 ){
        alert("Siffrorna är vägen, inte svaret.");
    }else{
        pass == correct ? alert("Rätt svar!") : alert("Du förstår inte riktigt än.");
    }
}
// On ajoute une bordure coloré lors du clique sur .answers .answer
$(document).on('click', '.answers .answer', function()
{
    this.style.border = "2px solid #8f9fe8";
})

function vote(index) 
{
    // On envoit l'index de notre vote
    socket.emit("vote", index)
}

socket.on('update', function(pollAnswer)
{
    // On ajuste les valeurs en fonction des clics sur les boutons
    document.getElementById("counter-label-yes").innerHTML = `Oui : ` + (pollAnswer[0].votes * 100 / (pollAnswer[0].votes + pollAnswer[1].votes)).toFixed(0) + "%";
    document.getElementById("counter-label-no").innerHTML = `Non : ` + (pollAnswer[1].votes * 100 / (pollAnswer[0].votes + pollAnswer[1].votes)).toFixed(0) + "%";
});
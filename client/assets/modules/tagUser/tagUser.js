/*
 * Nom : tagUser
 * Description :  * Description : Ce module permet de tager un utilisateur grâce au '@' 
 *              il verra le message avec un fond jaunâtre et de proposé 
 *              une autocomplétion des noms des clients
 * Auteur(s) : Matteo Nossereau - Mathias Genelot
 */


socket.on('autocomplete',receiveAutoComplete);

// si le message possède un '@' active l'autocompletion
$(document).on('keyup', '#message-input', function(evt)
{
    var input = $('#message-input');
    var message = input.val();
    if (messageHasTag(input.val()))
        sendAutoComplete(message);
    
});
/**
 * vérifie si le message possède un '@'
 * @param {*} input 
 * @returns 
 */

function messageHasTag(input)
{
    return input.includes('@');
}
/**
 * propose une autocomplétion du nom des gens avec '@'
 * @param {*} lstUsernameTag 
 */
function receiveAutoComplete(lstUsernameTag)
{
    var options = '';
    // remplisage des de la datalist options
    lstUsernameTag.forEach(element => 
    {
        options += "<option value='@" +element+ "'>";
    });

    $('#lstUsernameTag').remove();
   

    $('#message-input')
    .after('<datalist id="lstUsernameTag">'
            + options
         +' </datalist>'
    );

}
/**
 * envoie au serveur la demande d'autocomplétion
 * @param {*} message 
 */
function sendAutoComplete(message)
{
    socket.emit('autocomplete',message);
}
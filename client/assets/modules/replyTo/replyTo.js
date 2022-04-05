/*
* Nom : replyTo
 * Description : Ce module permet de répondre au message d'un utilisateur en particulier
 * Auteur(s) : Donovan Cartier et Romain Larivaud
*/

function displayAnsweredMessage(messageReplyTo)
{
    $('#replyToText').text('Répondre à ' + messageReplyTo);
}

function emptyReplyTo()
{
    $('#replyToText').text('');
}
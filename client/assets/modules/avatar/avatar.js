/*
 * Nom : Avatar
 * Description : Image de profil pour les utilisateurs
 * Auteur(s) : abjm-project
*/

/* ---------------- Code afin d'envoyer une image au clic sur un bouton ---------------------- */

// On récupère l'input 'image-input'
const avatarInput = $('#avatar-input');
avatarInput.change(sendAvatar);

/**
 * Prend l'image stocké dans l'input file
 */
function sendAvatar() 
{     
    const selectedFile = avatarInput[0].files[0]; 
    getBase64Avatar(selectedFile);
}   

/**
 * Convertit le fichier passé en paramètre en string base64
 * @param {*} file 
 */
 function getBase64Avatar(file) 
 {
    // Lecture du fichier
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function() 
    {
        // Affichage du résultat dans la console
        // Le 'result' contient les données en Base64
        sendToServer(reader.result);
    };
    reader.onerror = function(error)
    {
      console.log('Erreur: ', error);
    };
}

/**
 * Envoie l'image au serveur
 * @param {*} image 
 */
function sendToServer(image) 
{
    socket.emit('avatar', image);
}
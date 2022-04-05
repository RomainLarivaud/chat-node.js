/*
 * Nom : Picture
 * Description : Envoie d'une image en message
 * Auteur(s) : abjm-project
*/

/* ---------------- Code afin d'envoyer une image au clic sur un bouton ---------------------- */

// On récupère l'input 'image-input'
const fileInput = $('#image-input');
fileInput.change(sendImage);

/**
 * Prend l'image stocké dans l'input file et la convertit en base64
 */
function sendImage() 
{     
    const selectedFile = fileInput[0].files[0]; 
    getBase64(selectedFile);
}   

/**
 * Convertit le fichier passé en paramètre en string base64
 * @param {*} file 
 */
 function getBase64(file) 
 {
    // Lecture du fichier
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function() 
    {
        // 'reader.result' contient les données en Base64
        // On envoie les données au serveur
        sendImageToServer(reader.result);
    };
    reader.onerror = function(error) 
    {
      console.log('Erreur: ', error);
    };
}

/* ---------------- Code afin d'envoyer une image avec un drag and drop (dropzone.js) ---------------------- */

// Création de la dropzone pour déposer les images directement (glisser-déposer) -- "dropzone" = id dans l'HTML
Dropzone.options.dropzone = 
{
    autoProcessQueue: false,
    /**
     * Envoie la base64 au serveur
     */
    init: function() 
    {
        this.on("thumbnail", file => {
            sendImageToServer(file.dataURL);
        });
    }
}

// Initilialisation de la Dropzone
let dropzone = new Dropzone(document.getElementById("dropzone"), {
    url:"/",
    clickable: false
});

// Quand on glisse une image sur la page
$('#dropzone').on('dragover', function() 
{
    $('body')
        .css({'background-color' : 'rgba(0, 0, 0, 0.6)'})

    // Pour pouvoir glisser l'image sur le chat
    $(this)
        .css({'z-index' : '1'})
});

// Quand on enlève l'image de la page
$('#dropzone').on('dragleave', function() 
{
    $('body')
        .css({'background-color' : ''})

    $(this)
        .css({'z-index' : '0'})
});

// Quand on a upload l'image
$('#dropzone').on('drop', function() 
{  
    $('body')
        .css({'background-color' : ''})

    $(this)
        .css({'z-index' : '0'})
});

/**
 * Envoie l'image au serveur
 * @param {*} image 
 */
function sendImageToServer(image) 
{
    socket.emit('image', image);
    console.log(image)
}
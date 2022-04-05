/*
* Nom : emojis-picker
 * Description : Ce module permet de sélectionner des emojis lors de l'envoi d'un message !
 * Auteur(s) : CaMa
*/

//Fonction permettant de mettre en place l'emojis-picker
    var emojisPicker = $("#message-input").emojioneArea({

        //Position du pop-up de l'emojis-picker
        pickerPosition: "top", 
        //Choix de la forme des couleurs de peau des emojis ("bullet", "radio", "square", "checkbox")
        tonesStyle: "bullet",
        //Permet d'insérer un emoji dans le input en tapant son shortname
        shortnames: true,
        //Sauvegarde les emojis par leur shortname
        saveEmojisAs: "shortname",
        hideSource: false,
        inline: true,
    
        //Actionner le pop-up d'emojis
        events: {

        }
    });

    
function replaceEmoji(message){
    //Variable permettant d'aller chercher le shortname d'un emoji
	var regex = /\:\w+\:/g;
	//Fonction remplaçant le shortname par l'image de l'emoji correspondant
	message = message.replaceAll(regex, function(shortname)
	{
		//Convertit le shortname en unicode
		var code = emojione.shortnameToUnicode(shortname);
		var code = emojione.emojioneList[shortname].uc_base;
		
		//Inclut le code converti dans l'url de l'image
		var src = 'https://cdn.jsdelivr.net/emojione/assets/3.1/png/32/' + code + '.png';
		//Crée une nouvelle balise <img/> pour retourner l'image de l'emoji courant 
		var img = '<img src="' + src + '" class="emojioneemoji" />';
		return img;
	});
    return message;
}
    
/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH
	Application Name:	FARA_FRESNILLO
	Directory:			FARA_FRESNILLO/CONFIG/JS
	File Name:			mailer.js
=============================================================*/
function SendEmailNotification(NewUsers, isNew) {
    for (var key in NewUsers) {
        var emailHTML = "";

        if (isNew) {
            emailHTML = "<div><h2>Bienvenido " + NewUsers[key].DisplayName + "!</h2><p>Se ha convertido en un usuario registrado de MISOM's FARA IS Web Console.  Your can log in with your email and this temporary password.</p><h3>" + NewUsers[key].AppPassword + "</h3><p>You may access the Console from <a href='http://192.168.1.21:8888/misom_apps/fara_fresnillo'>HERE.</a></p><div/>";
        } else {
            emailHTML = "<div><h2>" + NewUsers[key].DisplayName + "!</h2><p>Tu MISOM FARA IS Web Console contrase&ntilde;a ha sido reseteada.  Your can log in with your email and this temporary password.</p><h3>" + NewUsers[key].AppPassword + "</h3><p>You may access the Console from <a href='http://192.168.1.21:8888/misom_apps/fara_fresnillo'>HERE.</a></p><div/>";
        }

        var userEmail = {};
        var fields = {};

        userEmail["to"] = NewUsers[key].Email;
        userEmail["subject"] = "FARA IS Web Console Usuario y Contraseña.";

        if (isNew) {
            userEmail["message"] = "Bienvenido " + NewUsers[key].DisplayName + "! You have become a registered user of MISOM's FARA IS Web Console.  Your can log in with your email and this temporary password. " + NewUsers[key].AppPassword + "You may access the Console from: <a href='http://192.168.1.21:8888/misom_apps/fara_fresnillo'>";
        } else {
            userEmail["message"] = NewUsers[key].DisplayName + "! Tu contraseña de MISOM FARA IS Web Console ha sido reseteada.  Your can log in with your email and this temporary password. " + NewUsers[key].AppPassword + "You may access the Console from: <a href='http://192.168.1.21:8888/misom_apps/fara_fresnillo'>";
        }
        userEmail["html"] = emailHTML;

        fields["fields"] = userEmail;

        $.ajax({
            headers: {
                "Content-Type": "application/json"
            },
            url: mailerIP + mailerPort + mailerDB + mailerEN + 'mailer/sendmail',
            type: "POST",
            data: JSON.stringify(fields),
            success: function() {
                if (key == NewUsers.length - 1) {
                    if (NewUsers.length > 1) {
                        DisplayAlert("&Eacute;xito!", "Los correos han sido enviados con una contraseña temporal a los nuevos usuarios.");
                    } else {
                        DisplayAlert("&Eacute;xito!", "Un correo ha sido enviado con una contraseña temporal al nuevo usuario.");
                    }
                }
            },
            error: function() {
                DisplayAlert("Error!", "El env&iacute;o de correo ha fallado.");
            }
        });
    }
}
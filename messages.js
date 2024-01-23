
const axios = require('axios');
const FormData = require('form-data');

async function sendMessage(phon_no_id, token, destinataire, texte) {
    try {
        const response = await axios({
            method: "POST",
            url: `https://graph.facebook.com/v18.0/${phon_no_id}/messages?access_token=${token}`,
            data: {
                messaging_product: "whatsapp",
                to: destinataire,
                text: {
                    body: texte
                }
            },
            headers: {
                "Content-Type": "application/json"
            }
        });

        console.log("Réponse Axios :", response.data);
    } catch (error) {

        console.error("Erreur Axios :", error.message);
    }
}

async function payment(currency, provider, walletId, abonnement) {
    try {
        let data = new FormData();
        data.append('currency', currency);
        data.append('provider', provider);
        data.append('walletID', walletId);
        data.append('etudiantID', 'STDTAC20230330092HFM5UM110173');
        data.append('abonnementID', abonnement);

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://tag.trans-academia.cd/Api_abonnement.php',
            headers: {
                ...data.getHeaders()
            },
            data: data
        };

        axios.request(config)
            .then((response) => {
                console.log(JSON.stringify(response.data));
            })
            .catch((error) => {
                console.log(error);
            });
    } catch (error) {

        console.error("Erreur Axios :", error.message);
    }
}


module.exports = {
    sendMessage,
    payment
};



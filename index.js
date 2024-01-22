const express = require("express");
const body_parser = require("body-parser");
const axios = require("axios");
require('dotenv').config();
const FormData = require('form-data');

const app = express().use(body_parser.json());

const token = process.env.TOKEN;
const mytoken = process.env.MYTOKEN;//prasath_token

app.listen(process.env.PORT, () => {
    console.log("webhook is listening with the port " + process.env.PORT);
});

//to verify the callback url from dashboard side - cloud api side
app.get("/webhook", (req, res) => {
    let mode = req.query["hub.mode"];
    let challange = req.query["hub.challenge"];
    let token = req.query["hub.verify_token"];


    if (mode && token) {

        if (mode === "subscribe" && token === mytoken) {
            res.status(200).send(challange);
        } else {
            res.status(403);
        }

    }

});

app.post("/webhook", (req, res) => { //i want some 

    let body_param = req.body;

    console.log(JSON.stringify(body_param, null, 2));

    if (body_param.object) {
        console.log("inside body param");
        if (body_param.entry &&
            body_param.entry[0].changes &&
            body_param.entry[0].changes[0].value.messages &&
            body_param.entry[0].changes[0].value.messages[0]
        ) {
            let phon_no_id = body_param.entry[0].changes[0].value.metadata.phone_number_id;
            let from = body_param.entry[0].changes[0].value.messages[0].from;
            let msg_body = body_param.entry[0].changes[0].value.messages[0].text.body;

            console.log("phone number " + phon_no_id);
            console.log("from " + from);
            console.log("boady param " + msg_body);

            if (msg_body.toLowerCase().includes("bonjour") || msg_body.toLowerCase().includes("salut") || msg_body.toLowerCase().includes("bonsoir")) {
                axios({
                    method: "POST",
                    url: "https://graph.facebook.com/v18.0/" + phon_no_id + "/messages?access_token=" + token,
                    data: {
                        messaging_product: "whatsapp",
                        to: from,
                        text: {
                            body: "Bonjour 👋🏾, je m'appelle *Stanislas Makengo*.\nComment puis-je vous assister aujourd'hui ?"
                        }
                    },
                    headers: {
                        "Content-Type": "application/json"
                    }

                });
            } else if (msg_body.toLowerCase().includes("abonnement")) {
                axios({
                    method: "POST",
                    url: "https://graph.facebook.com/v18.0/" + phon_no_id + "/messages?access_token=" + token,
                    data: {
                        messaging_product: "whatsapp",
                        to: from,
                        text: {
                            body: "Vous allez voir s'afficher le popup de paiement. Veuillez confirmer le code PIN.\nVous recevrez une réponse dans l'application dans un court laps de temps ! 😊"
                        }
                    },
                    headers: {
                        "Content-Type": "application/json"
                    }

                });

                //test payment

                let data = new FormData();
                data.append('currency', 'CDF');
                data.append('provider', 'MPESA');
                data.append('walletID', '0826016607');
                data.append('etudiantID', 'STDTAC20230330092HFM5UM110173');
                data.append('abonnementID', '13');

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

                // close payment

            } else {
                axios({
                    method: "POST",
                    url: "https://graph.facebook.com/v18.0/" + phon_no_id + "/messages?access_token=" + token,
                    data: {
                        messaging_product: "whatsapp",
                        to: from,
                        text: {
                            body: "Bye Bye "
                        }
                    },
                    headers: {
                        "Content-Type": "application/json"
                    }

                });
            }





            res.sendStatus(200);
        } else {
            res.sendStatus(404);
        }

    }

});


app.get("/", (req, res) => {
    res.status(200).send("hello this is webhook setup");
});
const request = require('request');
const { ACCESS_TOKEN, TOKEN } = require('../config');

class WebhookController {
    async getting(req, res) {
        if(req.query['hub.verify_token'] === TOKEN){
            res.send(req.query['hub.challenge']);
        } else {
            res.send('EmprenDev dice que no tienes permisos.')
        }
    }
  
    async posting(req, res) {
        const webhook_event = req.body.entry[0];

        if(webhook_event.messaging){
            webhook_event.messaging.forEach(event => {
                handleEvent(event.sender.id, event);
                console.log(event);
            })
        }
        res.sendStatus(200);
    }
}


    function firstEntity(nlp, name) {
        return nlp && nlp.entities && nlp.entities[name] && nlp.entities[name][0];
    }
    
    function handleEvent(senderId, event){
    
        if(event.message){
    
            if(event.message.quick_reply){
                handlePostback(senderId, event.message.quick_reply.payload);
            } else {
                handleMessage(senderId, event);
            }
            
        } else if (event.postback){
            handlePostback(senderId, event.postback.payload);
        }
    }
    
    function handleMessage(senderId, event){
        if(event.message.text){
            sendNLPMessage(senderId, event);
        } else if (event.attachments){
            handleAttachments(senderId, event.message)
        }
    }
    
    function sendNLPMessage(senderId, event){
    
        const greeting = firstEntity(event.message.nlp, 'saludos');
        const gracias = firstEntity(event.message.nlp, 'gracias');
        const despedida = firstEntity(event.message.nlp, 'entity_despedida');
    
        let messageData = {};
    
        if (greeting && greeting.confidence > 0.8) {
            messageData = {
                "recipient": {
                    "id": senderId
                },
                "message": {
                    "text": "Hola, soy el bot de EmprenDev, estoy aquí para resolver algunas dudas que tengas. ;)",
                    "quick_replies": [
                        {
                            "content_type": "text",
                            "title": "Hola :D",
                            "payload": "SALUDO"
                        }
                    ]
                }
            }
        } else if (gracias && gracias.confidence > 0.8){
            messageData = {
                "recipient": {
                    "id": senderId
                },
                "message": {
                    "text": "De nada, estamos para ayudarte! 💪"
                }
            }
        } else if(despedida && despedida.confidence > 0.8){
            messageData = {
                "recipient": {
                    "id": senderId
                },
                "message": {
                    "text": "Hasta pronto, que tengas buen día! 😎"
                }
            }
        }
        else{
            messageData = {
                "recipient": {
                    "id": senderId
                },
                "message": {
                    "text": "Soy el bot de EmprenDev, estoy entrenando para entender tu lenguaje natural :)"
                }
            }
        }
    
        senderActions(senderId);
        callSendApi(messageData);
        
    }
    
    function handlePostback(senderId, payload){
    
        let messageData = {};
    
        switch(payload){
            case "GET_STARTED_EMPRENDEV":
                messageData = {
                    "recipient": {
                        "id": senderId
                    },
                    "message": {
                        "text": "Hola, soy el bot de EmprenDev :D",
                        "quick_replies": [
                            {
                                "content_type": "text",
                                "title": "Hola :D",
                                "payload": "SALUDO"
                            }
                        ]
                    }
                }
                callSendApi(messageData);
            break;
            case "QUIENES_SOMOS":
                messageData = {
                    "recipient": {
                        "id": senderId
                    },
                    "message": {
                        "text": "Somos un grupo de estudiantes UNI, que brindamos soluciones tecnológicas para convertir todo tipo de negocio a digital.",
                        "quick_replies": [
                            {
                                "content_type": "text",
                                "title": "¿Qué hacemos?",
                                "payload": "QUE_HACEMOS"
                            }
                        ]
                    }
                }
                callSendApi(messageData);
            break;
            case "QUE_HACEMOS":
                messageData = {
                    "recipient": {
                        "id": senderId
                    },
                    "message": {
                        "text": "Desarrollamos apps para optimizar tu negocio, ser mas eficiente, y conectarte con mas personas al mismo tiempo.",
                        "quick_replies": [
                            {
                                "content_type": "text",
                                "title": "¿Quienes somos?",
                                "payload": "QUIENES_SOMOS"
                            }
                        ]
                    }
                }
                callSendApi(messageData);
            break;
            case "SALUDO":
                messageData = {
                    "recipient": {
                        "id": senderId
                    },
                    "message": {
                        "text": "¿En qué te puedo ayudar?",
                        "quick_replies": [
                            {
                                "content_type": "text",
                                "title": "¿Quienes somos?",
                                "payload": "QUIENES_SOMOS"
                            },
                            {
                                "content_type": "text",
                                "title": "¿Qué hacemos?",
                                "payload": "QUE_HACEMOS"
                            }
                        ]
                    }
                }
                callSendApi(messageData);
            break;
        }
    }
    
    function senderActions(senderId){
        const messageData = {
            "recipient": {
                "id": senderId
            },
            "sender_action": "typing_on"
        }
        callSendApi(messageData);
    }
    
    function handleAttachments(senderId, event){
        let attachment_type = event.attachments[0].type;
        switch (attachment_type){
            case "image":
                console.log(attachment_type);
            break;
            case "video":
                console.log(attachment_type);
            break;
            case "audio":
                console.log(attachment_type);
            break;
            case "file":
                console.log(attachment_type);
            break;
            case "location":
                console.log(JSON.stringify(event))
            break;
            default:
                console.log(attachment_type);
            break;
        }
    }
    
    function callSendApi(res){
        request({
            "uri": "https://graph.facebook.com/me/messages/",
            "qs": {
                "access_token": ACCESS_TOKEN
            },
            "method": "POST",
            "json": res
        },
        function(err){
            if(err){
                console.log('Ha ocurrido un error.')
            } else {
                console.log('Mensaje enviado.')
            }
        })
    }
  
  module.exports = new WebhookController();
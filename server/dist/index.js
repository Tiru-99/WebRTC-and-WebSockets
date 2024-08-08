"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8080 });
//to pass messages
let senderSocket = null;
let receiverSocket = null;
wss.on('connection', function connection(ws) {
    ws.on('error', console.error);
    //identify as sender 
    //identify as receiver 
    //create offer 
    // create answer 
    //add ice candidate
    ws.on('message', function message(data) {
        const message = JSON.parse(data);
        console.log(message);
        if (message.type === 'sender') {
            senderSocket = ws;
            console.log('sender set');
        }
        else if (message.type === 'receiver') {
            receiverSocket = ws;
            console.log('receiver set');
        }
        else if (message.type === 'createOffer') {
            if (ws !== senderSocket) {
                return;
            }
            receiverSocket === null || receiverSocket === void 0 ? void 0 : receiverSocket.send(JSON.stringify({ type: 'createOffer', sdp: message.sdp }));
            console.log("offer sent");
        }
        else if (message.type === 'createAnswer') {
            if (ws !== receiverSocket) {
                return;
            }
            senderSocket === null || senderSocket === void 0 ? void 0 : senderSocket.send(JSON.stringify({ type: 'createAnswer', sdp: message.sdp }));
            console.log("offer received");
        }
        else if (message.type === 'iceCandidate') {
            if (ws === senderSocket) {
                receiverSocket === null || receiverSocket === void 0 ? void 0 : receiverSocket.send(JSON.stringify({ type: 'iceCandidate', candidate: message.candidate }));
            }
            else if (ws === receiverSocket) {
                senderSocket === null || senderSocket === void 0 ? void 0 : senderSocket.send(JSON.stringify({ type: 'iceCandidate', candidate: message.candidate }));
            }
        }
    });
    ws.send('something');
});

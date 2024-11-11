const tf = require('@tensorflow/tfjs-node')
const faceapi = require('@vladmandic/face-api');
const express = require('express');
const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');
const socketIo = require('socket.io');
const canvas = require('canvas');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser')
const { Canvas, Image, ImageData } = require('canvas');

var faceMatcher;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });
const MODEL_URL = './models';

const app = express();
const port = 3000;
const options = {
    key: fs.readFileSync('./ssl/cert.key'),
    cert: fs.readFileSync('./ssl/cert.pem'),
    ca: [fs.readFileSync(path.join(__dirname, './ssl/cert.pem'))],
    requestCert: true,
    rejectUnauthorized: false, // so we can do own error handling
};

app.use(cookieParser());
app.use(bodyParser());
app.use(express.static('public'))
app.set('view engine', 'pug')

const server = https.createServer(options, app).listen(port, function(){
  console.log("Express server listening on port " + port);
  initFaceRecognition();
});

const io = socketIo(server);

io.on('connection', (socket) => {
    socket.on('image', async (data) => {
        try{
            const img = await canvas.loadImage(data);
            const camFace = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();

            if (camFace) {
                if (faceMatcher) {
                  const bestMatch = faceMatcher.findBestMatch(camFace.descriptor);

                  if (bestMatch.distance < 0.43) {
                    let options = {
                        maxAge: 1000 * 60 * 30,
                        httpOnly: true
                    }
                    socket.emit('redirect', '/flag?faceSecret=jYmrgVBBFTpaDi2CHn4tWJv4Kt0rpyGG');
                  } else {
                    socket.emit('results', "Улыбнись, братишка))");
                  }
                }
            }
        } catch (err) {
            console.log(err)
            socket.emit('results', "Такое тут не пройдет");
        }
    });
});

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/views/bropass.html'));
});

app.get('/login', function(req, res) {
    res.sendFile(path.join(__dirname + '/views/bropass.html'));
});

app.post('/login', function(req, res) {
    const username = req.body.username;
    const password = req.body.password;

    if (typeof username !== 'undefined' && typeof password !== 'undefined' && username == 'brother' && password == 'brother') {
        let options = {
            maxAge: 1000 * 60 * 30,
            httpOnly: true
        }

        res.cookie('LOGIN_COOKIE', 'bug4QLO6wSwFKR9A7H5N8p0bsZrZbHdY', options);
        res.redirect('/cert');
    } else {
        res.sendFile(path.join(__dirname + '/views/bropass_fail.html'));
    }
});

app.get('/cert', function(req, res) {
    loginCookie = req.cookies.LOGIN_COOKIE;

    if (loginCookie == "bug4QLO6wSwFKR9A7H5N8p0bsZrZbHdY") {
        const cert = req.socket.getPeerCertificate();
        console.log(cert)

        if (typeof cert !== 'undefined' && typeof cert.subject !== 'undefined' && cert.subject.CN == 'brother') {
            let options = {
                maxAge: 1000 * 60 * 30,
                httpOnly: true
            }

            res.cookie('CERT_COOKIE', '98SB3GnBzZbDFf7DepvEID61T8wyJoO8', options);
            res.redirect('/face');

        } else if (cert && cert.subject) {
            res.status(403)
            res.sendFile(path.join(__dirname + '/views/brocert_fail.html'));

        } else {
            res.status(401)
            res.sendFile(path.join(__dirname + '/views/brocert.html'));
        }        
    } else {
        res.redirect('/login');
    }

});

app.get('/face', function(req, res) {
    loginCookie = req.cookies.LOGIN_COOKIE;
    certCookie = req.cookies.CERT_COOKIE;

    if (loginCookie == "bug4QLO6wSwFKR9A7H5N8p0bsZrZbHdY" && certCookie == "98SB3GnBzZbDFf7DepvEID61T8wyJoO8") {
        res.sendFile(path.join(__dirname + '/views/broface.html'));       
    } else {
        res.redirect('/login');
    }

});

app.get('/flag', function(req, res) {
    loginCookie = req.cookies.LOGIN_COOKIE;
    certCookie = req.cookies.CERT_COOKIE;
    faceSecret = req.query.faceSecret;

    if (loginCookie == "bug4QLO6wSwFKR9A7H5N8p0bsZrZbHdY" && certCookie == "98SB3GnBzZbDFf7DepvEID61T8wyJoO8" && faceSecret == "jYmrgVBBFTpaDi2CHn4tWJv4Kt0rpyGG") {
        res.send("cyzi{Zd4r0va_b4nd1ty}")     
    } else {
        res.redirect('/login');
    }

});

async function initFaceRecognition() {
    await faceapi.nets.ssdMobilenetv1.loadFromDisk(MODEL_URL);
    await faceapi.nets.faceLandmark68Net.loadFromDisk(MODEL_URL);
    await faceapi.nets.faceRecognitionNet.loadFromDisk(MODEL_URL);

    const brotherImg = new Image();
    brotherImg.src = './public/images/brother.png';
    const brotherFace = await faceapi.detectSingleFace(brotherImg).withFaceLandmarks().withFaceDescriptor();
    const brotherFaceDescriptor = await new faceapi.LabeledFaceDescriptors('brother', [brotherFace.descriptor]);
    faceMatcher = await new faceapi.FaceMatcher(brotherFaceDescriptor, 0.8);
}


const functions = require('firebase-functions');
const admin = require("firebase-admin");

const cors = require('cors')({ origin: true });
const fs = require('fs');
const gcconfig = {
    projectId: 'awesome-places-1515913378197',
    keyFilename: "awesome-places.json"
}
const gcs = require('@google-cloud/storage')(gcconfig);
admin.initializeApp({
    credential: admin.credential.cert(require("./awesome-places.json"))
});
const UUID = require("uuid-v4");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.storeImage = functions.https.onRequest((request, response) => {
    cors(request, response, () => {
        if (!request.headers.authorization || !request.headers.authorization.startsWith("Bearer ")) {
            response.status(403).json({ error: 'Unauthorized' });
            return;
        }
        let idToken;
        idToken = request.headers.authorization.split("Bearer ")[1];
        admin.auth().verifyIdToken(idToken)
            .then(decodedToken => {
                const body = JSON.parse(request.body);
                fs.writeFileSync("/tmp/uploaded-img.jpg", body.image, "base64", err => {
                    console.log(err);
                    return response.status(500).json({ error: err });
                })
                const bucket = gcs.bucket("awesome-places-1515913378197.appspot.com");
                const uuid = UUID();

                bucket.upload("/tmp/uploaded-img.jpg", {
                    uploadType: 'media',
                    destination: '/places/' + uuid + '.jpg',
                    metadata: {
                        metadata: {
                            contentType: "image/jpeg",
                            firebaseStorageDownloadTokens: uuid
                        }
                    }
                }, (err, file) => {
                    if (!err) {
                        response.status(201).json({
                            imageUrl: "https://firebasestorage.googleapis.com/v0/b/" +
                                bucket.name +
                                "/o/" +
                                encodeURIComponent(file.name) +
                                "?alt=media&token=" +
                                uuid,
                            imagePath: '/places/' + uuid + '.jpg'
                        });
                    } else {
                        console.log(err);
                        response.status(500).json({ error: err });
                    }
                });
            })
            .catch(error => {
                console.log("Not valid token");
                response.status(403).json({ error: "Unauthorized" })
            });

    });
});

exports.deleteImage = functions.database.ref("/places/{placeId}").onDelete(event => {
    const placeData = event.data.previous.val();
    const imagePath = placeData.imagePath;

    const bucket = gcs.bucket("awesome-places-1515913378197.appspot.com");
    return bucket.file(imagePath).delete();
});
const functions = require('firebase-functions')
const admin = require('firebase-admin')
const serviceAccount = require('./private/key.json')
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://team-up-share.firebaseio.com',
})

const firestore = admin.firestore()

exports.updateFileList = functions.storage.object().onFinalize(async (object) => {
  console.log('onFinalize object', object)
  const { project, fileName, updatedBy } = object.metadata

  firestore
    .collection('projects').doc(project)
    .collection('documents').doc(fileName).set({
      name: fileName,
      mediaLink: object.mediaLink,
      contextType: object.contentType,
      size: object.size,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedBy: updatedBy
    })
})

exports.deleteFileList = functions.storage.object().onDelete(async (object) => {
  console.log('onDelete object', object)
  const { project, fileName } = object.metadata

  firestore
    .collection('projects').doc(project)
    .collection('documents').doc(fileName).delete()
})

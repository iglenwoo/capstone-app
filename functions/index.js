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
      path: object.name,
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

exports.getMemberDetails = functions.https.onCall(async (data, context) => {
  const { code, target } = data
  console.log(code, target)
  if (!context.auth) {
    throw new functions.https.HttpsError('failed-precondition', 'The function must be called ' +
      'while authenticated.');
  }
  const email = context.auth.token.email || null;

  let isMember = false
  return firestore.collection('projects').doc(code).get().then(projectDoc => {
    const data = projectDoc.data()
    const emails = []
    for (const [memberEmail, member] of Object.entries(data.members)) {
      if (memberEmail === email) {
        isMember = true
        if (member.role === 'member' && member.status === 'invited') {
          throw new functions.https.HttpsError('permission-denied', 'You have to accept the invitation first.');
        }
      }

      if (member.role === 'owner') {
        emails.push(memberEmail)
      } else {
        if (member.status === 'accepted') {
          emails.push(memberEmail)
        }
      }
    }

    if (!isMember)
      throw new functions.https.HttpsError('permission-denied', 'You cannot access this project.');

    // return firestore.collection('ids').where('email', 'in', emails).get()
    console.log(emails)
    return firestore.collection(target).where('email', 'in', emails).get().then(querySnapshot => {
      const res = []
      querySnapshot.forEach(docSnapshot => {
        res.push(docSnapshot.data())
      })
      console.log(res)
      return res
    })
  })
})

exports.readProject = functions.https.onCall(async (data, context) => {
  const { code } = data
  if (!context.auth) {
    throw new functions.https.HttpsError('failed-precondition', 'The function must be called ' +
      'while authenticated.');
  }
  const email = context.auth.token.email || null;

  return firestore.collection('projects').doc(code).get().then(projectDoc => {
    const data = projectDoc.data()
    for (const memberEmail of Object.keys(data.members)) {
      if (memberEmail === email) {
        return data
      }
    }
    throw new functions.https.HttpsError('permission-denied', 'You cannot access this project.');
  })
})

exports.addProject = functions.https.onCall(async (data, context) => {
  // Message text passed from the client.
  console.log(data)
  const { code, members, title, desc } = data

  // Authentication / user information is automatically added to the request.
  const uid = context.auth.uid;

  const projectRef = firestore.collection('projects').doc(code)
  const userRef = firestore.collection('users').doc(uid)
  return firestore
    .runTransaction(t => {
      return t.get(projectRef).then(projectDoc => {
        if (projectDoc.exists) {
          throw new functions.https.HttpsError('already-exists', `Project code ${code} already exists`)
        }

        t.set(projectRef, { code, members, title, desc })
        t.update(userRef, {
          projects: admin.firestore.FieldValue.arrayUnion(projectRef.id),
        })

        return {
          id: projectRef.id
        }
      })
    })
});

exports.inviteMember = functions.https.onCall(async (data, context) => {
  console.log(data)
  const { newMemberEmail, code } = data
  if (!context.auth) {
    throw new functions.https.HttpsError('failed-precondition', 'The function must be called ' +
      'while authenticated.');
  }

  return firestore
    .collection('users')
    .where('email', '==', newMemberEmail)
    .get()
    .then(querySnapshot => {
      if (querySnapshot.size === 0) {
        throw new functions.https.HttpsError('invalid-argument', `Email ${newMemberEmail} not found`);
      }
      const doc = querySnapshot.docs[0]
      const user = doc.data()

      const projectRef = firestore.collection('projects').doc(code)
      return firestore
        .runTransaction(t => {
          return t.get(projectRef).then(doc => {
            if (!doc.exists) {
              throw new functions.https.HttpsError('invalid-argument', `Project code ${code} doesn't exist`);
            }
            const project = doc.data()
            if (newMemberEmail in project.members) {
              throw new functions.https.HttpsError('already-exists', `Email ${newMemberEmail} has been already invited.`);
            }

            const fieldPath = new admin.firestore.FieldPath('members', newMemberEmail);
            t.update(projectRef, fieldPath, { role: 'member', status: 'invited', firstName: user.firstName, lastName: user.lastName })
            return projectRef
          })
        })
    })
})

exports.getInvitations = functions.https.onCall(async (data, context) => {
  console.log(data)
  if (!context.auth) {
    throw new functions.https.HttpsError('failed-precondition', 'The function must be called ' +
      'while authenticated.');
  }
  const email = context.auth.token.email || null;

  const statusPath = new admin.firestore.FieldPath('members', email, 'status');
  const rolePath = new admin.firestore.FieldPath('members', email, 'role');
  return firestore.collection('projects')
    .where(statusPath, '==', 'invited')
    .where(rolePath, '==', 'member').get().then(querySnapshot => {
    const res = []
    querySnapshot.forEach(docSnapshot => {
      res.push(docSnapshot.data())
    })
    console.log(res)
    return res
  })
});

exports.acceptInvitation = functions.https.onCall(async (data, context) => {
  console.log(data)
  const { code } = data
  if (!context.auth) {
    throw new functions.https.HttpsError('failed-precondition', 'The function must be called ' +
      'while authenticated.');
  }
  const uid = context.auth.uid;
  const email = context.auth.token.email || null;

  const projectRef = firestore.collection('projects').doc(code)
  const userRef = firestore.collection('users').doc(uid)
  return userRef.get().then(userDoc => {
    const data = userDoc.data()
    const { firstName, lastName } = data

    return firestore
      .runTransaction(t => {
        return t.get(projectRef).then(projectDoc => {
          if (!projectDoc.exists) {
            throw new functions.https.HttpsError('invalid-argument', `Project code ${code} not found.`)
          }
          const data = projectDoc.data()
          const member = data.members[email]
          if (!member) {
            throw new functions.https.HttpsError('invalid-argument', `Email ${email} not invited.`)
          }
          if (member.status !== 'invited') {
            throw new functions.https.HttpsError('invalid-argument', `Email ${email} already accepted.`)
          }

          const fieldPath = new admin.firestore.FieldPath('members', email);
          t.update(projectRef, fieldPath, { role: 'member', status: 'accepted', firstName, lastName })
          t.update(userRef, {
            projects: admin.firestore.FieldValue.arrayUnion(projectRef.id),
          })

          return projectRef
        })
      })
  })
});

const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

exports.pushes = functions.firestore
	.document('notifications/{token}')
	.onCreate((snap, context) => {
		const document = snap.data();
		console.log('document is', document);

		admin.firestore().collection("DeviceTokens").get().then(
			result  => {
				var registrationToken = [];
				result.docs.forEach(
					tokenDocument => {		
						registrationToken.push(tokenDocument.data().token);
					}
				);

				for (let tokenPuro of registrationToken) {
					console.log("pega o valor por favor ",tokenPuro);


				var message = {
					notification: {
						title: document.title,
						body: document.body,
					},
					tokens: registrationToken,
				}
				
				console.log(message);
		
				console.log('token é :', registrationToken);
		
				admin.messaging().sendMulticast(message)
					.then((response) => {
						if (response.failureCount > 0) {
							const failedTokens = [];
							response.responses.forEach((resp, idx) => {
							  if (!resp.success) {
								failedTokens.push(registrationTokens[idx]);
							  }
							});
							console.log('List of tokens that caused failures: ' + failedTokens);
						  }
					})
			 }
			}
		);
		return Promise.resolve(0);
	});


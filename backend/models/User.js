import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
	publicKey: { type: String, unique: true },
	privateKey: { type: String, unique: true },

	// accepted
	friends: [
		{	
			nickname: String,
			publicKey: String,
		},
	],

	// requests received from others
	incomingRequests: [
		{
			publicKey: String,
			timeStamp: {type: Date, default: Date.now}
		},
	],

	// requests sent to others
	outgoingRequests: [
		{
			publicKey: String,
		},
	],
});
/*
    [
        {
            _id: ObjectId('68968153fd770eecf66c4bd0'),
            publicKey: 'pubA',
            privateKey: 'privA',

            friends: [
                { publicKey: 'friendOneKey', _id: ObjectId('idd')},
                { publicKey: 'friendTwoKey', _id: ObjectId('idd')}
            ],

            incomingRequests: [
                { publicKey: 'friendThreeKey', _id: ObjectId('idd')}
            ],

            outgoingRequests: [
                { publicKey: 'friendFourKey', _id: ObjectId('idd')}
            ]
        }
    ]
*/
export default mongoose.model("User", userSchema);
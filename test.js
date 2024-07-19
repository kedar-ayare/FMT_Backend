console.log("Starting Tests")

const jwt = require('jsonwebtoken');

const Users = require("../Backend/models/User")

var token;

async function main() {

    const newUser = Users({
        fname: 'Test',
        lname: 'User',
        gender: 'Female',
        dob: Date(),
        email: 'testuser@gmail.com',
        password: 'testuser',
        phone: '8692056130',
        edu: 'High School',
        empStatus: 'unemployed',
        profileURL: "https://myfamtree.000webhostapp.com/appImages/revati.jpg"

    });
    await newUser.save();
    const token = jwt.sign({ id: newUser._id, email: 'kedarayareilr@gmail.com' }, process.env.JWT_SECRETE, { expiresIn: '90d' });
    console.log(token)
}
main()

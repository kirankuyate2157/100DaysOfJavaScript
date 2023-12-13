import User from "../models/User.js";

//create new user Post data
const createUser = async (req, res) => {

    const data = req.body;

    // validate user data before creating a new user
    // example validation: checking if username, email, or password is empty or invalid format

    // if validation fails, send an error response
    if (!validateUserData(data)) {
        return res.status(400).json({ error: "Invalid user data" });
    }

    // if validation passes, create a new user with the provided data
    try {
        const newUser = new User(data);
        await newUser.save();
        return res.status(201).json({ message: "User created successfully", user: newUser });
    } catch (error) {
        return res.status(500).json({ error: "Server error creating user" });
    }

}

function validateUserData(data) {
    // validation logic goes here
    // for example, checking if username, email, or password is empty or invalid format

    if (!data.username || !data.email || !data.password) {
        return false;
    }

    if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(data.email)) {
        return false;
    }

    if (data.password.length < 8) {
        return false;
    }

    return true;
}

export default createUser;
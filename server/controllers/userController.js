import User from "../models/user.js";
import bcrypt from "bcrypt";
import GenerateToken from "../utils/index.js";

// CREATE A USER
export const createUser = async (req, res) => {
    try {
        const { email, password, role} = req.body;
        console.log(req.body);
        console.log("Login attempt:", { email, password, role });
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        if (!role) {
            return res.status(400).json({ error: "Role is required" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ email, password: hashedPassword });
        
        res.status(201).json({ message: "User successfully registered",  id: user.id, email: user.email, "Your Role":  user.role });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
        console.error(error);
    }
};

// LOGIN
export const LoginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("Login attempt:", { email, password });
        const fetchUser = await User.findOne({ email });

        // Verify user exists and password is correct
        if (!fetchUser || !(await bcrypt.compare(password, fetchUser.password))) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const userToken = GenerateToken(fetchUser.id); // Generate token with user ID
        res.status(200).json({ message: "User logged in successfully", id: fetchUser.id, email: fetchUser.email, token: userToken, role: fetchUser.role });
        console.log({ message: "User logged in successfully", id: fetchUser.id, email: fetchUser.email, role: fetchUser.role,token: userToken });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

// GET USERS
export const getUsers = async (req, res) => {
    try {
        const allUsers = await User.find();

        if (allUsers.length > 0) {
            const users = allUsers.map(user => ({
                id: user.id,
                email: user.email,
                role: user.role
            }));

            res.status(200).json(users);
        } else {
            console.error("No users found");
            res.status(404).json({ message: "No users found" });
        }
    } catch (error) {
        res.status(500).json({ error: "External error occurred" });
        console.error(error);
    }
};

import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import userModel from "../models/userModel.js";
import JWT from 'jsonwebtoken'

//Registration Backend
export const registerController = async (req, res) => {

    try {
        const { name, email, password, phone, address, answer } = req.body;
        if (!name) {
            return res.send({ error: "Name is Required" })
        }
        if (!email) {
            return res.send({ error: "Email is Required" })
        }
        if (!password) {
            return res.send({ error: "Password is Required" })
        }
        if (!phone) {
            return res.send({ error: "Password is Required" })
        }
        if (!address) {
            return res.send({ error: "Address is Required" })
        }
        if (!answer) {
            return res.send({ error: "Answer is Required" })
        }

        const existingUser = await userModel.findOne({ email })

        if (existingUser) {
            res.status(200).send({
                success: false,
                message: "Already Register Please Login"
            })
        }

        const hashedPassword = await hashPassword(password)

        const user = new userModel({
            name,
            email,
            phone,
            address,
            password: hashedPassword,
            answer,
        }).save()

        res.status(201).send({
            success: true,
            message: "User Registered Successfully",
            user
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error in Registration",
            error
        })

    }

}


//Login Backend
export const loginController = async (req, res) => {

    try {
        const { email, password } = req.body;

        //validation
        if (!email || !password) {
            return res.status(404).send({
                success: false,
                message: "Invalid Email or Password"
            })
        }

        //check user
        const user = await userModel.findOne({ email })

        if (!user) {
            return res.status(404).send({
                success: false,
                message: "Email Not Found"
            })
        }
        //match password (hashed or original)
        const match = await comparePassword(password, user.password);

        if (!match) {
            return res.status(200).send({
                success: false,
                message: "Invalid Password"
            })
        }

        //create token
        const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRETKEY,
            {
                //token expired
                expiresIn: '7d'

            });
        return res.status(200).send({
            success: true,
            message: "Login Successfully",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role
            }, token
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error in Login",
            error
        })

    }

}

//forgotPasswordController

export const forgotPasswordController = async (req, res) => {
    try {
        const { email, answer, newPassword } = req.body;
        if (!email) {
            res.status(400).send({ message: "Email is required" });
        }
        if (!answer) {
            res.status(400).send({ message: "answer is required" });
        }
        if (!newPassword) {
            res.status(400).send({ message: "New Password is required" });
        }
        //check
        const user = await userModel.findOne({ email, answer });
        //validation
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "Wrong Email Or Answer",
            });
        }
        const hashed = await hashPassword(newPassword);
        await userModel.findByIdAndUpdate(user._id, { password: hashed });
        res.status(200).send({
            success: true,
            message: "Password Reset Successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Something went wrong",
            error,
        });
    }
};


//test controller
export const testController = (req, res) => {
    try {
        res.send("protected route")
    } catch (error) {
        console.log(error)
        res.send({ error })
    }
}

export const updateProfileController = async (req, res) => {
    try {
        const { name, email, password, address, phone } = req.body;

        console.log("Request Body in Controller:", req.body);

        if (!name || !email || !phone) {
            return res.json({ error: "Name, Email, and Phone are required" });
        }

        const user = await userModel.findById(req.user._id);
        //password
        if (password && password.length < 6) {
            return res.json({ error: "Passsword is required and 6 character long" });
        }
        const hashedPassword = password ? await hashPassword(password) : undefined;
        const updatedUser = await userModel.findByIdAndUpdate(
            req.user._id,
            {
                name: name || user.name,
                email: email || user.email, // Ensure email is updated if it's passed
                password: hashedPassword || user.password,
                phone: phone || user.phone,
                address: address || user.address,
            },
            { new: true }
        );
        res.status(200).send({
            success: true,
            message: "Profile Updated SUccessfully",
            updatedUser,
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: "Error WHile Update profile",
            error,
        });
    }
};







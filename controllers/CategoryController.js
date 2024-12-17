import slugify from "slugify";
import CategoryModel from "../models/CategoryModel.js";

export const CreateCategoryController = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(401).send({ message: "Name is Required." })
        }

        const existingCategory = await CategoryModel.findOne({ name });

        if (existingCategory) {
            return res.status(200).send({
                success: true,
                message: "Category Already Exists."
            })
        }

        const category = await new CategoryModel({
            name,
            slug: slugify(name)
        }).save();

        res.status(201).send({
            success: true,
            message: "New Category Created.",
            category
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: "Error in Category"
        })
    }
}

// Update
export const UpdateCategoryController = async (req, res) => {
    try {
        const { name } = req.body;
        const { id } = req.params;
        // new parameter
        const category = await CategoryModel.findByIdAndUpdate(
            id,
            { name, slug: slugify(name) },
            { new: true })
        res.status(200).send({
            success: true,
            message: "Category Updated Successfully.",
            category
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: "Error while updating Category"
        })
    }
}

// Get all categories
export const CategoryController = async (req, res) => {
    try {
        const category = await CategoryModel.find({});
        res.status(200).send({
            success: true,
            message: "All Categories Lists",
            category
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: "Error while Getting Categories"
        })
    }
}

// Single Category
export const SingleCategoryController = async (req, res) => {
    try {
        const category = await CategoryModel.findOne({ slug: req.params.slug })
        res.status(200).send({
            success: true,
            message: "Single Category.",
            category
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: "Error while Getting Category"
        })

    }
}

export const DeleteCategoryController = async (req, res) => {
    try {
        const { id } = req.params;
        // new parameter
        await CategoryModel.findByIdAndDelete(id)
        res.status(200).send({
            success: true,
            message: "Category Deleted Successfully.",
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: "Error while Deleting Category"
        })
    }
}
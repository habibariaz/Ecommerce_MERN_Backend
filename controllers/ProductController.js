import slugify from "slugify";
import ProductModel from "../models/ProductModel.js"
import fs from 'fs'

export const CreateProductController = async (req, res) => {

    try {
        const { name, description, price, category, quantity, shipping } = req.fields;
        const { photo } = req.files

        // validation
        switch (true) {
            case !name:
                return res.status(500).send({ error: "Name Required" })

            case !description:
                return res.status(500).send({ error: "Description Required" })

            case !price:
                return res.status(500).send({ error: "Price Required" })

            case !category:
                return res.status(500).send({ error: "Category Required" })

            case !quantity:
                return res.status(500).send({ error: "Quantity Required" })

            case !shipping:
                return res.status(500).send({ error: "Shiipping Required" })

            case !photo:
                return res.status(500).send({ error: "Photo Required" })
        }


        const products = new ProductModel({ ...req.fields, slug: slugify(name) });
        if (photo) {
            products.photo.data = fs.readFileSync(photo.path)
            products.photo.contentType = photo.type
        }

        await products.save()
        res.status(201).send({
            success: true,
            message: "Product Created Successfully",
            products
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: "Error in Creating Product"
        })
    }
}

// Get All Products
export const GetProductController = async (req, res) => {
    try {
        const product = await ProductModel.find({})
            .populate("category")
            .select("-photo")
            .limit(12)
            .sort({ createdAt: -1 })
        res.status(200).send({
            success: true,
            countTotal: product.length,
            message: "All Products",
            product
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: "Error while Getting Products"
        })
    }
}

// Get Single Product 
export const GetSingleProductController = async (req, res) => {
    try {
        const product = await ProductModel.findOne({ slug: req.params.slug })
            .select("-photo")
            .populate("category")
        res.status(200).send({
            success: true,
            message: "Single Product",
            product
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: "Error while Getting Single Product"
        })
    }
}

// Get photo
export const ProductPhotoController = async (req, res) => {
    try {
        const product = await ProductModel.findById(req.params.pid).select("photo");
        if (product.photo.data) {
            res.set("Content-type", product.photo.contentType);
            return res.status(200).send(product.photo.data);
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: "Error while Getting Product Photo"
        })
    }
}

// Delete Product
export const DeleteProductController = async (req, res) => {
    try {
        await ProductModel.findByIdAndDelete(req.params.pid)
            .select("-photo")
        res.status(200).send({
            success: true,
            message: "Product Deleted",
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: "Error while Deleting Product"
        })
    }
}

export const UpdateProductController = async (req, res) => {
    try {
        const { name, description, price, category, quantity, shipping } =
            req.fields;
        const { photo } = req.files;
        //alidation
        switch (true) {
            case !name:
                return res.status(500).send({ error: "Name is Required" });
            case !description:
                return res.status(500).send({ error: "Description is Required" });
            case !price:
                return res.status(500).send({ error: "Price is Required" });
            case !category:
                return res.status(500).send({ error: "Category is Required" });
            case !quantity:
                return res.status(500).send({ error: "Quantity is Required" });
            case photo && photo.size > 1000000:
                return res
                    .status(500)
                    .send({ error: "photo is Required and should be less then 1mb" });
        }

        const products = await ProductModel.findByIdAndUpdate(
            req.params.pid,
            { ...req.fields, slug: slugify(name) },
            { new: true }
        );
        if (photo) {
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType = photo.type;
        }
        await products.save();
        res.status(201).send({
            success: true,
            message: "Product Updated Successfully",
            products,
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error in Update product",
        });
    }
};

// filters porducts by category and price
export const productFiltersController = async (req, res) => {
    try {
        const { checked = [], radio = [] } = req.body; // Provide defaults
        let args = {};

        // Filter by category
        if (checked.length > 0) args.category = { $in: checked };

        // Filter by price range
        if (radio.length === 2) {
            args.price = { $gte: Number(radio[0]), $lte: Number(radio[1]) };
        }

        const products = await ProductModel.find(args);
        res.status(200).send({
            success: true,
            products,
        });
    } catch (error) {
        console.error("Error while filtering products:", error.message);
        res.status(400).send({
            success: false,
            message: "Error while filtering products",
            error: error.message,
        });
    }
};

// product count
export const productCountController = async (req, res) => {
    try {
        const total = await ProductModel.find({}).estimatedDocumentCount();
        res.status(200).send({
            success: true,
            total,
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({
            message: "Error in product count",
            error,
            success: false,
        });
    }
};

// product list base on page
export const productListController = async (req, res) => {
    try {
        const perPage = 2;
        const page = req.params.page ? req.params.page : 1;
        const products = await ProductModel
            .find({})
            .select("-photo")
            .skip((page - 1) * perPage)
            .limit(perPage)
            .sort({ createdAt: -1 });
        res.status(200).send({
            success: true,
            products,
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: "error in per page ctrl",
            error,
        });
    }
};

// similar products
export const realtedProductController = async (req, res) => {
    try {
        const { pid, cid } = req.params;
        const products = await ProductModel
            .find({
                category: cid,
                _id: { $ne: pid },
            })
            .select("-photo")
            .limit(3)
            .populate("category");
        res.status(200).send({
            success: true,
            products,
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: "error while geting related product",
            error,
        });
    }
};







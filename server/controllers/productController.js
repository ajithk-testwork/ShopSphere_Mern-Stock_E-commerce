import Product from "../models/Product.js";



//Create Product

export const createPrdouct = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Product image required" });
    }

    const product = await Product.create({
      ...req.body,
      image: `/uploads/productImages/${req.file.filename}`,
      createBy: req.user._id,
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// Get All Product

export const getProduct = async (req, res) =>{
    try{
        const products = await Product.find().sort({ createdAt: -1 });
        res.json(products)
    }catch(error){
        return res.status(500).json({ message: error.message})
    }
}



//Get Single Produc

export const getProductId = async (req, res) =>{
    const product = await Product.findById(req.params.id);

    if(!product){
        return res.status(404).json({ message: "Product not Found"});
    };


    res.status(200).json(product);
}



//Update Product Admin

export const updateProduct = async (req, res) =>{
    const product = await Product.findById(req.params.id);

    if(!product){
       return res.status(404).json({ message: "Product not found" }); 
    }

    Object.assign(product, req.body);
    await product.save();

    res.json(product);
}



//Delete Product

export const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  await product.deleteOne();
  res.json({ message: "Product removed" });
};
import Cart from "../models/Cart.js";

// =======================
// 🟢 ADD TO CART
// =======================
export const addToCart = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authorized" });
    }

    const { productId, quantity } = req.body;

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [{ product: productId, quantity }],
      });
    } else {
      const itemIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity });
      }

      await cart.save();
    }

    res.json(cart);
  } catch (error) {
    console.error("AddToCart Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// =======================
// 🟢 GET CART
// =======================
export const getCart = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authorized" });
    }

    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product"
    );

    // ✅ prevent null crash in frontend
    if (!cart) {
      return res.json({ items: [] });
    }

    res.json(cart);
  } catch (error) {
    console.error("GetCart Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// =======================
// 🟢 UPDATE QUANTITY
// =======================
export const updateCartItem = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authorized" });
    }

    const { productId, quantity } = req.body;

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    item.quantity = quantity;
    await cart.save();

    res.json(cart);
  } catch (error) {
    console.error("UpdateCart Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// =======================
// 🟢 REMOVE ITEM
// =======================
export const removeCartItem = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authorized" });
    }

    const { productId } = req.body;

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();

    res.json(cart);
  } catch (error) {
    console.error("RemoveCart Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
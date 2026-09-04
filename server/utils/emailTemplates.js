const baseTemplate = (content) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>

<body style="
  margin:0;
  padding:0;
  background:#f4f4f5;
  font-family:Arial, Helvetica, sans-serif;
">

  <div style="
    max-width:600px;
    margin:30px auto;
    background:#ffffff;
    border-radius:12px;
    overflow:hidden;
    box-shadow:0 2px 10px rgba(0,0,0,0.08);
  ">

    <!-- HEADER -->

    <div style="
      background:#000000;
      padding:25px;
      text-align:center;
    ">

      <h1 style="
        margin:0;
        color:#ffffff;
        font-size:28px;
      ">
        ShopSphere 🛒
      </h1>

      <p style="
        margin:8px 0 0;
        color:#cccccc;
        font-size:14px;
      ">
        Redefining Retail
      </p>

    </div>

    <!-- CONTENT -->

    <div style="
      padding:35px 30px;
    ">

      ${content}

    </div>

    <!-- FOOTER -->

    <div style="
      background:#f8f8f8;
      padding:20px;
      text-align:center;
      color:#777777;
      font-size:12px;
    ">

      <p style="margin:0;">
        © ${new Date().getFullYear()} ShopSphere
      </p>

      <p style="margin:8px 0 0;">
        Thank you for shopping with us.
      </p>

    </div>

  </div>

</body>
</html>
`;


// ==========================================
// WELCOME EMAIL
// ==========================================

export const welcomeEmail = (name) =>
  baseTemplate(`

    <h2 style="color:#111;">
      Welcome to ShopSphere 🎉
    </h2>

    <p>Hello <strong>${name}</strong>,</p>

    <p>
      Your ShopSphere account has been created successfully.
    </p>

    <p>
      You can now explore our products, add items to your cart
      and enjoy a seamless shopping experience.
    </p>

    <div style="
      background:#f4f4f5;
      padding:15px;
      border-radius:8px;
      margin-top:20px;
    ">
      <strong>Account Created Successfully ✓</strong>
    </div>

    <p style="margin-top:25px;">
      Happy Shopping! 🛍️
    </p>

  `);


// ==========================================
// FORGOT PASSWORD OTP
// ==========================================

export const forgotPasswordEmail = (otp) =>
  baseTemplate(`

    <h2 style="color:#111;">
      Password Reset 🔐
    </h2>

    <p>
      We received a request to reset your ShopSphere password.
    </p>

    <p>
      Your verification OTP is:
    </p>

    <div style="
      background:#f4f4f5;
      padding:20px;
      text-align:center;
      border-radius:10px;
      margin:20px 0;
    ">

      <span style="
        font-size:32px;
        font-weight:bold;
        letter-spacing:8px;
      ">
        ${otp}
      </span>

    </div>

    <p>
      This OTP will expire in <strong>10 minutes</strong>.
    </p>

    <p style="color:#777;">
      If you did not request a password reset, you can safely ignore
      this email.
    </p>

  `);


// ==========================================
// PASSWORD CHANGED
// ==========================================

export const passwordChangedEmail = (name) =>
  baseTemplate(`

    <h2 style="color:#111;">
      Password Changed Successfully ✅
    </h2>

    <p>Hello <strong>${name}</strong>,</p>

    <p>
      Your ShopSphere password has been successfully changed.
    </p>

    <div style="
      background:#f4f4f5;
      padding:15px;
      border-radius:8px;
      margin-top:20px;
    ">

      <strong>Your account is now protected with your new password.</strong>

    </div>

    <p style="margin-top:25px;">
      If you did not make this change, please contact support immediately.
    </p>

  `);


// ==========================================
// ORDER RECEIVED
// ==========================================

export const orderReceivedEmail = (name, order) =>
  baseTemplate(`

    <h2 style="color:#111;">
      Order Received 🛒
    </h2>

    <p>Hello <strong>${name}</strong>,</p>

    <p>
      We've received your order successfully.
    </p>

    <div style="
      background:#f4f4f5;
      padding:18px;
      border-radius:8px;
      margin:20px 0;
    ">

      <p>
        <strong>Order ID:</strong>
        ${order._id}
      </p>

      <p>
        <strong>Total:</strong>
        ₹${order.totalAmount}
      </p>

      <p>
        <strong>Status:</strong>
        Processing
      </p>

    </div>

    <p>
      We'll send you another email when your order is shipped.
    </p>

  `);


// ==========================================
// PAYMENT SUCCESS
// ==========================================

export const paymentSuccessEmail = (name, order) =>
  baseTemplate(`

    <h2 style="color:#111;">
      Payment Successful 💳
    </h2>

    <p>Hello <strong>${name}</strong>,</p>

    <p>
      Your payment has been successfully received.
    </p>

    <div style="
      background:#f4f4f5;
      padding:18px;
      border-radius:8px;
      margin:20px 0;
    ">

      <p>
        <strong>Order ID:</strong>
        ${order._id}
      </p>

      <p>
        <strong>Amount Paid:</strong>
        ₹${order.totalAmount}
      </p>

      <p>
        <strong>Payment Status:</strong>
        Paid ✓
      </p>

    </div>

    <p>
      Your order is now being processed.
    </p>

  `);


// ==========================================
// ORDER SHIPPED
// ==========================================

export const orderShippedEmail = (name, order) =>
  baseTemplate(`

    <h2 style="color:#111;">
      Your Order Has Shipped 🚚
    </h2>

    <p>Hello <strong>${name}</strong>,</p>

    <p>
      Great news! Your ShopSphere order is on its way.
    </p>

    <div style="
      background:#f4f4f5;
      padding:18px;
      border-radius:8px;
    ">

      <p>
        <strong>Order ID:</strong>
        ${order._id}
      </p>

      <p>
        <strong>Status:</strong>
        Shipped 🚚
      </p>

    </div>

    <p style="margin-top:25px;">
      We'll let you know once your order is delivered.
    </p>

  `);


// ==========================================
// ORDER DELIVERED
// ==========================================

export const orderDeliveredEmail = (name, order) =>
  baseTemplate(`

    <h2 style="color:#111;">
      Order Delivered 📦
    </h2>

    <p>Hello <strong>${name}</strong>,</p>

    <p>
      Your ShopSphere order has been delivered successfully.
    </p>

    <div style="
      background:#f4f4f5;
      padding:18px;
      border-radius:8px;
    ">

      <p>
        <strong>Order ID:</strong>
        ${order._id}
      </p>

      <p>
        <strong>Status:</strong>
        Delivered ✓
      </p>

    </div>

    <p style="margin-top:25px;">
      Thank you for shopping with ShopSphere! ❤️
    </p>

  `);
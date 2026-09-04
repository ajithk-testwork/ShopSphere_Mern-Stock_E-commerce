// =====================================================
// SHOPSPHERE EMAIL TEMPLATES
// =====================================================

// =====================================================
// BASE EMAIL TEMPLATE
// =====================================================

const baseTemplate = (content) => `
<!DOCTYPE html>

<html>

<head>

  <meta charset="UTF-8" />

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  />

  <title>ShopSphere</title>

</head>


<body
  style="
    margin:0;
    padding:0;
    background:#f4f4f5;
    font-family:Arial, Helvetica, sans-serif;
    color:#111827;
  "
>


  <!-- MAIN CONTAINER -->

  <div
    style="
      max-width:600px;
      margin:30px auto;
      background:#ffffff;
      border-radius:14px;
      overflow:hidden;
      box-shadow:0 2px 12px rgba(0,0,0,0.08);
    "
  >


    <!-- ================================================= -->
    <!-- HEADER -->
    <!-- ================================================= -->

    <div
      style="
        background:#000000;
        padding:26px 20px;
        text-align:center;
      "
    >

      <h1
        style="
          margin:0;
          color:#ffffff;
          font-size:28px;
          line-height:1.2;
        "
      >
        ShopSphere 🛒
      </h1>


      <p
        style="
          margin:8px 0 0;
          color:#cccccc;
          font-size:14px;
        "
      >
        Redefining Retail
      </p>

    </div>


    <!-- ================================================= -->
    <!-- CONTENT -->
    <!-- ================================================= -->

    <div
      style="
        padding:32px 28px;
      "
    >

      ${content}

    </div>


    <!-- ================================================= -->
    <!-- FOOTER -->
    <!-- ================================================= -->

    <div
      style="
        background:#f8f8f8;
        padding:20px;
        text-align:center;
        color:#777777;
        font-size:12px;
      "
    >

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

// =====================================================
// HELPER - FORMAT RUPEES
// =====================================================

const formatPrice = (value) => {
  const amount = Number(value || 0);

  return amount.toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
};

// =====================================================
// HELPER - PRODUCT DETAILS
// =====================================================

const orderProductsHtml = (order) => {
  if (!order?.items || order.items.length === 0) {
    return `
      <div
        style="
          padding:16px;
          background:#f4f4f5;
          border-radius:10px;
          text-align:center;
          color:#777;
        "
      >
        No product details available.
      </div>
    `;
  }

  return order.items
    .map((item) => {
      const name = item?.name || item?.product?.name || "Product";

      const image = item?.image || item?.product?.image || "";

      const quantity = Number(item?.quantity || 0);

      const price = Number(item?.price ?? item?.product?.price ?? 0);

      const itemTotal = price * quantity;

      return `

        <!-- PRODUCT CARD -->

        <div
          style="
            border:1px solid #e5e7eb;
            border-radius:12px;
            padding:14px;
            margin-bottom:12px;
            background:#ffffff;
          "
        >

          <table
            width="100%"
            cellpadding="0"
            cellspacing="0"
            border="0"
          >

            <tr>


              <!-- PRODUCT IMAGE -->

              <td
                width="90"
                valign="top"
                style="
                  padding-right:12px;
                "
              >

                ${
                  image
                    ? `
                      <img
                        src="${image}"
                        alt="${name}"
                        width="78"
                        height="78"
                        style="
                          width:78px;
                          height:78px;
                          object-fit:cover;
                          border-radius:9px;
                          display:block;
                          border:1px solid #eeeeee;
                        "
                      />
                    `
                    : `
                      <div
                        style="
                          width:78px;
                          height:78px;
                          background:#f4f4f5;
                          border-radius:9px;
                          text-align:center;
                          line-height:78px;
                          color:#999999;
                          font-size:11px;
                        "
                      >
                        No Image
                      </div>
                    `
                }

              </td>


              <!-- PRODUCT INFORMATION -->

              <td
                valign="top"
              >

                <!-- PRODUCT NAME -->

                <p
                  style="
                    margin:0 0 8px;
                    font-size:15px;
                    font-weight:bold;
                    color:#111827;
                    line-height:1.4;
                  "
                >
                  ${name}
                </p>


                <!-- QUANTITY -->

                <p
                  style="
                    margin:4px 0;
                    font-size:13px;
                    color:#6b7280;
                  "
                >
                  Quantity:
                  <strong>${quantity}</strong>
                </p>


                <!-- UNIT PRICE -->

                <p
                  style="
                    margin:4px 0;
                    font-size:13px;
                    color:#6b7280;
                  "
                >
                  Unit Price:
                  <strong>
                    ₹${formatPrice(price)}
                  </strong>
                </p>


                <!-- PRODUCT TOTAL -->

                <p
                  style="
                    margin:7px 0 0;
                    font-size:14px;
                    font-weight:bold;
                    color:#111827;
                  "
                >
                  Product Total:
                  ₹${formatPrice(itemTotal)}
                </p>

              </td>

            </tr>

          </table>

        </div>

      `;
    })
    .join("");
};

// =====================================================
// HELPER - ORDER SUMMARY
// =====================================================

const orderSummaryHtml = (order, status, statusIcon = "") => `

  <div
    style="
      background:#f4f4f5;
      padding:18px;
      border-radius:10px;
      margin:20px 0;
    "
  >


    <p
      style="
        margin:0 0 10px;
        font-size:13px;
      "
    >

      <strong>
        Order ID:
      </strong>

      ${order?._id || "-"}

    </p>


    <p
      style="
        margin:0 0 10px;
        font-size:13px;
      "
    >

      <strong>
        Order Total:
      </strong>

      ₹${formatPrice(order?.totalAmount)}

    </p>


    <p
      style="
        margin:0;
        font-size:13px;
      "
    >

      <strong>
        Status:
      </strong>

      ${statusIcon} ${status}

    </p>


  </div>

`;

// =====================================================
// HELPER - SHIPPING ADDRESS
// =====================================================

const shippingAddressHtml = (order) => {
  const address = order?.shippingAddress;

  if (!address) {
    return "";
  }

  return `

    <!-- SHIPPING ADDRESS -->

    <h3
      style="
        color:#111827;
        margin:28px 0 14px;
        font-size:17px;
      "
    >
      Shipping Address 📍
    </h3>


    <div
      style="
        background:#f9fafb;
        border:1px solid #e5e7eb;
        border-radius:10px;
        padding:16px;
      "
    >

      <p
        style="
          margin:0 0 7px;
          font-size:14px;
          font-weight:bold;
          color:#111827;
        "
      >
        ${address.fullName || ""}
      </p>


      <p
        style="
          margin:4px 0;
          font-size:13px;
          color:#6b7280;
        "
      >
        ${address.address || ""}
      </p>


      <p
        style="
          margin:4px 0;
          font-size:13px;
          color:#6b7280;
        "
      >
        ${address.city || ""}
        ${address.city ? "," : ""}
        ${address.postalCode || ""}
      </p>


      <p
        style="
          margin:4px 0;
          font-size:13px;
          color:#6b7280;
        "
      >
        ${address.country || ""}
      </p>


      ${
        address.phone
          ? `
            <p
              style="
                margin:10px 0 0;
                padding-top:10px;
                border-top:1px solid #e5e7eb;
                font-size:13px;
                color:#374151;
              "
            >
              📞 ${address.phone}
            </p>
          `
          : ""
      }

    </div>

  `;
};

// =====================================================
// WELCOME EMAIL
// =====================================================

export const welcomeEmail = (name) =>
  baseTemplate(`

    <h2
      style="
        color:#111827;
        margin-top:0;
      "
    >
      Welcome to ShopSphere 🎉
    </h2>


    <p>
      Hello <strong>${name}</strong>,
    </p>


    <p>
      Your ShopSphere account has been created successfully.
    </p>


    <p>
      You can now explore our products, add items to your cart
      and enjoy a seamless shopping experience.
    </p>


    <div
      style="
        background:#f4f4f5;
        padding:15px;
        border-radius:8px;
        margin-top:20px;
      "
    >

      <strong>
        Account Created Successfully ✓
      </strong>

    </div>


    <p
      style="
        margin-top:25px;
      "
    >
      Happy Shopping! 🛍️
    </p>

  `);

// =====================================================
// LOGIN ALERT
// =====================================================

export const loginEmail = (name) =>
  baseTemplate(`

    <h2
      style="
        color:#111827;
        margin-top:0;
      "
    >
      New Login to Your ShopSphere Account 🔐
    </h2>


    <p>
      Hello <strong>${name}</strong>,
    </p>


    <p>
      Your ShopSphere account was just logged in successfully.
    </p>


    <div
      style="
        background:#f4f4f5;
        padding:18px;
        border-radius:10px;
        margin:20px 0;
      "
    >

      <p
        style="
          margin:0 0 10px;
        "
      >

        <strong>
          Login Status:
        </strong>

        Successful ✓

      </p>


      <p
        style="
          margin:0;
        "
      >

        <strong>
          Time:
        </strong>

        ${new Date().toLocaleString("en-IN")}

      </p>

    </div>


    <p>
      If this wasn't you, please change your password immediately.
    </p>

  `);

// =====================================================
// FORGOT PASSWORD OTP
// =====================================================

export const forgotPasswordEmail = (otp) =>
  baseTemplate(`

    <h2
      style="
        color:#111827;
        margin-top:0;
      "
    >
      Password Reset 🔐
    </h2>


    <p>
      We received a request to reset your ShopSphere password.
    </p>


    <p>
      Your verification OTP is:
    </p>


    <div
      style="
        background:#f4f4f5;
        padding:20px;
        text-align:center;
        border-radius:10px;
        margin:20px 0;
      "
    >

      <span
        style="
          font-size:32px;
          font-weight:bold;
          letter-spacing:8px;
        "
      >
        ${otp}
      </span>

    </div>


    <p>
      This OTP will expire in
      <strong>10 minutes</strong>.
    </p>


    <p
      style="
        color:#777;
      "
    >
      If you did not request a password reset,
      you can safely ignore this email.
    </p>

  `);

// =====================================================
// PASSWORD CHANGED
// =====================================================

export const passwordChangedEmail = (name) =>
  baseTemplate(`

    <h2
      style="
        color:#111827;
        margin-top:0;
      "
    >
      Password Changed Successfully ✅
    </h2>


    <p>
      Hello <strong>${name}</strong>,
    </p>


    <p>
      Your ShopSphere password has been successfully changed.
    </p>


    <div
      style="
        background:#f4f4f5;
        padding:15px;
        border-radius:8px;
        margin-top:20px;
      "
    >

      <strong>
        Your account is now protected with your new password.
      </strong>

    </div>


    <p
      style="
        margin-top:25px;
      "
    >
      If you did not make this change,
      please contact support immediately.
    </p>

  `);

// =====================================================
// ORDER RECEIVED
// =====================================================

export const orderReceivedEmail = (name, order) =>
  baseTemplate(`

    <h2
      style="
        color:#111827;
        margin-top:0;
      "
    >
      Order Received 🛒
    </h2>


    <p>
      Hello <strong>${name}</strong>,
    </p>


    <p>
      We've received your ShopSphere order successfully.
    </p>


    ${orderSummaryHtml(order, "Processing", "🔄")}


    <!-- PRODUCTS -->

    <h3
      style="
        color:#111827;
        margin:26px 0 14px;
        font-size:17px;
      "
    >
      Your Products 🛍️
    </h3>


    ${orderProductsHtml(order)}


    <!-- TOTAL -->

    <div
      style="
        border-top:2px solid #111827;
        margin-top:20px;
        padding-top:15px;
        text-align:right;
      "
    >

      <span
        style="
          font-size:17px;
          font-weight:bold;
        "
      >

        Order Total:
        ₹${formatPrice(order?.totalAmount)}

      </span>

    </div>


    ${shippingAddressHtml(order)}


    <p
      style="
        margin-top:25px;
      "
    >
      We'll send you another email when your order is shipped.
    </p>

  `);

// =====================================================
// PAYMENT SUCCESS
// =====================================================

export const paymentSuccessEmail = (name, order) =>
  baseTemplate(`

    <h2
      style="
        color:#111827;
        margin-top:0;
      "
    >
      Payment Successful 💳
    </h2>


    <p>
      Hello <strong>${name}</strong>,
    </p>


    <p>
      Your payment has been successfully received.
    </p>


    <!-- PAYMENT SUMMARY -->

    <div
      style="
        background:#f4f4f5;
        padding:18px;
        border-radius:10px;
        margin:20px 0;
      "
    >

      <p
        style="
          margin:0 0 10px;
        "
      >

        <strong>
          Order ID:
        </strong>

        ${order?._id || "-"}

      </p>


      <p
        style="
          margin:0 0 10px;
        "
      >

        <strong>
          Amount Paid:
        </strong>

        ₹${formatPrice(order?.totalAmount)}

      </p>


      <p
        style="
          margin:0;
        "
      >

        <strong>
          Payment Status:
        </strong>

        Paid ✓

      </p>

    </div>


    <!-- PRODUCTS -->

    <h3
      style="
        color:#111827;
        margin:26px 0 14px;
        font-size:17px;
      "
    >
      Purchased Products 🛍️
    </h3>


    ${orderProductsHtml(order)}


    <!-- TOTAL -->

    <div
      style="
        border-top:2px solid #111827;
        margin-top:20px;
        padding-top:15px;
        text-align:right;
      "
    >

      <span
        style="
          font-size:17px;
          font-weight:bold;
        "
      >

        Total Paid:
        ₹${formatPrice(order?.totalAmount)}

      </span>

    </div>


    ${shippingAddressHtml(order)}


    <p
      style="
        margin-top:25px;
      "
    >
      Your order is now being processed.
    </p>

  `);

// =====================================================
// PAYMENT FAILED
// =====================================================

export const paymentFailedEmail = (name, order) =>
  baseTemplate(`

    <h2
      style="
        color:#111827;
        margin-top:0;
      "
    >
      Payment Unsuccessful ❌
    </h2>


    <p>
      Hello <strong>${name}</strong>,
    </p>


    <p>
      We could not complete the payment for your ShopSphere order.
    </p>


    <!-- PAYMENT FAILURE SUMMARY -->

    <div
      style="
        background:#f4f4f5;
        padding:18px;
        border-radius:10px;
        margin:20px 0;
      "
    >

      <p
        style="
          margin:0 0 10px;
        "
      >

        <strong>
          Order ID:
        </strong>

        ${order?._id || "-"}

      </p>


      <p
        style="
          margin:0 0 10px;
        "
      >

        <strong>
          Amount:
        </strong>

        ₹${formatPrice(order?.totalAmount)}

      </p>


      <p
        style="
          margin:0;
        "
      >

        <strong>
          Payment Status:
        </strong>

        Cancelled / Failed ❌

      </p>

    </div>


    <!-- PRODUCTS -->

    <h3
      style="
        color:#111827;
        margin:26px 0 14px;
        font-size:17px;
      "
    >
      Order Products 🛍️
    </h3>


    ${orderProductsHtml(order)}


    <!-- TOTAL -->

    <div
      style="
        border-top:2px solid #111827;
        margin-top:20px;
        padding-top:15px;
        text-align:right;
      "
    >

      <span
        style="
          font-size:17px;
          font-weight:bold;
        "
      >

        Order Total:
        ₹${formatPrice(order?.totalAmount)}

      </span>

    </div>


    ${shippingAddressHtml(order)}


    <p
      style="
        margin-top:25px;
      "
    >
      You can try the payment again from your ShopSphere orders page.
    </p>

  `);

// =====================================================
// ORDER SHIPPED
// =====================================================

export const orderShippedEmail = (name, order) =>
  baseTemplate(`

    <h2
      style="
        color:#111827;
        margin-top:0;
      "
    >
      Your Order Has Shipped 🚚
    </h2>


    <p>
      Hello <strong>${name}</strong>,
    </p>


    <p>
      Great news! Your ShopSphere order is now on its way.
    </p>


    <!-- SHIPPING SUMMARY -->

    ${orderSummaryHtml(order, "Shipped", "🚚")}


    <!-- PRODUCTS -->

    <h3
      style="
        color:#111827;
        margin:26px 0 14px;
        font-size:17px;
      "
    >
      Products in Your Order 🛍️
    </h3>


    ${orderProductsHtml(order)}


    <!-- TOTAL -->

    <div
      style="
        border-top:2px solid #111827;
        margin-top:20px;
        padding-top:15px;
        text-align:right;
      "
    >

      <span
        style="
          font-size:17px;
          font-weight:bold;
        "
      >

        Order Total:
        ₹${formatPrice(order?.totalAmount)}

      </span>

    </div>


    ${shippingAddressHtml(order)}


    <div
      style="
        background:#f0fdf4;
        border:1px solid #bbf7d0;
        border-radius:10px;
        padding:15px;
        margin-top:25px;
      "
    >

      <strong>
        🚚 Your order is on the way!
      </strong>

      <p
        style="
          margin:7px 0 0;
          font-size:13px;
          color:#4b5563;
        "
      >
        We'll let you know once your order has been delivered.
      </p>

    </div>

  `);

// =====================================================
// ORDER DELIVERED
// =====================================================

export const orderDeliveredEmail = (name, order) =>
  baseTemplate(`

    <h2
      style="
        color:#111827;
        margin-top:0;
      "
    >
      Order Delivered 📦
    </h2>


    <p>
      Hello <strong>${name}</strong>,
    </p>


    <p>
      Your ShopSphere order has been delivered successfully.
    </p>


    <!-- DELIVERY SUMMARY -->

    ${orderSummaryHtml(order, "Delivered", "✓")}


    <!-- PRODUCTS -->

    <h3
      style="
        color:#111827;
        margin:26px 0 14px;
        font-size:17px;
      "
    >
      Delivered Products 🛍️
    </h3>


    ${orderProductsHtml(order)}


    <!-- TOTAL -->

    <div
      style="
        border-top:2px solid #111827;
        margin-top:20px;
        padding-top:15px;
        text-align:right;
      "
    >

      <span
        style="
          font-size:17px;
          font-weight:bold;
        "
      >

        Order Total:
        ₹${formatPrice(order?.totalAmount)}

      </span>

    </div>


    ${shippingAddressHtml(order)}


    <div
      style="
        background:#f0fdf4;
        border:1px solid #bbf7d0;
        border-radius:10px;
        padding:15px;
        margin-top:25px;
      "
    >

      <strong>
        📦 Delivery Completed ✓
      </strong>

      <p
        style="
          margin:7px 0 0;
          font-size:13px;
          color:#4b5563;
        "
      >
        Your order has been successfully delivered.
      </p>

    </div>


    <p
      style="
        margin-top:25px;
      "
    >
      We hope you enjoy your purchase! ❤️
    </p>


    <p>
      Thank you for shopping with ShopSphere.
    </p>

  `);

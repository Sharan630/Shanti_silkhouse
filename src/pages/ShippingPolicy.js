import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import './ShippingPolicy.css';

const ShippingPolicy = () => {
  return (
    <div className="policy-page">
      <div className="policy-container">
        <Link to="/" className="back-btn">
          <FiArrowLeft />
          Back to Home
        </Link>
        
        <div className="policy-content">
          <h1>Shipping Policy</h1>
          
          <section>
            <h2>Shipping Information</h2>
            <p>
              At Shnatisilks, we are committed to delivering your orders safely and on time. This Shipping Policy outlines our shipping methods, timelines, and terms to ensure a smooth delivery experience.
            </p>
          </section>

          <section>
            <h2>Shipping Locations</h2>
            <p>
              We currently ship to addresses within India. We are working on expanding our shipping services to international locations. Please check back with us or contact our customer service team for updates on international shipping availability.
            </p>
          </section>

          <section>
            <h2>Processing Time</h2>
            <p>
              All orders are processed within 1-3 business days (Monday through Friday, excluding public holidays) after receiving your order confirmation.
            </p>
            <ul>
              <li><strong>Standard Orders:</strong> Processed within 1-2 business days</li>
              <li><strong>Customized Orders:</strong> May take 5-7 business days for processing</li>
              <li><strong>Bulk Orders:</strong> Processing time may vary; our team will contact you with estimated timelines</li>
            </ul>
            <p>
              Orders placed on weekends or holidays will begin processing on the next business day.
            </p>
          </section>

          <section>
            <h2>Shipping Methods and Delivery Times</h2>
            <p>
              We offer various shipping options to suit your needs:
            </p>
            <ul>
              <li><strong>Standard Shipping:</strong> 5-7 business days - Free for orders above ₹2,000</li>
              <li><strong>Express Shipping:</strong> 2-4 business days - Additional charges apply</li>
              <li><strong>Priority Shipping:</strong> 1-2 business days - Available in select cities, additional charges apply</li>
            </ul>
            <p>
              Delivery times are estimated and start from the date of dispatch, not the date of order placement. Delivery times may be affected by factors beyond our control, including weather conditions, transportation delays, or incorrect address information.
            </p>
          </section>

          <section>
            <h2>Shipping Charges</h2>
            <p>
              Shipping charges are calculated based on the delivery location, weight of the package, and the shipping method selected:
            </p>
            <ul>
              <li>Orders above ₹2,000: Free standard shipping within India</li>
              <li>Orders below ₹2,000: Shipping charges as per the courier partner rates</li>
              <li>Express and Priority shipping: Additional charges will be displayed at checkout</li>
              <li>Cash on Delivery (COD): Additional COD charges may apply</li>
            </ul>
            <p>
              All shipping charges are displayed at checkout before you confirm your order.
            </p>
          </section>

          <section>
            <h2>Order Tracking</h2>
            <p>
              Once your order is dispatched, you will receive:
            </p>
            <ul>
              <li>A confirmation email with your order details</li>
              <li>A shipping confirmation email with your tracking number</li>
              <li>Updates via SMS on your registered mobile number</li>
            </ul>
            <p>
              You can track your order using the tracking number provided in the shipping confirmation email. You can also track your order on our website by logging into your account or using the "Track Order" feature.
            </p>
          </section>

          <section>
            <h2>Delivery Address</h2>
            <p>
              Please ensure that your delivery address is complete and accurate. We are not responsible for delays or failed deliveries due to:
            </p>
            <ul>
              <li>Incorrect or incomplete address information</li>
              <li>Recipient not available at the time of delivery</li>
              <li>Inaccessible delivery location</li>
              <li>Restrictions in the delivery area</li>
            </ul>
            <p>
              If you need to change your delivery address after placing an order, please contact us immediately at help@shnatisilks.com or call +91 90664 14414. Address changes can only be made before the order is dispatched.
            </p>
          </section>

          <section>
            <h2>Delivery Attempts</h2>
            <p>
              Our courier partners will make up to 3 delivery attempts. If delivery is unsuccessful after all attempts:
            </p>
            <ul>
              <li>The package will be returned to our warehouse</li>
              <li>We will contact you to arrange for re-delivery</li>
              <li>Additional shipping charges may apply for re-delivery</li>
              <li>If re-delivery cannot be arranged within 15 days, the order will be cancelled and a refund will be processed (excluding original shipping charges)</li>
            </ul>
          </section>

          <section>
            <h2>Receiving Your Order</h2>
            <p>
              When you receive your order, please:
            </p>
            <ol>
              <li>Check the package for any visible damage before accepting it</li>
              <li>If the package appears damaged, please refuse the delivery and contact us immediately</li>
              <li>Open the package and inspect the items carefully</li>
              <li>If you notice any issues, contact us within 24 hours of delivery</li>
              <li>Keep the original packaging until you are satisfied with your purchase</li>
            </ol>
          </section>

          <section>
            <h2>Undelivered Orders</h2>
            <p>
              If your order is returned to us as undelivered, we will:
            </p>
            <ul>
              <li>Contact you to verify the delivery address</li>
              <li>Arrange for re-delivery (additional charges may apply)</li>
              <li>Process a refund if re-delivery is not possible (original shipping charges are non-refundable)</li>
            </ul>
          </section>

          <section>
            <h2>International Shipping</h2>
            <p>
              International shipping is currently not available. We are working on expanding our services to international customers. Please contact us at help@shnatisilks.com for updates on international shipping availability.
            </p>
          </section>

          <section>
            <h2>Holidays and Peak Seasons</h2>
            <p>
              During peak shopping seasons (festivals, sales, etc.), processing and delivery times may be extended. We will notify you of any significant delays via email or SMS.
            </p>
            <p>
              Orders placed during public holidays will be processed on the next business day.
            </p>
          </section>

          <section>
            <h2>Contact Us</h2>
            <p>
              If you have any questions or concerns about shipping, please contact us:
            </p>
            <ul>
              <li>Email: help@shnatisilks.com</li>
              <li>Phone: +91 90664 14414</li>
              <li>Address: 3H5Q+X3C, 1st Main Rd, CQAL Layout, Sahakar Nagar, Byatarayanapura, Bengaluru, Karnataka</li>
            </ul>
            <p>
              Our customer service team is available Monday through Saturday, 9:00 AM to 6:00 PM IST.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicy;


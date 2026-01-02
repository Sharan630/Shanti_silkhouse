import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import './TermsOfService.css';

const TermsOfService = () => {
  return (
    <div className="policy-page">
      <div className="policy-container">
        <Link to="/" className="back-btn">
          <FiArrowLeft />
          Back to Home
        </Link>
        
        <div className="policy-content">
          <h1>Terms of service</h1>
          
          <section>
            <h2>Welcome to Shnatisilks: Your Guide to Our Site</h2>
            <p>
              By browsing and using our website, you agree to these Terms and Conditions and our Privacy Policy. They outline our relationship with you, the user, as the owner of the website. Your use of this website is subject to the following:
            </p>
            <ul>
              <li><strong>Website Content:</strong> The information here is for your general use and can change without notice.</li>
              <li><strong>Accuracy:</strong> Neither we nor any third party guarantee the accuracy, timeliness, or completeness of the information on this site. You acknowledge that it may contain errors, and we are not liable for these to the fullest extent permitted by law.</li>
              <li><strong>Your Responsibility:</strong> You use any information or materials on this website at your own risk. It's up to you to ensure products or services meet your specific needs.</li>
              <li><strong>Our Content:</strong> All material on this website, including design, layout, and graphics, is owned by or licensed to us. You cannot reproduce it without our permission, except as stated in our copyright notice.</li>
              <li><strong>Unauthorized Use:</strong> Misuse of this website may lead to damage claims or criminal charges.</li>
              <li><strong>External Links:</strong> We may link to other websites for your convenience, but this doesn't mean we endorse them, and we're not responsible for their content.</li>
              <li><strong>Linking to Us:</strong> You can't create a link to our website from another site without our written permission.</li>
              <li><strong>Governing Law:</strong> Your use of this website and any disputes are subject to the laws of India.</li>
            </ul>
          </section>

          <section>
            <h2>Policies</h2>
          </section>

          <section>
            <h2>Cancellation Policy</h2>
            <p>
              We believe in helping our customers, so we have a flexible Cancellation Policy:
            </p>
            <ul>
              <li><strong>Timing:</strong> You can cancel an order before it is dispatched. Once the product has been dispatched, cancellation may not be possible, but please contact us to discuss options.</li>
              <li><strong>Process:</strong> To cancel an order, please contact our customer service team with your order number and cancellation request.</li>
              <li><strong>Refund:</strong> If your order is cancelled before dispatch, you will receive a full refund to your original payment method within 5-7 business days.</li>
            </ul>
          </section>

          <section>
            <h2>Product Information</h2>
            <p>
              We strive to provide accurate product descriptions, images, and pricing. However:
            </p>
            <ul>
              <li>Product images are for illustrative purposes and may not exactly match the product you receive due to monitor display variations.</li>
              <li>Colors, sizes, and materials are described as accurately as possible, but slight variations may occur.</li>
              <li>We reserve the right to correct any errors in pricing or product information, even after an order has been placed.</li>
            </ul>
          </section>

          <section>
            <h2>Pricing and Payment</h2>
            <p>
              All prices listed on our website are in the currency specified and are subject to change without notice. Shnatisilks has the right to refuse or cancel any orders for that product (unless it's already dispatched).
            </p>
            <p>
              In such cases, we may contact you for instructions or cancel your order and notify you.
            </p>
            <p>
              Your order isn't accepted until the product is dispatched. Before dispatch, we can change the product price and contact you, or cancel your order.
            </p>
            <p>
              If your order is accepted, your credit card will be debited, and you'll be notified via email. Payment may be processed before dispatch. If we cancel an order after processing payment, the amount will be refunded to your credit card.
            </p>
            <p>
              <strong>Please note:</strong> Online prices may sometimes differ from in-store prices as we strive for competitive pricing in different regions. Prices and availability can change without notice.
            </p>
          </section>

          <section>
            <h2>Electronic Communications</h2>
            <p>
              By subscribing or registering with us, you consent to receive electronic communications from us. You agree that all our electronic communications meet any legal requirement for written communication. We'll also send you emails about new collections and other relevant information.
            </p>
          </section>

          <section>
            <h2>Legal Jurisdiction</h2>
            <p>
              This User Agreement is governed by the laws of India. Any disputes arising from transactions on the Shnatisilks website will be settled in the courts of Chennai.
            </p>
          </section>

          <section>
            <h2>Customer Support Conditions</h2>
            <ul>
              <li><strong>Chat Records:</strong> Conversations on our chat window may be recorded and used as proof.</li>
              <li><strong>No Abusive Language:</strong> Please use respectful language in chat.</li>
              <li><strong>No Cross-Selling/Advice:</strong> The chat window is for resolving basic issues related to buying our products, not for cross-selling, solicitation, or investment advice.</li>
              <li><strong>Service Discontinuation:</strong> Shnatisilks can discontinue the chat facility at any time, at its own discretion.</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;


import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import './RefundPolicy.css';

const RefundPolicy = () => {
  return (
    <div className="policy-page">
      <div className="policy-container">
        <Link to="/" className="back-btn">
          <FiArrowLeft />
          Back to Home
        </Link>
        
        <div className="policy-content">
          <h1>Refund & Return Policy</h1>
          
          <section>
            <h2>Our Commitment to Your Satisfaction</h2>
            <p>
              At Shnatisilks, we want you to be completely satisfied with your purchase. We understand that sometimes products may not meet your expectations, and we have established a clear and fair refund and return policy to address your concerns.
            </p>
          </section>

          <section>
            <h2>Return Eligibility</h2>
            <p>
              To be eligible for a return, the following conditions must be met:
            </p>
            <ul>
              <li>Items must be returned within 7 days of delivery.</li>
              <li>Items must be unused, unwashed, and in their original condition with all tags attached.</li>
              <li>Items must be in their original packaging whenever possible.</li>
              <li>Proof of purchase (order number or receipt) must be provided.</li>
              <li>Customized or personalized items are not eligible for return unless there is a manufacturing defect.</li>
              <li>Items purchased during sale or special promotions may have different return conditions, which will be clearly stated at the time of purchase.</li>
            </ul>
          </section>

          <section>
            <h2>Return Process</h2>
            <p>
              To initiate a return, please follow these steps:
            </p>
            <ol>
              <li>Contact our customer service team at help@shnatisilks.com or call us at +91 90664 14414 with your order number.</li>
              <li>Provide a reason for the return and, if applicable, photos of the item showing any defects or issues.</li>
              <li>Our team will review your request and provide you with a Return Authorization (RA) number and return instructions.</li>
              <li>Pack the item securely in its original packaging (if available) and include the RA number on the package.</li>
              <li>Ship the item to the address provided by our customer service team.</li>
              <li>Once we receive and inspect the returned item, we will process your refund or exchange.</li>
            </ol>
          </section>

          <section>
            <h2>Refund Processing</h2>
            <p>
              After we receive and inspect your returned item, we will notify you of the approval or rejection of your refund.
            </p>
            <ul>
              <li><strong>Approved Returns:</strong> If approved, your refund will be processed to the original method of payment within 5-7 business days after we receive the returned item.</li>
              <li><strong>Refund Amount:</strong> The refund will be for the product price. Original shipping charges are non-refundable unless the return is due to our error (wrong item sent, defective product, etc.).</li>
              <li><strong>Return Shipping:</strong> Return shipping costs are the responsibility of the customer unless the return is due to our error.</li>
              <li><strong>Processing Time:</strong> Please allow 2-3 business days for the refund to appear in your account after processing, depending on your bank or credit card company.</li>
            </ul>
          </section>

          <section>
            <h2>Exchanges</h2>
            <p>
              We currently do not offer direct exchanges. If you wish to exchange an item for a different size, color, or style, please return the original item following our return process and place a new order for the desired item.
            </p>
          </section>

          <section>
            <h2>Defective or Damaged Items</h2>
            <p>
              If you receive a defective or damaged item, please contact us immediately. We will arrange for a replacement or full refund at no additional cost to you, including return shipping.
            </p>
            <p>
              Please provide photos of the defect or damage when contacting us, as this helps us process your request more quickly and improve our quality control.
            </p>
          </section>

          <section>
            <h2>Wrong Item Received</h2>
            <p>
              If you receive the wrong item, please contact us immediately. We will arrange for the correct item to be sent to you and provide a prepaid return label for the incorrect item. You will receive a full refund for the incorrect item and will not be charged for the correct item if it was not included in your original order.
            </p>
          </section>

          <section>
            <h2>Non-Returnable Items</h2>
            <p>
              The following items are not eligible for return:
            </p>
            <ul>
              <li>Items without original tags or labels</li>
              <li>Items that have been worn, washed, or used</li>
              <li>Items damaged due to misuse or normal wear and tear</li>
              <li>Customized or personalized items (unless defective)</li>
              <li>Items returned after the 7-day return period</li>
              <li>Items purchased from clearance or final sale sections (unless defective)</li>
            </ul>
          </section>

          <section>
            <h2>Cancellations</h2>
            <p>
              You may cancel your order before it is dispatched. Once the order has been dispatched, it cannot be cancelled, but you may return it following our return policy. If you cancel before dispatch, you will receive a full refund within 5-7 business days.
            </p>
          </section>

          <section>
            <h2>Contact Us</h2>
            <p>
              If you have any questions about our Refund & Return Policy, please contact us:
            </p>
            <ul>
              <li>Email: help@shnatisilks.com</li>
              <li>Phone: +91 90664 14414</li>
              <li>Address: 3H5Q+X3C, 1st Main Rd, CQAL Layout, Sahakar Nagar, Byatarayanapura, Bengaluru, Karnataka</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;


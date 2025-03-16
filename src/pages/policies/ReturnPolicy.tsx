import Layout from "@/components/layout/Layout";
import { Separator } from "@/components/ui/separator";

const ReturnPolicy = () => {
  return (
    <Layout>
      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-serif mb-4">Return & Refund Policy</h1>
          <p className="text-muted-foreground mb-8">Last updated: Jan 06, 2025</p>
          
          <Separator className="mb-8" />
          
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-medium mb-3">Return and Exchange Policy</h2>
              <p className="mb-3">
                We want you to be completely satisfied with your purchase. If you're not entirely happy with your order, we're here to help.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-medium mb-3">Returns</h2>
              <p className="mb-3">
                You have 30 calendar days to return an item from the date you received it. To be eligible for a return, your item must be unused and in the same condition that you received it. Your item must be in the original packaging. Your item needs to have the receipt or proof of purchase.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-medium mb-3">Refunds</h2>
              <p className="mb-3">
                Once we receive your item, we will inspect it and notify you that we have received your returned item. We will immediately notify you on the status of your refund after inspecting the item.
              </p>
              <p className="mb-3">
                If your return is approved, we will initiate a refund to your original method of payment. You will receive the credit within a certain amount of days, depending on your card issuer's policies.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-medium mb-3">Shipping</h2>
              <p className="mb-3">
                You will be responsible for paying for your own shipping costs for returning your item. Shipping costs are non-refundable. If you receive a refund, the cost of return shipping will be deducted from your refund.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-medium mb-3">Non-Returnable Items</h2>
              <p className="mb-3">
                Certain types of items cannot be returned, including:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Gift cards</li>
                <li>Perishable goods (such as food, flowers, or plants)</li>
                <li>Personal care items (due to hygiene reasons)</li>
                <li>Hazardous materials, flammable liquids or gases</li>
                <li>Downloadable software products</li>
                <li>Some health and personal care items</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-medium mb-3">Damaged or Defective Items</h2>
              <p className="mb-3">
                If you receive a damaged or defective item, please contact us immediately at support@tellmeindia.com with details of the product and the damage. We will work with you to resolve the issue and arrange a return if necessary.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-medium mb-3">Exchanges</h2>
              <p className="mb-3">
                We only replace items if they are defective or damaged. If you need to exchange it for the same item, send us an email at sales@tellmeindia.com and send your item to: Tell Me India Returns Department,C-409, Block C, Vaishali Nagar, Jaipur, Rajasthan 302021, India.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-medium mb-3">Refund Processing Time</h2>
              <p className="mb-3">
                Once your return is received and inspected, we will send you an email to notify you that we have received your returned item. We will also notify you of the approval or rejection of your refund.
              </p>
              <p className="mb-3">
                If you are approved, then your refund will be processed, and a credit will automatically be applied to your credit card or original method of payment, within 7-14 business days.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-medium mb-3">Late or Missing Refunds</h2>
              <p className="mb-3">
                If you haven't received a refund yet, first check your bank account again. Then contact your credit card company, it may take some time before your refund is officially posted. Next contact your bank. There is often some processing time before a refund is posted. If you've done all of this and you still have not received your refund yet, please contact us at refunds@tellmeindia.com.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-medium mb-3">Questions</h2>
              <p>
                If you have any questions about our returns and refunds policy, please contact us at returns@tellmeindia.com or call us at +91 (911) 929-5094.
              </p>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ReturnPolicy;
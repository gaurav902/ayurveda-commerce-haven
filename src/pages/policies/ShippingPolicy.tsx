import Layout from "@/components/layout/Layout";
import { Separator } from "@/components/ui/separator";

const ShippingPolicy = () => {
  return (
    <Layout>
      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-serif mb-4">Shipping Policy</h1>
          <p className="text-muted-foreground mb-8">Last updated: Jan 06, 2025</p>
          
          <Separator className="mb-8" />
          
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-medium mb-3">Processing Time</h2>
              <p className="mb-3">
                All orders are processed within 1-2 business days. Orders are not processed or shipped on weekends or holidays.
              </p>
              <p className="mb-3">
                If we are experiencing a high volume of orders, shipments may be delayed by a few days. Please allow additional days in transit for delivery. If there is a significant delay in the shipment of your order, we will contact you via email.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-medium mb-3">Shipping Rates & Delivery Estimates</h2>
              <p className="mb-3">
                Shipping charges for your order will be calculated and displayed at checkout.
              </p>
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border border-gray-300 mt-4">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-2">Shipping Method</th>
                      <th className="border border-gray-300 px-4 py-2">Estimated Delivery Time</th>
                      <th className="border border-gray-300 px-4 py-2">Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">Standard Shipping</td>
                      <td className="border border-gray-300 px-4 py-2">5-7 business days</td>
                      <td className="border border-gray-300 px-4 py-2">₹100 (Free for orders above ₹999)</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">Express Shipping</td>
                      <td className="border border-gray-300 px-4 py-2">2-3 business days</td>
                      <td className="border border-gray-300 px-4 py-2">₹250</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">Same Day Delivery</td>
                      <td className="border border-gray-300 px-4 py-2">Same day (order before 12 PM)</td>
                      <td className="border border-gray-300 px-4 py-2">₹400 (Available only in select cities)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-3">
                These shipping times are estimates and are not guaranteed. Factors such as inclement weather, natural disasters, or carrier delays may impact delivery times.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-medium mb-3">Shipment Confirmation & Order Tracking</h2>
              <p className="mb-3">
                You will receive a Shipment Confirmation email once your order has shipped containing your tracking number(s). The tracking number will be active within 24 hours.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-medium mb-3">Customs, Duties, and Taxes</h2>
              <p className="mb-3">
                Tell Me India is not responsible for any customs and taxes applied to your order. All fees imposed during or after shipping are the responsibility of the customer (tariffs, taxes, etc.).
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-medium mb-3">Damages</h2>
              <p className="mb-3">
                Tell Me India is not liable for any products damaged or lost during shipping. If you received your order damaged, please contact the shipment carrier to file a claim.
              </p>
              <p className="mb-3">
                Please save all packaging materials and damaged goods before filing a claim.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-medium mb-3">International Shipping</h2>
              <p className="mb-3">
                We currently ship to the following countries: USA, Canada, UK, Australia, and UAE. International orders typically take 7-21 business days to arrive, depending on the destination.
              </p>
              <p className="mb-3">
                Please note that international shipping rates are higher and delivery times can be longer due to customs processing.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-medium mb-3">Lost/Stolen Packages</h2>
              <p className="mb-3">
                Tell Me India is not responsible for lost or stolen packages that show confirmation of delivery by the shipping carrier. If your package is lost or stolen, please contact the carrier directly to file a claim.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-medium mb-3">Contact Us</h2>
              <p>
                If you have any questions about our shipping policy, please contact us at sales@tellmeindia.com.
              </p>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ShippingPolicy;

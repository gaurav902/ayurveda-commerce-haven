
import Layout from "@/components/layout/Layout";
import { Separator } from "@/components/ui/separator";

const PrivacyPolicy = () => {
  return (
    <Layout>
      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-serif mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground mb-8">Last updated: June 15, 2023</p>
          
          <Separator className="mb-8" />
          
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-medium mb-3">Introduction</h2>
              <p className="mb-3">
                At Ayurveda Haven, we respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
              </p>
              <p>
                Please read this Privacy Policy carefully. If you do not agree with the terms of this Privacy Policy, please do not access the site.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-medium mb-3">Information We Collect</h2>
              <p className="mb-3">
                <strong>Personal Data:</strong> We may collect personal identification information from users in various ways, including, but not limited to, when users visit our site, register on the site, place an order, subscribe to the newsletter, respond to a survey, fill out a form, and in connection with other activities, services, features or resources we make available on our site. Users may be asked for, as appropriate, name, email address, mailing address, phone number, credit card information.
              </p>
              <p className="mb-3">
                <strong>Non-Personal Data:</strong> We may collect non-personal identification information about users whenever they interact with our site. Non-personal identification information may include the browser name, the type of computer and technical information about users' means of connection to our site, such as the operating system and the Internet service providers utilized and other similar information.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-medium mb-3">How We Use Your Information</h2>
              <p className="mb-3">
                We may use the information we collect from you when you register, make a purchase, sign up for our newsletter, respond to a survey or marketing communication, surf the website, or use certain other site features in the following ways:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>To personalize your experience and to allow us to deliver the type of content and product offerings in which you are most interested.</li>
                <li>To improve our website in order to better serve you.</li>
                <li>To allow us to better service you in responding to your customer service requests.</li>
                <li>To administer a contest, promotion, survey or other site feature.</li>
                <li>To quickly process your transactions.</li>
                <li>To ask for ratings and reviews of services or products.</li>
                <li>To follow up with you after correspondence (live chat, email or phone inquiries).</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-medium mb-3">How We Protect Your Information</h2>
              <p className="mb-3">
                We implement a variety of security measures when a user places an order, enters, submits, or accesses their information to maintain the safety of your personal information.
              </p>
              <p className="mb-3">
                All transactions are processed through a secure gateway provider and are not stored or processed on our servers.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-medium mb-3">Cookies</h2>
              <p className="mb-3">
                We use cookies to help us remember and process the items in your shopping cart, understand and save your preferences for future visits, and compile aggregate data about site traffic and site interaction so that we can offer better site experiences and tools in the future.
              </p>
              <p>
                You can choose to have your computer warn you each time a cookie is being sent, or you can choose to turn off all cookies. You do this through your browser settings. Since each browser is a little different, look at your browser's Help Menu to learn the correct way to modify your cookies.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-medium mb-3">Third-Party Disclosure</h2>
              <p>
                We do not sell, trade, or otherwise transfer to outside parties your personally identifiable information unless we provide users with advance notice. This does not include website hosting partners and other parties who assist us in operating our website, conducting our business, or serving our users, so long as those parties agree to keep this information confidential. We may also release information when its release is appropriate to comply with the law, enforce our site policies, or protect ours or others' rights, property, or safety.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-medium mb-3">Changes to This Privacy Policy</h2>
              <p>
                We reserve the right to make changes to this Privacy Policy at any time and for any reason. We will alert you about any changes by updating the "Last updated" date of this Privacy Policy. You are encouraged to periodically review this Privacy Policy to stay informed of updates.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-medium mb-3">Contact Us</h2>
              <p>
                If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us at privacy@ayurvedahaven.com.
              </p>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PrivacyPolicy;

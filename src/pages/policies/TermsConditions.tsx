
import Layout from "@/components/layout/Layout";
import { Separator } from "@/components/ui/separator";

const TermsConditions = () => {
  return (
    <Layout>
      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-serif mb-4">Terms and Conditions</h1>
          <p className="text-muted-foreground mb-8">Last updated: June 15, 2023</p>
          
          <Separator className="mb-8" />
          
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-medium mb-3">Introduction</h2>
              <p className="mb-3">
                These terms and conditions outline the rules and regulations for the use of Ayurveda Haven's website. By accessing this website, we assume you accept these terms and conditions in full. Do not continue to use Ayurveda Haven's website if you do not accept all of the terms and conditions stated on this page.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-medium mb-3">Intellectual Property Rights</h2>
              <p className="mb-3">
                Other than the content you own, under these terms, Ayurveda Haven and/or its licensors own all the intellectual property rights and materials contained in this website.
              </p>
              <p>
                You are granted limited license only for purposes of viewing the material contained on this website.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-medium mb-3">Restrictions</h2>
              <p className="mb-3">You are specifically restricted from all of the following:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Publishing any website material in any other media</li>
                <li>Selling, sublicensing and/or otherwise commercializing any website material</li>
                <li>Publicly performing and/or showing any website material</li>
                <li>Using this website in any way that is or may be damaging to this website</li>
                <li>Using this website in any way that impacts user access to this website</li>
                <li>Using this website contrary to applicable laws and regulations, or in any way may cause harm to the website, or to any person or business entity</li>
                <li>Engaging in any data mining, data harvesting, data extracting or any other similar activity in relation to this website</li>
                <li>Using this website to engage in any advertising or marketing</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-medium mb-3">Your Content</h2>
              <p className="mb-3">
                In these terms and conditions, "Your Content" shall mean any audio, video, text, images or other material you choose to display on this website. By displaying Your Content, you grant Ayurveda Haven a non-exclusive, worldwide irrevocable, sub licensable license to use, reproduce, adapt, publish, translate and distribute it in any and all media.
              </p>
              <p className="mb-3">
                Your Content must be your own and must not be invading any third-party's rights. Ayurveda Haven reserves the right to remove any of Your Content from this website at any time without notice.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-medium mb-3">No Warranties</h2>
              <p className="mb-3">
                This website is provided "as is," with all faults, and Ayurveda Haven makes no express or implied representations or warranties, of any kind related to this website or the materials contained on this website.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-medium mb-3">Limitation of Liability</h2>
              <p className="mb-3">
                In no event shall Ayurveda Haven, nor any of its officers, directors and employees, be held liable for anything arising out of or in any way connected with your use of this website whether such liability is under contract.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-medium mb-3">Indemnification</h2>
              <p className="mb-3">
                You hereby indemnify to the fullest extent Ayurveda Haven from and against any and/or all liabilities, costs, demands, causes of action, damages and expenses arising in any way related to your breach of any of the provisions of these terms.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-medium mb-3">Severability</h2>
              <p className="mb-3">
                If any provision of these terms is found to be invalid under any applicable law, such provisions shall be deleted without affecting the remaining provisions herein.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-medium mb-3">Variation of Terms</h2>
              <p className="mb-3">
                Ayurveda Haven is permitted to revise these terms at any time as it sees fit, and by using this website you are expected to review these terms on a regular basis.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-medium mb-3">Governing Law & Jurisdiction</h2>
              <p className="mb-3">
                These terms will be governed by and interpreted in accordance with the laws of India, and you submit to the non-exclusive jurisdiction of the state and federal courts located in India for the resolution of any disputes.
              </p>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TermsConditions;

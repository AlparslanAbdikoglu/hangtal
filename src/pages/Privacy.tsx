
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileText, Eye, Calendar } from "lucide-react";

const Privacy = () => {
  const handleDownloadPDF = () => {
    // Simulate downloading a PDF file from the server
    // In a real implementation, this would link to an actual PDF file
    const link = document.createElement('a');
    link.href = '/documents/privacy-policy.pdf'; // Mock PDF path
    link.download = 'MEINL_Sonic_Energy_Privacy_Policy.pdf';
    link.click();
  };

  const handleViewPDF = () => {
    // Simulate opening PDF in a new tab
    window.open('/documents/privacy-policy.pdf', '_blank');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-16 flex-1">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-6 w-6" />
                Privacy Policy Document
              </CardTitle>
              <CardDescription>
                Last updated: December 2024 | Version 2.1
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-6">
                Our comprehensive privacy policy outlines how MEINL Sonic Energy collects, uses, and protects your personal information. 
                We are committed to maintaining the highest standards of privacy protection and transparency.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={handleViewPDF} className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  View Privacy Policy (PDF)
                </Button>
                <Button variant="outline" onClick={handleDownloadPDF} className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Download PDF
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>What's Covered</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Data collection and usage practices</li>
                  <li>• Cookie policy and tracking technologies</li>
                  <li>• Third-party integrations and partnerships</li>
                  <li>• Your rights and choices regarding your data</li>
                  <li>• International data transfers</li>
                  <li>• Security measures and data protection</li>
                  <li>• Contact information for privacy inquiries</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• We only collect necessary information</li>
                  <li>• Your data is never sold to third parties</li>
                  <li>• You can request data deletion at any time</li>
                  <li>• All data is encrypted and securely stored</li>
                  <li>• GDPR and CCPA compliant</li>
                  <li>• Regular security audits and updates</li>
                  <li>• Transparent communication about changes</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <section>
              <h2 className="text-2xl font-bold mb-4">Key Privacy Highlights</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Data Collection</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">We collect only the minimum data necessary to provide our services, including:</p>
                    <ul className="text-sm mt-2 space-y-1">
                      <li>• Contact information</li>
                      <li>• Order history</li>
                      <li>• Website usage data</li>
                      <li>• Payment information (securely processed)</li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Data Usage</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">Your information is used exclusively for:</p>
                    <ul className="text-sm mt-2 space-y-1">
                      <li>• Processing orders and payments</li>
                      <li>• Customer support and communication</li>
                      <li>• Improving our products and services</li>
                      <li>• Legal compliance and security</li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Your Rights</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">You have the right to:</p>
                    <ul className="text-sm mt-2 space-y-1">
                      <li>• Access your personal data</li>
                      <li>• Correct inaccurate information</li>
                      <li>• Request data deletion</li>
                      <li>• Opt-out of marketing communications</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Calendar className="h-6 w-6" />
                Policy Updates
              </h2>
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="border-l-4 border-primary pl-4">
                      <h3 className="font-semibold">Version 2.1 - December 2024</h3>
                      <p className="text-sm text-muted-foreground">Updated data retention policies and enhanced security measures</p>
                    </div>
                    <div className="border-l-4 border-muted pl-4">
                      <h3 className="font-semibold">Version 2.0 - September 2024</h3>
                      <p className="text-sm text-muted-foreground">Added CCPA compliance and improved cookie management</p>
                    </div>
                    <div className="border-l-4 border-muted pl-4">
                      <h3 className="font-semibold">Version 1.5 - May 2024</h3>
                      <p className="text-sm text-muted-foreground">Enhanced GDPR compliance and user rights clarification</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            <section className="bg-muted p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-4">Have Privacy Questions?</h2>
              <p className="mb-4">
                Our Data Protection Officer is available to help with any privacy-related questions or concerns.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold">Contact Information</p>
                  <p className="text-sm">Email: privacy@meinlsonic.com</p>
                  <p className="text-sm">Phone: +1 (555) 123-4570</p>
                  <p className="text-sm">Mail: Privacy Officer, 123 Sound Street, Harmony City</p>
                </div>
                <div>
                  <p className="font-semibold">Response Time</p>
                  <p className="text-sm">We respond to privacy inquiries within 72 hours</p>
                  <p className="text-sm">Data requests processed within 30 days</p>
                  <p className="text-sm">Emergency privacy issues: Immediate response</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Privacy;

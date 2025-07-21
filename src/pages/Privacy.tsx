
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileText, Eye, Calendar } from "lucide-react";
import { useTranslation } from "react-i18next";

const Privacy = () => {
  const { t } = useTranslation();

  const handleDownloadPDF = () => {
    // Simulate downloading a PDF file from the server
    // In a real implementation, this would link to an actual PDF file
    const link = document.createElement('a');
    link.href = '/documents/privacy-policy.pdf'; // Mock PDF path
    link.download = 'hangacademy_Privacy_Policy.pdf';
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
          <h1 className="text-4xl font-bold mb-8">{t("privacy.title")}</h1>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-6 w-6" />
                {t("privacy.documentTitle")}
              </CardTitle>
              <CardDescription>
                {t("privacy.lastUpdated")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-6">
                {t("privacy.description")}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={handleViewPDF} className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  {t("privacy.viewPDF")}
                </Button>
                <Button variant="outline" onClick={handleDownloadPDF} className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  {t("privacy.downloadPDF")}
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>{t("privacy.whatsCovered")}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• {t("privacy.coveredItems.practices")}</li>
                  <li>• {t("privacy.coveredItems.cookies")}</li>
                  <li>• {t("privacy.coveredItems.thirdParty")}</li>
                  <li>• {t("privacy.coveredItems.rights")}</li>
                  <li>• {t("privacy.coveredItems.transfers")}</li>
                  <li>• {t("privacy.coveredItems.security")}</li>
                  <li>• {t("privacy.coveredItems.contact")}</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("privacy.quickSummary")}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• {t("privacy.summaryItems.necessary")}</li>
                  <li>• {t("privacy.summaryItems.noSelling")}</li>
                  <li>• {t("privacy.summaryItems.deletion")}</li>
                  <li>• {t("privacy.summaryItems.encryption")}</li>
                  <li>• {t("privacy.summaryItems.compliant")}</li>
                  <li>• {t("privacy.summaryItems.audits")}</li>
                  <li>• {t("privacy.summaryItems.transparent")}</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <section>
              <h2 className="text-2xl font-bold mb-4">{t("privacy.keyHighlights")}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{t("privacy.dataCollection")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">We collect only the minimum data necessary to provide our services, including:</p>
                    <ul className="text-sm mt-2 space-y-1">
                      <li>• {t("privacy.collectionItems.contact")}</li>
                      <li>• {t("privacy.collectionItems.orderHistory")}</li>
                      <li>• {t("privacy.collectionItems.websiteUsage")}</li>
                      <li>• {t("privacy.collectionItems.payment")}</li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{t("privacy.dataUsage")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">Your information is used exclusively for:</p>
                    <ul className="text-sm mt-2 space-y-1">
                      <li>• {t("privacy.usageItems.orders")}</li>
                      <li>• {t("privacy.usageItems.support")}</li>
                      <li>• {t("privacy.usageItems.improvement")}</li>
                      <li>• {t("privacy.usageItems.compliance")}</li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{t("privacy.yourRights")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">You have the right to:</p>
                    <ul className="text-sm mt-2 space-y-1">
                      <li>• {t("privacy.rightsItems.access")}</li>
                      <li>• {t("privacy.rightsItems.correct")}</li>
                      <li>• {t("privacy.rightsItems.delete")}</li>
                      <li>• {t("privacy.rightsItems.optOut")}</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Calendar className="h-6 w-6" />
                {t("privacy.policyUpdates")}
              </h2>
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="border-l-4 border-primary pl-4">
                      <h3 className="font-semibold">{t("privacy.updates.v21")}</h3>
                      <p className="text-sm text-muted-foreground">{t("privacy.updates.v21Description")}</p>
                    </div>
                    <div className="border-l-4 border-muted pl-4">
                      <h3 className="font-semibold">{t("privacy.updates.v20")}</h3>
                      <p className="text-sm text-muted-foreground">{t("privacy.updates.v20Description")}</p>
                    </div>
                    <div className="border-l-4 border-muted pl-4">
                      <h3 className="font-semibold">{t("privacy.updates.v15")}</h3>
                      <p className="text-sm text-muted-foreground">{t("privacy.updates.v15Description")}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            <section className="bg-muted p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-4">{t("privacy.privacyQuestions")}</h2>
              <p className="mb-4">
                {t("privacy.dpoDescription")}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold">{t("privacy.contactInfo")}</p>
                  <p className="text-sm">{t("privacy.contactDetails.email")}</p>
                  <p className="text-sm">{t("privacy.contactDetails.phone")}</p>
                  <p className="text-sm">{t("privacy.contactDetails.mail")}</p>
                </div>
                <div>
                  <p className="font-semibold">{t("privacy.responseTime")}</p>
                  <p className="text-sm">{t("privacy.responseDetails.inquiry")}</p>
                  <p className="text-sm">{t("privacy.responseDetails.requests")}</p>
                  <p className="text-sm">{t("privacy.responseDetails.emergency")}</p>
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

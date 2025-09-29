import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileText, Download } from "lucide-react";
import { useTranslation } from "react-i18next";

// Map of DOCX file paths by language
const docsMap: Record<string, { privacy: string; aszf: string; complaint: string }> = {
  hu: {
    privacy: "/documents/privacy-policy-hu.docx",
    aszf: "/documents/aszf-hu.docx",
    complaint: "/documents/reklamacio-hu.docx",
  },
  sk: {
    privacy: "/documents/privacy-policy-sk.docx",
    aszf: "/documents/aszf-sk.docx",
    complaint: "/documents/reklamacio-sk.docx",
  },
  en: {
    privacy: "/documents/privacy-policy-en.docx",
    aszf: "/documents/aszf-en.docx",
    complaint: "/documents/reklamacio-en.docx",
  },
};

const Privacy = () => {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language || "hu") as "hu" | "sk" | "en";

  const handleDownload = (path: string, filename: string) => {
    const link = document.createElement("a");
    link.href = path;
    link.download = filename;
    link.click();
  };

  const currentDocs = docsMap[lang] || docsMap.hu;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <div className="container mx-auto px-4 py-16 flex-1">
        <div className="max-w-4xl mx-auto">
          {/* Page Title */}
          <h1 className="text-4xl font-bold mb-8">{t("privacy.title")}</h1>

          {/* Intro Card */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-6 w-6" />
                {t("privacy.documentTitle")}
              </CardTitle>
              <CardDescription>{t("privacy.lastUpdated")}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-6">{t("privacy.description")}</p>
            </CardContent>
          </Card>

          {/* DOCX Sections */}
          <div className="space-y-8">
            {/* Privacy Policy */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {t("privacy.title")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  onClick={() =>
                    handleDownload(
                      currentDocs.privacy,
                      `privacy-policy-${lang}.docx`
                    )
                  }
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  {t("privacy.download")}
                </Button>
              </CardContent>
            </Card>

            {/* ÁSZF */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {t("privacy.aszf")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  onClick={() =>
                    handleDownload(currentDocs.aszf, `aszf-${lang}.docx`)
                  }
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  {t("privacy.download")}
                </Button>
              </CardContent>
            </Card>

            {/* Complaint Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {t("privacy.complaint")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  onClick={() =>
                    handleDownload(currentDocs.complaint, `reklamacio-${lang}.docx`)
                  }
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  {t("privacy.download")}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Privacy;


import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, Clock, MapPin, Package, Shield, CreditCard } from "lucide-react";
import { useTranslation } from "react-i18next";

const Shipping = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-16 flex-1">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">{t("shipping.title")}</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  {t("shipping.standardShipping")}
                </CardTitle>
                <CardDescription>{t("shipping.standardDescription")}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• {t("shipping.standardFeatures.freeShipping")}</li>
                  <li>• {t("shipping.standardFeatures.shippingFee")}</li>
                  <li>• {t("shipping.standardFeatures.delivery")}</li>
                  <li>• {t("shipping.standardFeatures.tracking")}</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  {t("shipping.expressShipping")}
                </CardTitle>
                <CardDescription>{t("shipping.expressDescription")}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• {t("shipping.expressFeatures.fee")}</li>
                  <li>• {t("shipping.expressFeatures.delivery")}</li>
                  <li>• {t("shipping.expressFeatures.priority")}</li>
                  <li>• {t("shipping.expressFeatures.realTimeTracking")}</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <MapPin className="h-6 w-6" />
                {t("shipping.shippingZones")}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{t("shipping.zones.zone1")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{t("shipping.zones.zone1Countries")}</p>
                    <p className="font-semibold mt-2">{t("shipping.zones.zone1Time")}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{t("shipping.zones.zone2")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{t("shipping.zones.zone2Countries")}</p>
                    <p className="font-semibold mt-2">{t("shipping.zones.zone2Time")}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{t("shipping.zones.zone3")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{t("shipping.zones.zone3Countries")}</p>
                    <p className="font-semibold mt-2">{t("shipping.zones.zone3Time")}</p>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Package className="h-6 w-6" />
                {t("shipping.packagingHandling")}
              </h2>
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-2">{t("shipping.packaging.securePackaging")}</h3>
                      <ul className="text-sm space-y-1">
                        <li>• {t("shipping.packaging.wrapping")}</li>
                        <li>• {t("shipping.packaging.foam")}</li>
                        <li>• {t("shipping.packaging.boxes")}</li>
                        <li>• {t("shipping.packaging.labels")}</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">{t("shipping.packaging.processingTime")}</h3>
                      <ul className="text-sm space-y-1">
                        <li>• {t("shipping.packaging.processing")}</li>
                        <li>• {t("shipping.packaging.quality")}</li>
                        <li>• {t("shipping.packaging.confirmation")}</li>
                        <li>• {t("shipping.packaging.custom")}</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Shield className="h-6 w-6" />
                {t("shipping.shippingProtection")}
              </h2>
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-2">{t("shipping.protection.insurance")}</h3>
                      <p className="text-sm mb-3">{t("shipping.protection.insuranceDescription")}</p>
                      <ul className="text-sm space-y-1">
                        <li>• {t("shipping.protection.replacement")}</li>
                        <li>• {t("shipping.protection.coverage")}</li>
                        <li>• {t("shipping.protection.claims")}</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">{t("shipping.protection.guarantee")}</h3>
                      <p className="text-sm mb-3">{t("shipping.protection.guaranteeDescription")}</p>
                      <ul className="text-sm space-y-1">
                        <li>• {t("shipping.protection.signature")}</li>
                        <li>• {t("shipping.protection.photo")}</li>
                        <li>• {t("shipping.protection.support")}</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <CreditCard className="h-6 w-6" />
                {t("shipping.returnsExchanges")}
              </h2>
              <Card>
                <CardContent className="pt-6">
                  <p className="mb-4">{t("shipping.returns.description")}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-2">{t("shipping.returns.returnPolicy")}</h3>
                      <ul className="text-sm space-y-1">
                        <li>• {t("shipping.returns.window")}</li>
                        <li>• {t("shipping.returns.condition")}</li>
                        <li>• {t("shipping.returns.freeReturn")}</li>
                        <li>• {t("shipping.returns.refund")}</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">{t("shipping.returns.exchangeProcess")}</h3>
                      <ul className="text-sm space-y-1">
                        <li>• {t("shipping.returns.authorization")}</li>
                        <li>• {t("shipping.returns.label")}</li>
                        <li>• {t("shipping.returns.quickProcessing")}</li>
                        <li>• {t("shipping.returns.priorityShipping")}</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            <section className="bg-muted p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-4">{t("shipping.needHelp")}</h2>
              <p className="mb-4">{t("shipping.help.description")}</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <div>
                  <p className="font-semibold">{t("shipping.help.customerService")}</p>
                  <p className="text-sm">{t("shipping.help.email")}</p>
                  <p className="text-sm">{t("shipping.help.phone")}</p>
                </div>
                <div>
                  <p className="font-semibold">{t("shipping.help.businessHours")}</p>
                  <p className="text-sm">{t("shipping.help.weekdays")}</p>
                  <p className="text-sm">{t("shipping.help.saturday")}</p>
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

export default Shipping;

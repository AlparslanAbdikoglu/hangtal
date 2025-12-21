import { useTranslation } from "react-i18next";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { CategoryCard } from "@/components/CategoryCard";
import { Footer } from "@/components/Footer";
import { Facebook, Instagram, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const socialLinks = [
	{ name: "Facebook", icon: <Facebook className="h-5 w-5" />, url: "https://www.facebook.com/profile.php?id=100027587995370" },
	{ name: "Instagram", icon: <Instagram className="h-5 w-5" />, url: "https://www.instagram.com/hangakademia" },
	{ name: "YouTube", icon: <Youtube className="h-5 w-5" />, url: "" },
];

const Index = () => {
	const { t } = useTranslation();

	// Updated categories with WooCommerce-safe slugs
	const categories = [
		{ id: "handpans", slug: "handpans", title: t("categories.handpans", "Handpans"), image: "/images/hangtal.jpg" },
		{ id: "steelTongueDrums", slug: "steel-tongue-drums", title: t("categories.steelTongueDrums", "Steel Tongue Drums"), image: "/images/thumbnail1.jpg" },
		{ id: "kalimbas", slug: "kalimbas", title: t("categories.kalimbas", "Kalimbas"), image: "/images/webshop2.jpg" },
		{ id: "crystalSingingBowls", slug: "crystal-singing-bowls", title: t("categories.crystalSingingBowls", "Crystal Singing Bowls"), image: "/images/webshop4.jpg" },
		{ id: "crystalSingingChalices", slug: "crystal-singing-chalices", title: t("categories.crystalSingingChalices", "Crystal Singing Chalices"), image: "/images/thumbnail3.jpg" },
		{ id: "singingBowls", slug: "singing-bowls", title: t("categories.singingBowls", "Singing Bowls"), image: "/images/webshop.jpg" },
		//{ id: "accessorys", slug: "accessorys", title: t("categories.accessorys", "Accessories"), image: "/images/accessorys.jpg" },
		//{ id: "bowls", slug: "bowls", title: t("categories.bowls", "Bowls"), image: "/images/bowls.jpg" },
		//{ id: "gongs-tamtams", slug: "gongs-tamtams", title: t("categories.gongsTamtams", "Gongs and Tamtams"), image: "/images/gongs-tamtams.jpg" },
		//{ id: "stands", slug: "stands", title: t("categories.stands", "Stands"), image: "/images/stands.jpg" },
	];

	// Optional: list of valid WooCommerce category slugs
	const validCategorySlugs = categories.map(cat => cat.slug);

	return (
		<div className="min-h-screen bg-background flex flex-col">
			<Navbar />
			<Hero />

			{/* Promo Section */}
                        <section className="container py-16 bg-background w-full max-w-4xl mx-auto">
                                <h2 className="text-4xl font-bold mb-8 text-center">
                                        {t("promo.title", "HANGAKADÉMIA® – A hangok ereje a mindennapjaidban")}
                                </h2>
                                <div className="mb-8 text-lg text-gray-700 space-y-4 leading-relaxed">
                                        <p>{t("promo.intro", "Fedezd fel a hangtálak, hangszerek és rezgésalapú hangélmények különleges világát.")}</p>
                                        <p>
                                                {t(
                                                        "promo.belief",
                                                        "A Hangakadémiánál® hiszünk abban, hogy a hang tudatos használata támogatja a belső egyensúlyt, a nyugalmat és a mélyebb jelenlétet. Webshopunkban gondosan válogatott Himalájai hangtálakat, professzionális Meinl Sonic Energy hangszereket és prémium kiegészítőket találsz – minden darabot személyesen kipróbálva, szakmai ajánlással."
                                                )}
                                        </p>
                                        <div className="space-y-2">
                                                <h3 className="text-2xl font-semibold">{t("promo.whyTitle", "Miért a Hangakadémia®?")}</h3>
                                                <p>{t("promo.benefit1", "Prémium minőségű, gondosan válogatott hangszerek – szakmai háttérrel.")}</p>
                                                <p>{t("promo.background1", "A Hangakadémia® nem csupán egy webshop.")}</p>
                                                <p>
                                                        {t(
                                                                "promo.background2",
                                                                "Minden hangtálat és hangszert személyesen válogatunk, kipróbálunk és szakmai szempontok alapján ajánlunk."
                                                        )}
                                                </p>
                                                <p>
                                                        {t(
                                                                "promo.partnership",
                                                                "A Hangakadémia® a Meinl Sonic Energy hivatalos szakmai partnere, alapítója, Pál Adrienn, Magyarország hivatalos Meinl Sonic Energy szakmai nagykövete."
                                                        )}
                                                </p>
                                                <p>{t("promo.value", "Nálunk nem csak eszközt vásárolsz – útmutatást, tudást és megbízható szakmai hátteret is kapsz.")}</p>
                                        </div>
                                </div>
                                <div className="text-center">
                                        <Link to="https://hangakademia.hu" target="_blank" rel="noopener noreferrer">
                                                <button className="bg-primary text-white px-8 py-4 rounded-lg text-xl font-semibold hover:bg-primary/90 transition">
                                                        {t("promo.cta", "👉 Ismerd meg a Hangakadémiát® és a Meinl Sonic Energy Magyarországi Nagykövetét")}
                                                </button>
                                        </Link>
                                </div>
                        </section>

			{/* Categories Section */}
			<section className="container py-16">
				<h2 className="text-3xl font-bold mb-8">
					{t("categories.title", "Kategóriák")}
				</h2>
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
					{categories
						// Filter only valid WooCommerce categories
						.filter(cat => validCategorySlugs.includes(cat.slug))
						.map(category => (
							<Link
								key={category.id}
								to={`/products?category=${category.slug}`} // Use slug here
							>
								<CategoryCard {...category} />
							</Link>
						))}
				</div>
			</section>

			{/* Social Links Section */}
			<section className="container py-12 text-center">
				<h2 className="text-2xl font-bold mb-6">{t("footer.followUs", "Kövess minket")}</h2>
				<div className="flex justify-center gap-6">
					{socialLinks.map((link) => (
						<a
							key={link.name}
							href={link.url}
							target="_blank"
							rel="noopener noreferrer"
							className="text-primary hover:text-secondary transition-colors"
						>
							<Button variant="ghost" size="icon">
								{link.icon}
								<span className="sr-only">{link.name}</span>
							</Button>
						</a>
					))}
				</div>
			</section>

			<Footer />
		</div>
	);
};

export default Index;

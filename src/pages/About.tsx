import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Target, Heart, Zap, Facebook, Instagram, Youtube } from "lucide-react";
import {Navbar} from "@/components/Navbar";
import { useTranslation } from "react-i18next";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import {Footer} from '@/components/Footer';
import { Button } from "@/components/ui/button";

// Social links
const socialLinks = [
	{
		name: "Facebook",
		icon: <Facebook className="h-5 w-5" />,
		url: "https://facebook.com/meinlsonic",
	},
	{
		name: "Instagram",
		icon: <Instagram className="h-5 w-5" />,
		url: "https://instagram.com/meinlsonic",
	},
	{
		name: "YouTube",
		icon: <Youtube className="h-5 w-5" />,
		url: "https://youtube.com/meinlsonic",
	},
];

const About = () => {
	const { t } = useTranslation();

	// Values, skills, and FAQ are arrays in translation files
	const values = t("about.values", { returnObjects: true }) as Array<{
		title: string;
		description: string;
	}>;

	const skills = t("about.skills", { returnObjects: true }) as string[];

	const faq = t("about.faq", { returnObjects: true }) as Array<{
		q: string;
		a: string;
	}>;

	// Icons for values (optional: you can customize)
	const valueIcons = [
		<Target className="h-6 w-6" />,
		<Users className="h-6 w-6" />,
		<Heart className="h-6 w-6" />,
		<Zap className="h-6 w-6" />,
	];

	return (
		<>
			<Navbar />

			<div className="min-h-screen bg-background flex flex-col">
				<div className="max-w-6xl mx-auto px-4 py-16">
					{/* Hero Section */}
					<div className="text-center mb-16">
						<h1 className="text-5xl font-bold text-soul-darkBrown mb-6 animate-fade-in">
							{t("about.title")}
						</h1>
						<p className="text-xl text-soul-gray max-w-3xl mx-auto leading-relaxed">
							{t("about.subtitle")}
						</p>
					</div>

					{/* Story Section */}
					<Card className="mb-16 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
						<CardContent className="p-8">
							<h2 className="text-3xl font-bold text-soul-darkBrown mb-6">
								{t("about.storyTitle")}
							</h2>
							<div className="grid md:grid-cols-2 gap-8 items-center">
								<div>
									<p className="text-soul-gray mb-4 leading-relaxed">
										{t("about.story1")}
									</p>
									<p className="text-soul-gray leading-relaxed">
										{t("about.story2")}
									</p>
								</div>
								{/* Image Placeholder (fills the card, similar to index/hero) */}
								<div className="w-full h-64 md:h-80 flex items-center justify-center">
									<div className="w-full h-full rounded-2xl bg-gradient-to-br from-soul-lightBrown to-soul-brown flex items-center justify-center border-2 border-soul-brown shadow-inner overflow-hidden relative">
										<img
											src="/placeholder-about.jpg"
											alt={t("hero.imageAlt")}
											className="object-cover w-full h-full"
											style={{ display: "block" }}
											onError={(e) => {
												(e.target as HTMLImageElement).style.display = "none";
											}}
										/>
										<span className="absolute text-soul-brown text-lg font-semibold pointer-events-none select-none">
											{t("about.imagePlaceholder", "Picture\nPlaceholder")}
										</span>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Values Section */}
					<div className="mb-16">
						<h2 className="text-3xl font-bold text-soul-darkBrown text-center mb-12">
							{t("about.valuesTitle")}
						</h2>
						<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
							{values.map((value, index) => (
								<Card
									key={index}
									className="group hover:shadow-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:-translate-y-1"
								>
									<CardContent className="p-6 text-center">
										<div className="inline-flex items-center justify-center w-12 h-12 bg-soul-lightBrown rounded-lg mb-4 group-hover:bg-soul-brown transition-colors">
											{valueIcons[index]}
										</div>
										<h3 className="text-lg font-semibold text-soul-darkBrown mb-2">
											{value.title}
										</h3>
										<p className="text-soul-gray text-sm leading-relaxed">
											{value.description}
										</p>
									</CardContent>
								</Card>
							))}
						</div>
					</div>

					{/* Skills Section */}
					<Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm mb-16">
						<CardContent className="p-8">
							<h2 className="text-3xl font-bold text-soul-darkBrown mb-6 text-center">
								{t("about.expertiseTitle")}
							</h2>
							<p className="text-soul-gray text-center mb-8 max-w-2xl mx-auto">
								{t("about.expertiseDesc")}
							</p>
							<div className="flex flex-wrap justify-center gap-3">
								{skills.map((skill, index) => (
									<Badge
										key={index}
										variant="secondary"
										className="px-4 py-2 text-sm font-medium bg-soul-lightBrown text-soul-darkBrown hover:bg-soul-brown transition-colors cursor-default"
									>
										{skill}
									</Badge>
								))}
							</div>
						</CardContent>
					</Card>

					{/* FAQ Section */}
					<div className="mb-16">
						<h2 className="text-3xl font-bold text-soul-darkBrown text-center mb-8">
							{t("about.faqTitle")}
						</h2>
						<Accordion type="single" collapsible className="max-w-2xl mx-auto">
							{faq.map((item, idx) => (
								<AccordionItem key={idx} value={`faq-${idx}`}>
									<AccordionTrigger>{item.q}</AccordionTrigger>
									<AccordionContent>{item.a}</AccordionContent>
								</AccordionItem>
							))}
						</Accordion>
					</div>
				</div>
			</div>

			{/* Social Links Section */}
			<section className="container py-12 text-center bg-soul-darkBrown">
				<h2 className="text-2xl font-bold mb-6 text-white">
					{t('footer.followUs')}
				</h2>
				<div className="flex justify-center gap-6">
					{socialLinks.map((link) => (
						<a
							key={link.name}
							href={link.url}
							target="_blank"
							rel="noopener noreferrer"
							className="text-white hover:text-soul-lightBrown transition-colors"
						>
							<Button variant="ghost" size="icon" className="text-white hover:text-soul-lightBrown">
								{link.icon}
								<span className="sr-only">{link.name}</span>
							</Button>
						</a>
					))}
				</div>
			</section>
			<Footer />
		</>
	);
};

export default About;

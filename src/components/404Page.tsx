import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import FuzzyText from './404';  // Correct path to your FuzzyText component

const NotFound = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h1 className="mb-8"> {/* Adding more margin below heading */}
        <FuzzyText
          baseIntensity={0.2}
          hoverIntensity={0.5}
          enableHover={true}
          fontSize="clamp(4rem, 12vw, 12rem)"
          color="#000000"
          fontWeight={900}
        >
          404
        </FuzzyText>
      </h1>

      <p className="text-xl mb-8 max-w-lg mx-auto px-4">
        <FuzzyText
          baseIntensity={0.05}       // softer effect for paragraph
          hoverIntensity={0.15}      // subtle hover effect
          enableHover={false}        // disable hover for paragraph for readability
          fontSize="clamp(1rem, 2vw, 1.5rem)"
          color="#333333"
          fontWeight={400}
        >
          {t("notFound.message", "Sorry, the page you are looking for does not exist.")}
        </FuzzyText>
      </p>
      <Link to="/" className="mt-6 inline-block bg-primary text-white px-6 py-3 rounded shadow font-semibold text-lg hover:bg-primary/90 transition">
        {t("notFound.homeLink", "Go back to Home")}
      </Link>
    </div>
  );
};

export default NotFound;

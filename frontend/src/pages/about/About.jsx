import TrustedCustomers from "../../components/TrustedCustomers/TrustedCustomers";
import AboutHero from "./AboutHero";
import AboutStory from "./AboutStory";
import AboutValues from "./AboutValues";

export default function About() {
  return (
    <main>
      <AboutHero />
      <AboutStory />
      <AboutValues />
      <TrustedCustomers />

      <div className="h-24"></div>
    </main>
  );
}

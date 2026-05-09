import Hero from "../components/Hero/Hero";
import TrustedCustomers from "../components/TrustedCustomers/TrustedCustomers";
import WhyNawras from "../components/WhyNawras/WhyNawras";
import ImpactBar from "../components/ImpactBar/ImpactBar";
import OurSolutions from "../components/OurSolutions/OurSolutions";
import Features from "../components/Features/Features";
import VideoShowcase from "../components/VideoShowcase/VideoShowcase";
import LatestNews from "../components/LatestNews/LatestNews";
import ComingSoon from "../components/ComingSoon/ComingSoon";
import PartnerPerspectives from "../components/PartnerPerspectives/PartnerPerspectives";

export default function Home() {
  return (
    <>
      <Hero />
      <TrustedCustomers />
      <WhyNawras />
      <ImpactBar />
      <OurSolutions />
      <Features />
      <VideoShowcase />
      <LatestNews />
      <ComingSoon />
      <PartnerPerspectives />
    </>
  );
}

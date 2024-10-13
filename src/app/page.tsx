import { Box } from "@chakra-ui/react";
import ContactUs from "./components/homepage/ContactUs";
import CallToAction from "./components/homepage/CTA";
import GetStarted from "./components/homepage/GetStarted";
import Hero from "./components/homepage/Hero";
import Testimonial from "./components/homepage/Testimonial";
import WhyPorts from "./components/homepage/WhyPorts";
import Header from "./components/Header";
import Footer from "./components/homepage/Footer";

export default function Home() {
  return (
    <Box backgroundColor={"#fff"}>
      <Header />
      <Hero />
      <Box px={{ base: 5, md: 10 }}>
        <GetStarted />
        <WhyPorts />
        <CallToAction />
        <Testimonial />
        <ContactUs />
      </Box>
      <Footer />
    </Box>
  );
}

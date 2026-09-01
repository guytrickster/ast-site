import { LeadProvider } from "./components/ui";
import { Footer, Header } from "./components/Chrome";
import { HomePage } from "./pages/Home";
import { CatalogPage, ProductPage } from "./pages/Catalog";
import { PartsPage } from "./pages/Parts";
import { AboutPage, ContactsPage, PrivacyPage, ServicesPage } from "./pages/Info";
import { useHashRoute } from "./lib/site";
import { useSeo } from "./lib/seo";

export default function App() {
  const route = useHashRoute();
  useSeo(route);

  let content = <HomePage />;
  switch (route.page) {
    case "catalog":
      content = <CatalogPage cat={route.param} />;
      break;
    case "product":
      content = <ProductPage id={route.param} />;
      break;
    case "parts":
      content = <PartsPage />;
      break;
    case "services":
      content = <ServicesPage />;
      break;
    case "about":
      content = <AboutPage />;
      break;
    case "contacts":
      content = <ContactsPage />;
      break;
    case "privacy":
      content = <PrivacyPage />;
      break;
    default:
      content = <HomePage />;
  }

  const headerPage = route.page === "product" ? "catalog" : route.page;

  return (
    <LeadProvider>
      <Header page={headerPage} />
      <main>{content}</main>
      <Footer />
    </LeadProvider>
  );
}

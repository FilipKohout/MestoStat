import { AutofillAnimationSearchBar } from "@/components/utils/SearchBar";
import { QueryClient } from "@tanstack/query-core";
import getSearchData from "@/services/structure/searchData";

export default async function LandingPageSearchBar() {
    const client = new QueryClient();
    const searchData = await getSearchData(client);

    return <AutofillAnimationSearchBar
        size="lg"
        phrases={["Praha", "Brno", "Ostrava", "Plzeň", "Liberec", "České Budějovice", "Hradec Králové"]}
        typingDelay={100}
        data={searchData}
        placeholder="Hledat obec, okres, kraj..."
    />
}
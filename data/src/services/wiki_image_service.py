import requests
import logging


def get_all_municipality_images():
    url = "https://query.wikidata.org/sparql"

    query = """
        SELECT ?name ?image WHERE {
          # 1. Položka je v zemi Česká republika
          ?item wdt:P17 wd:Q213.
    
          # 2. Má obrázek
          ?item wdt:P18 ?image.
    
          # 3. Je instancí (wdt:P31) jednoho z těchto typů:
          VALUES ?type { 
            wd:Q515335   # Obec
            wd:Q10265281 # Město v Česku
            wd:Q392928   # Městys
            wd:Q15978299 # Statutární město
          }
          ?item wdt:P31 ?type.
    
          # 4. Získej název a zajisti, že je český
          ?item rdfs:label ?name.
          FILTER(LANG(?name) = "cs")
        }
    """

    headers = {
        'User-Agent': 'MestostatBot/1.0 (vas_email@example.com)',
        'Accept': 'application/json'
    }

    logging.info("Downloading municipality images from Wikidata...")

    image_map = {}
    try:
        r = requests.get(url, params={'format': 'json', 'query': query}, headers=headers)
        r.raise_for_status()

        data = r.json()
        bindings = data.get('results', {}).get('bindings', [])

        logging.info(f"Wikidata vrátila {len(bindings)} záznamů.")

        if len(bindings) == 0:
            logging.warning("Unable to fetch municipality images from Wikidata: No data returned.")
            return {}

        for item in bindings:
            name = item['name']['value']
            image_url = item['image']['value']

            if name not in image_map:
                image_map[name] = image_url

        logging.info(f"Succesfully fetched {len(image_map)} unique municipality images from Wikidata")
        return image_map

    except Exception as e:
        logging.error(f"Downloading images from Wikidata failed error: {e}")
        try:
            if 'r' in locals():
                logging.error(f"Server response: {r.text[:200]}")
        except:
            pass
        return {}
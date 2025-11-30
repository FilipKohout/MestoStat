from typing import Final, Dict, Tuple, Callable, Any
import data.ruain as ruian
import data.population as population

URLS: Final[Dict[
    str,
    Tuple[
        str,
        str,
        Callable[[list[dict]], Any],
        str | None,
        bool | int
    ]
]] = {
    "ruian": (
        "https://vdp.cuzk.gov.cz/vdp/ruian/obce?sort=UZEMI&ohradaId=&nespravny=&kodVc=&kodOk=&kodOp=&kodPu=&nazevOb=&statusKod=&search=&mediaType=csv",
        "csv",
        ruian.read,
        None,
        False,
    ),

    "PopulationByAge1stJulYearly": (
        "https://data.csu.gov.cz/api/dotaz/v1/data/vybery/uzivatelske/fad46aa0-bcf8-448b-8493-efd348e80d2b?format=CSV&rozsah=CELY_VYBER&poznamky=false",
        "csv",
        lambda data : population.read_by_age(data, semester=2),
        "population_by_sex_data",
        7 * 24 * 60 * 60,
    ),
    "PopulationByAge1stJanYearly": (
        "https://data.csu.gov.cz/api/dotaz/v1/data/vybery/uzivatelske/fad46aa0-bcf8-448b-8493-efd348e80d2b?format=CSV&rozsah=CELY_VYBER&poznamky=false",
        "csv",
        lambda data : population.read_by_age(data, semester=1),
        "population_by_sex_data",
        7 * 24 * 60 * 60,
    ),
}
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
    "PopulationBySex1stJulYearly": (
        "https://data.csu.gov.cz/api/dotaz/v1/data/vybery/uzivatelske/09116ec4-f108-47ea-9fee-a7002c3c67b8?format=CSV&rozsah=CELY_VYBER&poznamky=false",
        "csv",
        population.read1stJul,
        "population_by_sex_data",
        7 * 24 * 60 * 60,
    ),
    "PopulationBySex31stDecYearly": (
        "https://data.csu.gov.cz/api/dotaz/v1/data/vybery/uzivatelske/09116ec4-f108-47ea-9fee-a7002c3c67b8?format=CSV&rozsah=CELY_VYBER&poznamky=false",
        "csv",
        population.read31stDec,
        "population_by_sex_data",
        7 * 24 * 60 * 60,
    ),
}
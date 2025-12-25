from typing import Final, Dict, Tuple, Callable, Any
import data.ruain as ruian
import data.finances.accounting_unit as accounting_unit
from data.demographics.population_by_age import read_by_age
from data.demographics.population_by_sex import read_by_sex
from data.demographics.population_movement import read_demographics_sheets
from data.demographics.unemployment import read_unemployment

URLS: Final[Dict[
    str,
    Tuple[
        str, # URL
        str, # Format
        Callable[[list | dict], Any], # Read function
        str | None, # Table name, used to get the date of the last update
        bool | int # Update period in seconds or False if no automatic updates
    ]
]] = {
    "ruian": (
        "https://vdp.cuzk.gov.cz/vdp/ruian/obce?sort=UZEMI&ohradaId=&nespravny=&kodVc=&kodOk=&kodOp=&kodPu=&nazevOb=&statusKod=&search=&mediaType=csv",
        "csv",
        ruian.read,
        None,
        False,
    ),

    "AccountingUnit": (
        "https://monitor.statnipokladna.gov.cz/data/csv/CIS_UCJED.CSV",
        "csv",
        accounting_unit.read,
        None,
        False,
    ),

    "PopulationBySex1stJulYearly": (
        "https://data.csu.gov.cz/api/dotaz/v1/data/vybery/uzivatelske/25b5ffc4-405c-4a1b-9dca-0c605edcb645?format=CSV&rozsah=CELY_VYBER&poznamky=false",
        "csv",
        lambda data : read_by_sex(data, semester=2),
        "population_by_sex_data",
        7 * 24 * 60 * 60,
    ),
    "PopulationBySex31stDecYearly": (
        "https://data.csu.gov.cz/api/dotaz/v1/data/vybery/uzivatelske/09116ec4-f108-47ea-9fee-a7002c3c67b8?format=CSV&rozsah=CELY_VYBER&poznamky=false",
        "csv",
        lambda data : read_by_sex(data, semester=1),
        "population_by_sex_data",
        7 * 24 * 60 * 60,
    ),

    "PopulationByAge1stJulYearly": (
        "https://data.csu.gov.cz/api/dotaz/v1/data/vybery/uzivatelske/fad46aa0-bcf8-448b-8493-efd348e80d2b?format=CSV&rozsah=CELY_VYBER&poznamky=false",
        "csv",
        lambda data : read_by_age(data, semester=2),
        "population_by_sex_data",
        7 * 24 * 60 * 60,
    ),
    "PopulationByAge1stJanYearly": (
        "https://data.csu.gov.cz/api/dotaz/v1/data/vybery/uzivatelske/fad46aa0-bcf8-448b-8493-efd348e80d2b?format=CSV&rozsah=CELY_VYBER&poznamky=false",
        "csv",
        lambda data : read_by_age(data, semester=1),
        "population_by_sex_data",
        7 * 24 * 60 * 60,
    ),

    "DemographicsMovementYearly": (
        # Data se musí manuálně aktualizovat, musí se aktualizovat rok v nuźvu souboru v URL
        "https://csu.gov.cz/docs/107516/8bb93788-d2a7-88ef-c5cc-760e723a1787/pohyb24.zip?version=1.1",
        "zip",
        read_demographics_sheets,
        "unemployment_data",
        7 * 24 * 60 * 60,
    ),

    "Unemployment31stDecYearly": (
        "https://data.csu.gov.cz/api/dotaz/v1/data/vybery/uzivatelske/1d35f85c-df4d-4d04-843e-3b20e08273fc?format=CSV&rozsah=CELY_VYBER&poznamky=false",
        "csv",
        read_unemployment,
        "unemployment_data",
        7 * 24 * 60 * 60,
    ),
}
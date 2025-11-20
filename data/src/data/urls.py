from typing import Final, Dict, Tuple, Callable, Any
import data.ruain as ruian

URLS: Final[Dict[
    str,
    Tuple[
        str,
        str,
        Callable[[list[dict]], Any]
    ]
]] = {
    "ruian": (
        "https://vdp.cuzk.gov.cz/vdp/ruian/obce?sort=UZEMI&ohradaId=&nespravny=&kodVc=&kodOk=&kodOp=&kodPu=&nazevOb=&statusKod=&search=&mediaType=csv",
        "csv",
        ruian.read
    ),
}
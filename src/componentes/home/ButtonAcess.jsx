export default function ButtonAcess({AcessPrim, AcessSec, LinkPrim, LinkSec, Class, OnClickPrim, OnClickSec}) {
    return (
        <>
            <li className="p-3 ml-1 mr-1 text-prim border rounded-md border-sec transition-all hover:bg-sec hover:bg-opacity-90 hover:text-white">
                <a href={LinkPrim} onClick={OnClickPrim} >{AcessPrim}</a>
            </li>
            <li className="p-3 ml-1 mr-1 text-white bg-des hover:bg-sec border rounded-md  transition-all">
                <a href={LinkSec} className={Class} onClick={OnClickSec}>{AcessSec}</a>
            </li>
        </>
    )
}
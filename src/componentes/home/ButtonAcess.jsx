export default function ButtonAcess({AcessPrim, AcessSec, LinkPrim, LinkSec, Class, OnClickPrim, OnClickSec}) {
    return (
        <>
            <li className="lg:p-3 lg:ml-1 lg:mr-1 md:p-3 md:ml-1 md:mr-1 sm:p-3 sm:ml-1 sm:mr-1 text-sm p-2 text-prim border rounded-md border-sec transition-all hover:bg-sec hover:bg-opacity-90 hover:text-white ">
                <a href={LinkPrim} onClick={OnClickPrim} >{AcessPrim}</a>
            </li>
            <li className="lg:p-3 lg:ml-1 lg:mr-1 md:p-3 md:ml-1 md:mr-1 sm:p-3 sm:ml-1 sm:mr-1 text-sm p-2 ml-2 text-white bg-des hover:bg-sec border rounded-md  transition-all">
                <a href={LinkSec} className={Class} onClick={OnClickSec}>{AcessSec}</a>
            </li>
        </>
    )
}
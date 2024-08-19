export default function ButtonAcess({AcessPrim, AcessSec, LinkPrim, LinkSec}) {
    return (
        <>
            <li className="p-3 ml-1 mr-1 text-prim border rounded-md border-sec transition-all hover:bg-sec hover:bg-opacity-90 hover:text-white">
                <a href={LinkPrim}>{AcessPrim}</a>
            </li>
            <li className="p-3 ml-1 mr-1 text-white bg-des hover:bg-sec border rounded-md  transition-all">
                <a href={LinkSec}>{AcessSec}</a>
            </li>
        </>
    )
}
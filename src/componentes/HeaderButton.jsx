export default function HeaderButton({link, text}) {
    return (
        <li className="p-3 ml-1 mr-1 text-prim border rounded-md border-trans transition-all duration-200 hover:text-sec hover:border-solid hover:border-bord"><a href={link}>{text}</a></li>
    )
}
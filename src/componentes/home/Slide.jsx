export default function Slide(props) {
    return (
        <section className="slide w-full pt-16" id="inicio">
            <div className="container-slide">
                <img 
                src={props.href}
                alt={props.alt}/>
            </div>
        </section>
    )
}
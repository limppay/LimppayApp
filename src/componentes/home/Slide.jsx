export default function Slide(props) {
    return (
        <section className="slide" id="inicio">
            <div className="container-slide">
                <img 
                src={props.href}
                alt={props.alt}/>
            </div>
        </section>
    )
}
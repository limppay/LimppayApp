export default function CardInfo({img, alt, title, description}){
    return (
        <div className='flex flex-col items-center justiy-center gap-2'>
            <img src={img} alt={alt} className='w-5/12 sm:w-3/12 md:w-3/12 lg:w-5/12'/>
            <div className='flex flex-col gap-3'>
                <h3 className='text-center text-desSec text-xl'>{title}</h3>
                {description.map((text, index) => (
                    <p key={index} className='text-prim text-justify'>{text}</p>
                ))}
            </div>
        </div>
    )
}
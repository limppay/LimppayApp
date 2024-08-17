export default function Button(props) {
    return (
        <a href="#" className='p-2 rounded-md w-2/4 max-w-full text-center bg-des text-white transition-all hover:bg-sec hover:bg-opacity-75'>{props.buttonName}</a>
    )
} 
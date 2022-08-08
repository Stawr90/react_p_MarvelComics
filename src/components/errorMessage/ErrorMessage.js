import img from './error.gif';

const ErrorMessage = () => { //картинка, при возврате ошибки с сервера
    return (
        // <img src={process.env.PUBLIC_URL + '/error.gif'} /> - обращаемся к окружению и находим папку public
        <img style={{ display: 'block', width: "250px", height: "250px",objectFit: 'contain', margin: "0 auto"}}  src={img} alt="Error"/>
    )
}

export default ErrorMessage;
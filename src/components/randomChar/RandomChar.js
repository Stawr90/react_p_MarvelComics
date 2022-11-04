import { useState, useEffect } from 'react';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import useMarvelService from '../../services/MarvelService';

import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';

const RandomChar = () => {

    const [char, setChar] = useState({});
    const {loading, error, getCharacter, clearError} = useMarvelService(); //берем сразу из нашего Хука и можем там менять
    //спинер загрузки и ошибки теперь обрабатываются внутри Хука (при каждлм обращении к серверу)

    useEffect(() => {
        updateChar();
        const timerId = setInterval(updateChar, 3600000);

        return () => {
            clearInterval(timerId); //отписываемся от повторяющегося действия
        }
    }, [])

    const onCharLoaded = (char) => { //записываем в объект с персонажами, после загрузки из API
        setChar(char);
    }

    const updateChar = () => {
        clearError(); //очищаем ошибку от сообщения, для подгрузки нового персонажа
        const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000); //рандомное число
        getCharacter(id)
            .then(onCharLoaded); //перезаписываем объект с нужными характеристиками из API
    }

    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;
    const content = !(loading || error) ? <View char={char}/> : null;

    return (
        <div className="randomchar">
            {errorMessage}
            {spinner}
            {content}
            <div className="randomchar__static">
                <p className="randomchar__title">
                    Random character for today!<br/>
                    Do you want to get to know him better?
                </p>
                <p className="randomchar__title">
                    Or choose another one
                </p>
                <button className="button button__main" onClick={updateChar}>
                    <div className="inner">try it</div>
                </button>
                <img src={mjolnir} alt="mjolnir" className="randomchar__decoration"/>
            </div>
        </div>
    )
}

const View = ({char}) => { //компонент View просто принимает данные и отображает на странице
    const {name, description, thumbnail, homepage, wiki} = char;
    let imgStyle = {'objectFit' : 'cover'};
    if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
        imgStyle = {'objectFit' : 'contain'};
    }

    return (
        <div className="randomchar__block">
            <img src={thumbnail} alt="Random character" className="randomchar__img" style={imgStyle}/>
            <div className="randomchar__info">
                <p className="randomchar__name">{name}</p>
                <p className="randomchar__descr">
                    {description}
                </p>
                <div className="randomchar__btns">
                    <a href={homepage} className="button button__main">
                        <div className="inner">homepage</div>
                    </a>
                    <a href={wiki} className="button button__secondary">
                        <div className="inner">Wiki</div>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default RandomChar;
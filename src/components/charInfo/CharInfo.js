import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton';

import './charInfo.scss';

const CharInfo = (props) => {

    const [char, setChar] = useState(null); //пустой объект, это уже true, хоть и в нем ничего нет (а null даст как раз false)
    const [loading, setLoading] = useState(false); //изменится только после выбора персонажа пользователем
    const [error, setError] = useState(false);

    const marvelService = new MarvelService();

    useEffect(() => {
        updateChar();
    }, [props.charId])

    const updateChar = () => {
        const {charId} = props; //вытаскиваем полученный id из App (записали в props)
        if (!charId) { //если ID нет, то остановим метод (при первой загузке ничего и не покажет)
            return; 
        }

        onCharLoading();

        marvelService.getCharacter(charId)
            .then(onCharLoaded)
            .catch(onError);
    }

    const onCharLoaded = (char) => { //записываем в объект с персонажами, после загрузки из API
        setChar(char);
        setLoading(false); //загрузка выключается, после подгрузки всех характеристик персонажа
    }

    const onCharLoading = () => {
        setLoading(true);
    }

    const onError = () => { //при ошибке, идет показ изображения
        setLoading(false);
        setError(true)
    }

    //здесь прописана логика и состояние компонента, до формирования верстки (View)
    const skeleton = char || loading || error ? null : <Skeleton/>; //постим заглушку (скелетон), если ничего нет
    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;
    const content = !(loading || error || !char) ? <View char={char}/> : null; //не загрузка, не ошибка, но есть персонаж

    return (
        <div className="char__info">
            {skeleton}
            {errorMessage}
            {spinner}
            {content}
        </div>
    )
}

const View = ({char}) => { //формирование верстки на странице
    const {name, description, thumbnail, homepage, wiki, comics} = char;
    let imgStyle = {'objectFit' : 'cover'};
    if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
        imgStyle = {'objectFit' : 'contain'};
    }

    return (
        <>
            <div className="char__basics">
                <img src={thumbnail} alt={name} style={imgStyle}/>
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">
                {description}
            </div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {comics.length > 0 ? null : 'There is no comics with this character'}
                {comics.map((item, i) => {
                    // eslint-disable-next-line
                    if (i > 9) return; //при большем кол-ве элементов применять стандартный цикл с break!
                        return (
                            <li key={i} className="char__comics-item">
                                {item.name}
                            </li>
                        )    
                })}
            </ul>
        </>
    )
}

CharInfo.propTypes = {
    charId: PropTypes.number
}


export default CharInfo;
import { Component } from 'react';

import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton';

import './charInfo.scss';

class CharInfo extends Component {
    state = { //поля классов
        char: null, //пустой объект, это уже true, хоть и в нем ничего нет
        loading: false,
        error: false
    }

    marvelService = new MarvelService();

    componentDidMount() {
        this.updateChar();
    }

    componentDidUpdate(prevProps) { //всегда использовать prevProps, prevState чтоб не зациклить запросы!
        if (this.props.charId !== prevProps.charId) { //обязательно сравнивать что было, и что приходит
            this.updateChar();
        }
    }

    updateChar = () => {
        const {charId} = this.props;
        if (!charId) { //если ID нет, то остановим метод
            return;
        }

        this.onCharLoading();

        this.marvelService
            .getCharacter(charId)
            .then(this.onCharLoaded)
            .catch(this.onError);
    }

    onCharLoaded = (char) => { //записываем в объект с персонажами, после загрузки из API
        this.setState({
            char, 
            loading: false //загрузка выключается, после подгрузки всех характеристик персонажа
        })
    }

    onCharLoading = () => {
        this.setState({
            loading: true
        })
    }

    onError = () => { //при ошибке, идет показ изображения
        this.setState({
            loading: false,
            error: true
        })
    }

    render() { //здесь прописана логика приложения, до формирования верстки (View)
        const {char, loading, error} = this.state;

        const skeleton = char || loading || error ? null : <Skeleton/>; //постим заглушку (скелетон), если ничего нет
        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error || !char) ? <View char={char}/> : null;

        return (
            <div className="char__info">
                {skeleton}
                {errorMessage}
                {spinner}
                {content}
            </div>
        )
    }
}

const View = ({char}) => { //формирование верстки на странице
    const {name, description, thumbnail, homepage, wiki, comics} = char;
    return (
        <>
            <div className="char__basics">
                <img src={thumbnail} alt={name}/>
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
                {comics.map((item, i) => {
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

export default CharInfo;
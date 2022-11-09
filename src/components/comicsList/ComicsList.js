import {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import useMarvelService from '../../services/MarvelService';

import './comicsList.scss';

const ComicsList = () => {
    const [comicsList, setComicsList] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false); //загрузка новых персонажей
    const [offset, setOffset] = useState(0); //с какого кол-ва персонажей начинаем
    const [comicsEnded, setComicsEnded] = useState(false); //когда закончился массив с персонажами

    const {loading, error, getAllComics} = useMarvelService();

    useEffect(() => { //при создании элемента на странице
        onRequest(offset, true);
    }, [])

    const onRequest = (offset, initial) => { //делаем запрос на сервер с новым отступом (в 8 персонажей)
        initial ? setNewItemLoading(false) : setNewItemLoading(true); //включается загрузка, только при подгрузке новых персонажей
        getAllComics(offset)
            .then(onComicsListLoaded)
    }

    const onComicsListLoaded = (newComicsList) => { //записываем в массив с персонажами, после загрузки из API (персонажи загрузились)
        let ended = false;
        if (newComicsList.length < 8) { //если осталось меньше 8 персонажей на сервере, меняем ниже состояние charEnded
            ended = true;
        }
        
        setComicsList([...comicsList, ...newComicsList]); //добавляем новых 8 персонажей к старым 0, 8, 16 и т.д.
        setNewItemLoading(false);
        setOffset(offset + 8);
        setComicsEnded(ended);
    }

    function renderItems (arr) {
        const items = arr.map((item, i) => {
            return (
                <li className="comics__item" key={i}>
                    <Link to={`/comics/${item.id}`}>
                        <img src={item.thumbnail} alt={item.title} className="comics__item-img"/>
                        <div className="comics__item-name">{item.title}</div>
                        <div className="comics__item-price">{item.price}</div>
                    </Link>
                </li>
            )
        })

        return (
            <ul className="comics__grid">
                {items}
            </ul>
        )
    }
    
    const items = renderItems(comicsList);

    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading && !newItemLoading ? <Spinner/> : null; // идет загрузка первых 8 и не загрузка новых персонажей

    return (
        <div className="comics__list">
            {errorMessage}
            {spinner}
            {items}
            <button 
                className="button button__main button__long"
                disabled={newItemLoading} //если идет подгрузка персонажей, кнопка стает неактивной
                style={{'display': comicsEnded ? 'none' : 'block'}} //когда уже некого загружать, скрываем кнопку
                //при клике, добавляем 8 новых персонажей
                onClick={() => onRequest(offset)}> 
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;
import {useState, useEffect} from 'react';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import useMarvelService from '../../services/MarvelService';

import './comicsList.scss';

const ComicsList = () => {
    const [charList, setCharList] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false); //загрузка новых персонажей
    const [offset, setOffset] = useState(210); //с какого кол-ва персонажей начинаем
    const [charEnded, setCharEnded] = useState(false); //когда закончился массив с персонажами

    const {loading, error, getAllComics} = useMarvelService();

    useEffect(() => { //при создании элемента на странице
        onRequest(offset, true);
    }, [])

    const onRequest = (offset, initial) => { //делаем запрос на сервер с новым отступом (в 8 персонажей)
        initial ? setNewItemLoading(false) : setNewItemLoading(true); //включается загрузка, только при подгрузке новых персонажей
        getAllComics(offset)
            .then(onCharListLoaded)
    }

    const onCharListLoaded = (newCharList) => { //записываем в массив с персонажами, после загрузки из API (персонажи загрузились)
        let ended = false;
        if (newCharList.length < 8) { //если осталось меньше 8 персонажей на сервере, меняем ниже состояние charEnded
            ended = true;
        }
        
        setCharList(charList => [...charList, ...newCharList]); //добавляем новых 8 персонажей к старым 0, 8, 16 и т.д.
        setNewItemLoading(newItemLoading => false);
        setOffset(offset => offset + 8);
        setCharEnded(charEnded => ended);
    }

    function renderItems(arr) {
        const items =  arr.map((item, i) => {
            let imgStyle = {'objectFit' : 'cover'};
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'unset'};
            }
            
            return (
                <li //id передается выше в app
                    className="comics__item"
                    key={item.id + Math.random()}
                    tabIndex={0} //фокус на элементе с клавиатуры 
                    // onClick={() => {
                    //     props.onCharSelected(item.id); //передаем id выше в App
                    //     focusOnItem(i);
                    // }}
                    // onKeyPress={(e) => { //событие нажатия на клавиатуру (элемент должен быть в фокусе)
                    //     if (e.key === ' ' || e.key === 'Enter') {
                    //         props.onCharSelected(item.id);
                    //         focusOnItem(i);
                    //     }
                    // }}
                >
                    <a href="https://www.marvel.com/comics">
                        <img src={item.thumbnail} alt={item.title} className="comics__item-img"/>
                        <div className="comics__item-name">{item.title}</div>
                        <div className="comics__item-price">{item.prices}</div>
                    </a>
                </li>
            )
        });
        
        return ( //эта конструкция вынесена для центровки спиннера/ошибки
            <ul className="comics__grid">
                {items}
            </ul>
        )
    }
    
    const items = renderItems(charList);

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
                style={{'display': charEnded ? 'none' : 'block'}} //когда уже некого загружать, скрываем кнопку
                //при клике, добавляем 8 новых персонажей
                onClick={() => onRequest(offset)}> 
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;
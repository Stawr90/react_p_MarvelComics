import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';

import './charList.scss';

const CharList = (props) => {

    const [charList, setCharList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [newItemLoading, setNewItemLoading] = useState(false); //загрузка новых персонажей
    const [offset, setOffset] = useState(210); //с какого кол-ва персонажей начинаем
    const [charEnded, setCharEnded] = useState(false); //когда закончился массив с персонажами

    const marvelService = new MarvelService();

    useEffect(() => { //при создании элемента на странице
        onRequest();
    }, [])

    const onRequest = (offset) => { //делаем запрос на сервер с новым отступом (в 9 персонажей)
        onCharListLoading();
        marvelService.getAllCharacters(offset)
            .then(onCharListLoaded)
            .catch(onError)
    }

    const onCharListLoading = () => { //загружаются новые персонажи (после нажатия на кнопку)
        setNewItemLoading(true);
    }

    const onCharListLoaded = (newCharList) => { //записываем в массив с персонажами, после загрузки из API (персонажи загрузились)
        let ended = false;
        if (newCharList.length < 9) { //если осталось меньше 9 персонажей на сервере, меняем ниже состояние charEnded
            ended = true;
        }
        
        setCharList(charList => [...charList, ...newCharList]); //добавляем новых 9 персонажей к старым 0, 9, 18, 27 и т.д.
        setLoading(loading => false);
        setNewItemLoading(newItemLoading => false);
        setOffset(offset => offset + 9);
        setCharEnded(charEnded => ended);
    }

    const onError = () => { //при возврате ошибки от сервера
            setError(true);
            setLoading(loading => false);
    }

    const itemRefs = useRef([]);

    const focusOnItem = (id) => { //при клике добавим класс и фокус на элемент
        itemRefs.current.forEach(item => item.classList.remove('char__item_selected'));
        itemRefs.current[id].classList.add('char__item_selected');
        itemRefs.current[id].focus();
    }

    // Этот метод создан для оптимизации, 
    // чтобы не помещать такую конструкцию в метод render
    function renderItems(arr) {
        const items =  arr.map((item, i) => {
            let imgStyle = {'objectFit' : 'cover'};
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'unset'};
            }
            
            return (
                <li //id передается выше в app
                    ref={el => itemRefs.current[i] = el}
                    className="char__item"
                    key={item.id}
                    tabIndex={0} //фокус на элементе с клавиатуры 
                    onClick={() => {
                        props.onCharSelected(item.id); //передаем id выше в App
                        focusOnItem(i);
                    }}
                    onKeyPress={(e) => { //событие нажатия на клавиатуру (элемент должен быть в фокусе)
                        if (e.key === ' ' || e.key === 'Enter') {
                            props.onCharSelected(item.id);
                            focusOnItem(i);
                        }
                    }}>
                        <img src={item.thumbnail} alt={item.name} style={imgStyle}/>
                        <div className="char__name">{item.name}</div>
                </li>
            )
        });
        
        return ( //эта конструкция вынесена для центровки спиннера/ошибки
            <ul className="char__grid">
                {items}
            </ul>
        )
    }
    
    const items = renderItems(charList);

    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;
    const content = !(loading || error) ? items : null;

    return (
        <div className="char__list">
            {errorMessage}
            {spinner}
            {content}
            <button 
                className="button button__main button__long"
                disabled={newItemLoading} //если идет подгрузка персонажей, кнопка стает неактивной
                style={{'display': charEnded ? 'none' : 'block'}} //когда уже некого загружать, скрываем кнопку
                //при клике, добавляем 9 новых персонажей
                onClick={() => onRequest(offset)}> 
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

CharList.propTypes = { //проверяем на тип данных и их наличие
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;
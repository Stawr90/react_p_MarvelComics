import { Component } from 'react';
import PropTypes from 'prop-types';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';

import './charList.scss';

class CharList extends Component {
    state = {
        charList: [],
        loading: true,
        error: false,
        newItemLoading: false, //загрузка новых персонажей
        offset: 210, //с какого кол-ва персонажей начинаем
        charEnded: false //когда закончился массив с персонажами
    }

    marvelService = new MarvelService();

    componentDidMount() { //при создании элемента на странице
        this.onRequest();
    }

    onRequest = (offset) => { //делаем запрос на сервер с новым отступом (в 9 персонажей)
        this.onCharListLoading();
        this.marvelService.getAllCharacters(offset)
            .then(this.onCharListLoaded)
            .catch(this.onError)
    }

    onCharListLoading = () => { //загружаются новые персонажи (после нажатия на кнопку)
        this.setState({
            newItemLoading: true
        })
    }

    onCharListLoaded = (newCharList) => { //записываем в массив с персонажами, после загрузки из API (персонажи загрузились)
        let ended = false;
        if (newCharList.length < 9) { //если осталось меньше 9 персонажей на сервере, меняем ниже состояние charEnded
            ended = true;
        }
        
        this.setState(({offset, charList}) => ({ //отталкиваемся от предыдущих даннных (поэтому callback function)
            charList: [...charList, ...newCharList], //добавляем новых 9 персонажей к старым 0, 9, 18, 27 и т.д.
            loading: false,
            newItemLoading: false,
            offset: offset + 9,
            charEnded: ended
        }))
    }

    onError = () => { //при возврате ошибки от сервера
        this.setState({
            error: true,
            loading: false
        })
    }

    itemRefs = [];

    setRef = (ref) => {  //ссылаемся на элементы в массиве
        this.itemRefs.push(ref); //формируем массив
    }

    focusOnItem = (id) => { //при клике добавим класс и фокус на элемент
        this.itemRefs.forEach(item => item.classList.remove('char__item_selected'));
        this.itemRefs[id].classList.add('char__item_selected');
        this.itemRefs[id].focus();
    }

    // Этот метод создан для оптимизации, 
    // чтобы не помещать такую конструкцию в метод render
    renderItems(arr) {
        const items =  arr.map((item, i) => {
            let imgStyle = {'objectFit' : 'cover'};
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'unset'};
            }
            
            return (
                <li //id передается выше в app
                    ref={this.setRef}
                    className="char__item"
                    key={item.id}
                    tabIndex={0} //фокус на элементе с клавиатуры 
                    onClick={() => {
                        this.props.onCharSelected(item.id); //передаем id выше в App
                        this.focusOnItem(i);
                    }}
                    onKeyPress={(e) => { //событие нажатия на клавиатуру (элемент должен быть в фокусе)
                        if (e.key === ' ' || e.key === 'Enter') {
                            this.props.onCharSelected(item.id);
                            this.focusOnItem(i);
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

    render() {

        const {charList, loading, error, newItemLoading, offset, charEnded} = this.state;
        
        const items = this.renderItems(charList);

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
                    onClick={() => this.onRequest(offset)}> 
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

CharList.propTypes = { //проверяем на тип данных и их наличие
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;
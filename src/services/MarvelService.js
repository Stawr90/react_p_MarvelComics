import {useHttp} from '../hooks/http.hook';

//Простой класс на обычном JS (ничего наследовать от React не требуется)
const useMarvelService = () => {
    const {loading, request, error} = useHttp();

    const _apiBase = 'https://gateway.marvel.com:443/v1/public/'; // _ данные не должны изменяться
    const _apiKey = 'apikey=ebdf3e4682780795ea407ac7fd512bcc';
    const _baseOffset = 210; //начинаем с такого кол-ва персонажей

    const getAllCharacters = async (offset = _baseOffset) => { //получение всех персонажей (по умолчанию offset = 210)
        const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformCharacter); //получаем новый массив с нужными характеристиками персонажей
    }

    const getCharacter = async (id) => { //получение определенного персонажа по id
        const res = await request(`${_apiBase}characters/${id}?${_apiKey}`); //получаем все характеристики
        return _transformCharacter(res.data.results[0]); //получение только нужных характеристик
    }

    const _transformCharacter = (char) => { //получение нужных данных из API
        return {
            id: char.id,
            name: char.name,
            description: char.description ? `${char.description.slice(0, 210)}...` : 'There is no description for this character',
            thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            comics: char.comics.items
        }
    }

    return {loading, error, getAllCharacters, getCharacter} //вытаскиваем нужные компоненты для дальнейшего использования
}

export default useMarvelService;
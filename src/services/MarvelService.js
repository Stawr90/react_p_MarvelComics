import {useHttp} from '../hooks/http.hook';

//Простой класс на обычном JS (ничего наследовать от React не требуется)
const useMarvelService = () => {
    const {loading, request, error, clearError} = useHttp();

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

    const getAllComics = async (offset = 0) => {
        const res = await request(`${_apiBase}comics?orderBy=issueNumber&limit=8&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformComics);
    }

    const getComic = async (id) => {
        const res = await request(`${_apiBase}comics/${id}?${_apiKey}`);
        return _transformComics(res.data.results[0]);
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

    const _transformComics = (comics) => {
        return {
            id: comics.id,
            title: comics.title,
            description: comics.description || 'There is no description',
            pageCount: comics.pageCount ? `${comics.pageCount} p.` : 'No information about the number of pages',
            thumbnail: comics.thumbnail.path + '.' + comics.thumbnail.extension,
            language: comics.textObjects.language || 'en-us',
            price: comics.prices.price ? `${comics.prices.price}$` : 'not available'
        }
    }

    return {loading, error, clearError, getAllCharacters, getCharacter, getAllComics, getComic} //вытаскиваем нужные компоненты для дальнейшего использования
}

export default useMarvelService;
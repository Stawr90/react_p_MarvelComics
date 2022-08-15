
class MarvelService {
    _apiBase = 'https://gateway.marvel.com:443/v1/public/'; // _ данные не должны изменяться
    _apiKey = 'apikey=ebdf3e4682780795ea407ac7fd512bcc';
    _baseOffset = 210; //начинаем с такого кол-ва персонажей

    getResource = async (url) => { //запрос на сервер
        let res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);

        }

        return await res.json();
    }

    getAllCharacters = async (offset = this._baseOffset) => { //получение всех персонажей (по умолчанию offset = 210)
        const res = await this.getResource(`${this._apiBase}characters?limit=9&offset=${offset}&${this._apiKey}`);
        return res.data.results.map(this._transformCharacter); //получаем новый массив с нужными характеристиками персонажей
    }

    getCharacter = async (id) => { //получение определенного персонажа по id
        const res = await this.getResource(`${this._apiBase}characters/${id}?${this._apiKey}`); //получаем все характеристики
        return this._transformCharacter(res.data.results[0]); //получение только нужных характеристик
    }

    _transformCharacter = (char) => { //получение нужных данных из API
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
}

export default MarvelService;
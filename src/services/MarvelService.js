
class MarvelService {
    _apiBase = 'https://gateway.marvel.com:443/v1/public/'; // _ данные не должны изменяться
    _apiKey = 'apikey=ebdf3e4682780795ea407ac7fd512bcc';

    getResource = async (url) => { //запрос на сервер
        let res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);

        }

        return await res.json();
    }

    getAllCharacters = () => { //получение всех персонажей
        return this.getResource(`${this._apiBase}characters?limit=9&offset=210&${this._apiKey}`);
    }

    getCharacter = (id) => { //получение определенного персонажа по id
        return this.getResource(`${this._apiBase}characters/${id}?${this._apiKey}`);
    }
}

export default MarvelService;
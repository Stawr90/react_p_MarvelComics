import {useState, useCallback} from 'react';

export const useHttp = () => { // Хук запроса и обработки данных с сервера
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const request = useCallback(async (url, method='GET', body = null, headers = {'Content-type': 'applicatiion/json'}) => {
        setLoading(true);

        try {
            const response = await fetch(url, {method, body, headers});

            if (!response.ok) {
                throw new Error(`Could not fetch ${url}, status: ${response.status}`); //отправим в catch
            }

            const data = await response.json();
            setLoading(false); //как данные пришли, выключим загрузку
            return data;
        } catch(e) {
            setLoading(false);
            setError(e.message); //поменяем на заранее подготовленное сообщение (установим ошибку)
            throw(e); //выкидываем ошибку
        }
    }, []);

    const clearError = useCallback(() => setError(null), []);

    return {loading, request, error, clearError}
}
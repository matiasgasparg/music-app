import { useState, useEffect } from 'react';

function useFetch(url, options = {}) {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(null);

    const doFetch = async (newUrl, newOptions) => {
        setIsLoading(true);
        setIsError(null);

        try {
            const response = await fetch(newUrl || url, newOptions);
            const contentType = response.headers.get('Content-Type');

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            if (contentType && contentType.includes('application/json')) {
                const json = await response.json();
                setData(json);
            } else {
                const text = await response.text(); // Lee la respuesta como texto
                throw new Error(`Expected JSON but received ${contentType}. Response text: ${text}`);
            }
        } catch (error) {
            setIsError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        doFetch();
    }, [url]);

    return { data, isLoading, isError, doFetch };
}

export default useFetch;

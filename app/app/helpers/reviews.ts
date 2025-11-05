import axios from 'axios';
import env from '#start/env'
export async function searchPlaceRequest(config: object) {
    try {
        const response = await axios.request(config);
        return response.data;
    }
    catch (error) {
        console.log(error);
    }
}

export async function searchReviewRequest(config: object){
    try {
        const response = await axios.request(config);
        return response.data;
    }
    catch (error) {
        console.log(error);
    }
}

export async function getsReviews(name: string){
    const dataFirstRequest = JSON.stringify({
        "q": name,
        "location": "Rio de Janeiro, State of Rio de Janeiro, Brazil",
        "gl": "br",
        "hl": "pt-br"
    });

    const configFirstRequest = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://google.serper.dev/places',
        headers: {
            'X-API-KEY': env.get('SERPER-KEY'),
            'Content-Type': 'application/json'
        },
        data : dataFirstRequest
    };

    let result = await searchPlaceRequest(configFirstRequest);

    let cid = result.places[0].cid;

    console.log(cid);

    let data = JSON.stringify({
        "cid": cid,
        "gl": "br",
        "hl": "pt-br",
        "sortBy": "newest"
    });

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://google.serper.dev/reviews',
        headers: {
            'X-API-KEY': env.get('SERPER_KEY'),
            'Content-Type': 'application/json'
        },
        data : data
    };

    return searchReviewRequest(config);

}
import axios from 'axios';

// 도로명 주소 검색 API, https://www.juso.go.kr/addrlink/devAddrLinkRequestGuide.do?menu=roadApi
const JUSO_API_KEY = 'U01TX0FVVEgyMDE5MDExMDEzNTg1MjEwODQzNjc=';
const JUSO_API_ENDPOINT = 'http://www.juso.go.kr';

export const jusoHttpClient = axios.create({
    baseURL: JUSO_API_ENDPOINT,
    timeout: 5000,
    // headers: {'Content-Type': 'application/json', Accept: 'application/json,text/plain,*/*'},
});

export function jusoSearch(addressSearchString, currentPage) {
    // `?confmKey=${JUSO_API_KEY}&currentPage=1&countPerPage=100&keyword=${addressSearchString}&resultType=json`
    return jusoHttpClient.get('/addrlink/addrLinkApi.do' +
        `?confmKey=${JUSO_API_KEY}&currentPage=${currentPage}&countPerPage=40&keyword=${addressSearchString}&resultType=json`,
        {
            // params: {
            //     confmKey: JUSO_API_KEY,
            //     currentPage: 1,
            //     countPerPage: 100,
            //     keyword: addressSearchString,
            //     resultType: 'json',
            // },
        })
        .catch((err) => console.error(err));
}

// export function jusoSearch(addressSearchString, currentPage) {
//     // `?confmKey=${JUSO_API_KEY}&currentPage=1&countPerPage=100&keyword=${addressSearchString}&resultType=json`
//     return fetch(`${JUSO_API_ENDPOINT}/addrlink/addrLinkApi.do` +
//         `?confmKey=${JUSO_API_KEY}&currentPage=${currentPage}&countPerPage=40&keyword=${addressSearchString}&resultType=json`)
//         .then((response) => response.json())
//         .catch((err) => console.error(err));
// }
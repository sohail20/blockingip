import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: '/api', // Assuming the base URL is '/api'
    headers: {
        'Content-Type': 'application/json',
    },
});


function postError(err){
    fetch("/api/log", {
        body: JSON.stringify({ level: "error", message: err })
    })
}
axiosInstance.interceptors.request.use(
    async (config) => {
        try {
            fetch("/api/log", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(config)
            }).then(res => {
                console.log("res", res)
            })
            // const newDoc = await insertData({
            //     method: config.method.toUpperCase(),
            //     url: config.url,
            //     request_body: JSON.stringify(config.data),
            // })
            // const docs = await findData({ method: "POST" })
            // console.log("asdasddocsdocsdocsdocsdocs", docs)
            // return docs;
        } catch (err) {
            postError(err)
            console.error('Error storing request:', err);
        }
        return config;
    },
    (error) => {
        console.error('Request error', error);
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    async (response) => {
        try {
            // console.log("adasdsadresponse", response)
        } catch (err) {
            console.error('Error updating response:', err);
        }
        return response;
    },
    (error) => {
        console.error('Response error', error);
        return Promise.reject(error);
    }
);

export default axiosInstance;

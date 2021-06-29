import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

export class HTTPClient{
	private http: AxiosInstance;

	constructor(baseURL: string){
		this.http = axios.create({ baseURL: baseURL });
	}

	get<T = any, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R>{
		return this.http.get<T, R>(url, config);
	}

	post<T = any, R = AxiosResponse<T>>(url: string, data?: T, config?: AxiosRequestConfig): Promise<R>{
		return this.http.post<T, R>(url, data, config);
	}
}

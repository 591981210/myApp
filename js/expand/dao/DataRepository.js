/**
 * Created by penn on 2016/12/21.
 */

import {AsyncStorage} from 'react-native'

import GitHubTrending from 'GitHubTrending'

export var FLAG_STORAGE = {flag_popular: 'popular', flag_trending: 'trending'}
export default class DataRepository {
    constructor(flag) {
        this.flag = flag;
        if (flag == FLAG_STORAGE.flag_trending) {
            this.trending = new GitHubTrending()
        }
    }

    saveRepository(url, items, callback) {
        if (!items || !url) return;
        let wrapData = {items: items, update_date: new Date().getTime()};
        AsyncStorage.setItem(url, JSON.stringify(wrapData), callback);
    }

    /**
     * 判断数据是否过时
     * @param longTime 数据的时间戳
     * @returns {boolean}
     */
    checkData(longTime) {
        let cDate = new Date();
        let tDate = new Date();
        tDate.setTime(longTime)
        if (cDate.getMonth() !== tDate.getMonth()) return false;
        if (cDate.getDay() !== tDate.getDay()) return false;
        if (cDate.getHours() - tDate.getHours() > 4) return false;
        return true
    }


    fetchRepository(url) {
        return new Promise((resolve, reject) => {
            this.fetchLocalRepository(url).then((wrapData) => {
                if (wrapData) {
                console.log(1111)
                    resolve(wrapData, true);
                } else {
                    this.fetchNetRepository(url).then((data) => {
                    console.log(444)
                        resolve(data);
                    }).catch((error) => {
                        console.log(555)
                        reject(error);
                    })
                }

            }).catch((error) => {
                console.log(333)
                this.fetchNetRepository(url).then((data) => {
                    resolve(data);
                }).catch((error => {
                    reject(error);
                }))
            })
        })
    }

    fetchLocalRepository(url) {
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem(url, (error, result) => {
                if (!error) {
                    try {
                        resolve(JSON.parse(result));
                    } catch (e) {
                        reject(e);
                        console.error(e);
                    }
                } else {
                    reject(error);
                    console.error(error);
                }
            })
        })
    }

    fetchNetRepository(url) {
        return new Promise((resolve, reject) => {
            if (this.flag === FLAG_STORAGE.flag_trending) {
                this.trending.fetchTrending(url)
                    .then(res => {
                        if (!res) {
                            reject(new Error('responseData is null'))
                            return;
                        }
                        this.saveRepository(url, res)
                        resolve(res)
                    })
            } else {
                fetch(url)
                    .then(res => res.json())
                    .catch(error => {
                        reject(error)
                    })
                    .then(res => {
                        if (!res || !res.items) {
                            reject(new Error('responseData is null'))
                        } else {
                            resolve(res.items)
                            this.saveRepository(url, res.items)
                        }
                    }).done()

            }
        })
    }
}
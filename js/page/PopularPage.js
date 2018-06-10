/**
 * Created by penn on 2016/12/14.
 */

import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    Text,
    TextInput
} from 'react-native'
import NavigationBar from '../common/NavigationBar';
import DataRepository from '../expand/dao/DataRepository';

const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';
export default class PopularPage extends Component {
    constructor(props) {
        super(props);
        this.dataRepository = new DataRepository();
        this.state = {
            result: ''
        }
    }


    onLoad() {
        let url = this.genUrl(this.text)
        this.dataRepository.fetchNetRepository(url)
            .then(res => {
                this.setState({
                    result: JSON.stringify(res)
                })
            })
            .catch(error => {
                console.log(error)
                this.setState({
                    result: JSON.stringify(error)
                })
            })
    }

    genUrl(key) {
        console.log(URL + key + QUERY_STR)
        return URL + key + QUERY_STR
    }

    render() {
        return (
            <View style={styles.container}>
                <NavigationBar
                    title='最热'
                    style={{backgroundColor: '#6495ED'}}
                />
                <Text onPress={() => {this.onLoad()}}
                    style={styles.tips}>获取数据</Text>
                <TextInput
                    style={{height: 40, borderWidth: 1}}
                    onChangeText={text => this.text = text}
                ></TextInput>
                <Text style={{height: 500}}>{this.state.result}</Text>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,

    },
    tips: {
        fontSize: 29
    }
})

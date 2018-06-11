/**
 * Created by penn on 2016/12/14.
 */

import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    Text,
    TextInput,
    ListView,
    RefreshControl
} from 'react-native'
import NavigationBar from '../common/NavigationBar';
import DataRepository from '../expand/dao/DataRepository';
import RepositoryCell from '../common/RepositoryCell'
import ScrollableTableView,{ScrollableTabBar} from 'react-native-scrollable-tab-view'

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
                    statusBar={{
                        backgroundColor: '#2196F3'
                    }}
                />
                <ScrollableTableView
                    renderTabBar={()=><ScrollableTabBar/>}
                >
                    <PopularTab tabLabel="java"></PopularTab>
                    <PopularTab tabLabel="ios"></PopularTab>
                    <PopularTab tabLabel="Android"></PopularTab>
                    <PopularTab tabLabel="javaScript"></PopularTab>
                </ScrollableTableView>
            </View>
        )
    }
}
class PopularTab extends Component {
    constructor(props) {
        super(props);
        this.dataRepository = new DataRepository();
        this.state = {
            dataSource: new ListView.DataSource({rowHasChanged: (r1, r2)=>r1 !== r2}),
        }
    }

    componentDidMount() {
        this.loadData();
    }

    loadData() {
        this.setState({
            isLoading: true
        })
        let url=this.genFetchUrl(this.props.tabLabel);
        this.dataRepository
            .fetchNetRepository(url)
            .then(result=> {
                this.setState({
                    isLoading: false,
                    dataSource:this.state.dataSource.cloneWithRows(result.items)
                })
            })
            .catch(error=> {
                console.log(error)
                this.setState({
                    isLoading: false
                });
            })
    }
    genFetchUrl(key) {
        return URL + key + QUERY_STR;
    }


    renderRow(data) {
        return <RepositoryCell
            key={data.id}
            data={data}
        />
    }

    render() {
        return <View style={styles.container}>
            <ListView
                dataSource={this.state.dataSource}
                renderRow={(data)=>this.renderRow(data)}
                refreshControl={
                    <RefreshControl
                        title='Loading...'
                        titleColor='#2196F3'
                        colors={['#2196F3']}
                        refreshing={this.state.isLoading}
                        onRefresh={()=>this.loadData()}
                        tintColor='#2196F3'
                    />
                }
            />
        </View>
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

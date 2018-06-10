/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    Image,
    View,
} from 'react-native';

import TabNavigator from 'react-native-tab-navigator';
import PopularPage from './PopularPage'
export default class HomePage extends Component {
    constructor(props) {
        super(props);
        //初始向
        this.state = {
            selectedTab: 'tb_popular',
        }
    }

    render() {
        return (
            <View style={styles.container}>
                {<TabNavigator>
                    <TabNavigator.Item
                        selected={this.state.selectedTab === 'tb_popular'}
                        selectedTitleStyle={{color: 'red'}}
                        title="最热"
                        renderIcon={() => <Image style={styles.image} source={require('../../res/images/ic_polular.png')}/>}
                        renderSelectedIcon={() => <Image style={[styles.image, {tintColor: 'red'}]}
                                                         source={require('../../res/images/ic_polular.png')}/>}
                        onPress={() => this.setState({selectedTab: 'tb_popular'})}>
                        <PopularPage/>
                    </TabNavigator.Item>
                    <TabNavigator.Item
                        selected={this.state.selectedTab === 'tb_trending'}
                        title="趋势"
                        selectedTitleStyle={{color: 'yellow'}}
                        renderIcon={() => <Image style={styles.image}
                                                 source={require('../../res/images/ic_trending.png')}/>}
                        renderSelectedIcon={() => <Image style={[styles.image, {tintColor: 'yellow'}]}
                                                         source={require('../../res/images/ic_trending.png')}/>}
                        onPress={() => this.setState({selectedTab: 'tb_trending'})}>
                        <View style={{backgroundColor: 'yellow', flex: 1}}></View>
                    </TabNavigator.Item>
                    <TabNavigator.Item
                        selected={this.state.selectedTab === 'tb_favorite'}
                        title="收藏"
                        selectedTitleStyle={{color: 'green'}}
                        renderIcon={() => <Image style={styles.image}
                                                 source={require('../../res/images/ic_favorite.png')}/>}
                        renderSelectedIcon={() => <Image style={[styles.image, {tintColor: 'green'}]}
                                                         source={require('../../res/images/ic_favorite.png')}/>}
                        onPress={() => this.setState({selectedTab: 'tb_favorite'})}>
                        <View style={{backgroundColor: 'green', flex: 1}}></View>
                    </TabNavigator.Item>
                    <TabNavigator.Item
                        selected={this.state.selectedTab === 'tb_my'}
                        title="我的"
                        selectedTitleStyle={{color: 'blue'}}
                        renderIcon={() => <Image style={styles.image} source={require('../../res/images/ic_my.png')}/>}
                        renderSelectedIcon={() => <Image style={[styles.image, {tintColor: 'blue'}]}
                                                         source={require('../../res/images/ic_my.png')}/>}
                        onPress={() => this.setState({selectedTab: 'tb_my'})}>
                        <View style={{backgroundColor: 'blue', flex: 1}}></View>
                    </TabNavigator.Item>
                </TabNavigator>}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    image: {
        height: 22,
        width: 22,
    }
});
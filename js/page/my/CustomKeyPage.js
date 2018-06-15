/**
 * 添加Trending语言,Popular 关键字
 * @flow
 * **/

import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image
} from 'react-native'
import CheckBox from 'react-native-check-box'

import NavigationBar from '../../common/NavigationBar'
import ViewUtils from '../../util/ViewUtils'
import ArrayUtils from '../../util/ArrayUtils'
import LanguageDao, {FLAG_LANGUAGE} from '../../expand/dao/LanguageDao'

export default class CustomKeyPage extends Component {
    constructor(props) {
        super(props);
        this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_key)
        this.changeValues = []
        this.state = {
            dataArray: [],
        }
    }

    componentDidMount(){
        this.loadData()
    }

    loadData() {
        this.languageDao.fetch()
            .then(res => {
                console.log(1111)
                console.log(res)
                this.setState({
                    dataArray: res
                })
            })
            .catch(error => {
                console.log(error)
            })
    }

    onSave() {
        this.props.navigator.pop()
    }

    onBack() {
        this.props.navigator.pop()
    }

    renderView() {
        console.log(12222)
        if (!this.state.dataArray || this.state.dataArray.length === 0)return;
        var len = this.state.dataArray.length;
        var views = [];
        for (var i = 0, l = len - 2; i < l; i += 2) {
            views.push(
                <View key={i}>
                    <View style={styles.item}>
                        {this.renderCheckBox(this.state.dataArray[i])}
                        {this.renderCheckBox(this.state.dataArray[i + 1])}
                    </View>
                    <View style={styles.line}/>
                </View>
            )
        }
        views.push(
            <View key={len - 1}>
                <View style={styles.item}>
                    {len % 2 === 0 ? this.renderCheckBox(this.state.dataArray[len - 2]) : null}
                    {this.renderCheckBox(this.state.dataArray[len - 1])}
                </View>
            </View>
        )
        return views;
    }

    onClick(data){
        data.checked = !data.checked
        ArrayUtils.updateArray(this.changeValues,data)
    }

    renderCheckBox(data) {
        let leftText = data.name;
        return (
            <CheckBox
                style={{flex: 1, padding: 10}}
                onClick={()=>this.onClick(data)}
                leftText={leftText}
                checkedImage={<Image source={require('../../page/my/img/ic_check_box.png')}
                                     style={{tintColor: '#2196F3'}}/>}
                unCheckedImage={<Image source={require('../../page/my/img/ic_check_box_outline_blank.png')}
                                       style={{tintColor: '#2196F3'}}/>}
            />);
    }

    render() {
        let rightButton = <TouchableOpacity
            onPress={() => this.onSave()}
        >
            <View style={{margin: 10}}>
                <Text style={styles.title}>保存</Text>
            </View>
        </TouchableOpacity>
        return (
            <View style={styles.container}>
                <NavigationBar
                    title='自定义标签'
                    style={{backgroundColor: '#6495ED'}}
                    leftButton={ViewUtils.getLeftButton(() => this.onBack())}
                    rightButton={rightButton}
                    />
                <ScrollView>
                    {this.renderView()}
                </ScrollView>
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
    },
    title: {
        fontSize: 20,
        color: 'white'
    },
    line:{
        height:1,
        backgroundColor:'black'
    },
    item:{
        flexDirection:'row',
        alignItems:'center'
    }
})
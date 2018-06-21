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
    Image,
    Alert
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
        this.isRemoveKey = this.props.isRemoveKey?true:false;
        this.state = {
            dataArray: [],
        }
    }

    componentDidMount() {
        this.loadData()
    }

    loadData() {
        this.languageDao.fetch()
            .then(res => {
                this.setState({
                    dataArray: res
                })
            })
            .catch(error => {
                console.log(error)
            })
    }

    onSave() {
        if (this.changeValues.length === 0) {
            this.props.navigator.pop()
            return;
        }
        if(this.isRemoveKey) {
            this.changeValues.forEach(res => {
                ArrayUtils.remove(this.state.dataArray, res)
            })
        }
        //存入storage 缓存中
        this.languageDao.save(this.state.dataArray)
        this.props.navigator.pop()
    }

    onBack() {
        if (this.changeValues.length === 0) {
            this.props.navigator.pop()
            return
        }
        Alert.alert(
            '提示',
            '要保存修改吗?',
            [
                {
                    text: '不保存',
                    onPress: () => {
                        this.props.navigator.pop()
                    },
                    style: 'cancel'
                },
                {
                    text: '保存',
                    onPress: () => {
                         this.onSave()
                    }
                },
            ]
        )
    }

    renderView() {
        if (!this.state.dataArray || this.state.dataArray.length === 0) return;
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
        //最后一个,单行或无
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

    onClick(data) {
        data.checked = !data.checked
        ArrayUtils.updateArray(this.changeValues, data)
    }

    renderCheckBox(data) {
        let leftText = data.name;
        return (
            <CheckBox
                style={{flex: 1, padding: 10}}
                onClick={() => this.onClick(data)}
                leftText={leftText}
                isChecked={data.checked}
                checkedImage={<Image source={require('../../page/my/img/ic_check_box.png')}
                                     style={{tintColor: '#2196F3'}}/>}
                unCheckedImage={<Image source={require('../../page/my/img/ic_check_box_outline_blank.png')}
                                       style={{tintColor: '#2196F3'}}/>}
            />);
    }

    render() {
        let title = this.isRemoveKey ?'标签移除':'自定义标签';
        let rightButtonTitle=this.isRemoveKey? '移除':'保存';

        let navigationBar = <NavigationBar
            title={title}
            style={{backgroundColor: '#2196F3'}}
            leftButton={ViewUtils.getLeftButton(() => this.onBack())}
            rightButton={ViewUtils.getRightButton(rightButtonTitle,()=>this.onSave())}/>
        return (
            <View style={styles.container}>
                {navigationBar}
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
    line: {
        height: 1,
        backgroundColor: 'black'
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center'
    }
})
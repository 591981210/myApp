/**
 * Created by penn on 2016/12/21.
 */
import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    Image,
} from 'react-native'

export default class RepositoryCell extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isFavorite: this.props.projectModel,
            favoriteIcon: this.props.projectModel.isFavorite?require('../../res/images/ic_star.png') :require('../../res/images/ic_unstar_transparent.png'),
        }
    }
    setFavoriteState(isFavorite) {
        this.setState({
            isFavorite: isFavorite,
            favoriteIcon: isFavorite ? require('../../res/images/ic_star.png') : require('../../res/images/ic_unstar_transparent.png')
        })
    }

    componentWillReceiveProps(nextProps) {
        this.setFavoriteState(nextProps.projectModel.isFavorite)
    }

    onPressFavorite() {
        this.setFavoriteState(!this.state.isFavorite)
        this.props.onFavorite(this.props.projectModel.item, !this.state.isFavorite)
    }

    render() {
        let item = this.props.projectModel.item?this.props.projectModel.item:this.props.projectModel;
        let favoriteButton=
            <TouchableOpacity
                style={{padding:6}}
                onPress={()=>this.onPressFavorite()} underlayColor='transparent'>
                <Image
                    ref='favoriteIcon'
                    style={[{width: 22, height: 22,},{tintColor:"#2196F3"}]}
                    source={this.state.favoriteIcon}/>
            </TouchableOpacity>
        return (
            <TouchableOpacity
                onPress={this.props.onSelect}
                style={styles.container}
            >
                <View style={styles.cell_container}>
                    <Text style={styles.title}>{item.full_name}</Text>
                    <Text style={styles.description}>{item.description}</Text>
                    <View style={styles.row}>
                        <View style={styles.row}>
                            <Text>Author:</Text>
                            <Image
                                style={{height: 22, width: 22}}
                                source={{uri: item.owner.avatar_url}}
                            />
                        </View>
                        <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
                            <Text>Star:</Text>
                            <Text>{item.stargazers_count}</Text>
                        </View>
                        {favoriteButton}
                    </View>


                </View>
            </TouchableOpacity>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,

    },
    row: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        fontSize: 16,
        marginBottom: 2,
        color: '#212121',
        flex: 1
    },
    description: {
        fontSize: 14,
        marginBottom: 2,
        color: '#757575'
    },
    cell_container: {
        backgroundColor: 'white',
        padding: 10,
        marginLeft: 5,
        marginRight: 5,
        marginVertical: 3,
        //等于 margin:3 0
        borderColor: '#dddddd',
        borderWidth: 0.5,
        borderRadius: 2,
        //IOS 阴影
        shadowColor: 'gray',
        shadowOffset: {width:0.5, height: 0.5},
        shadowOpacity: 0.4,
        shadowRadius: 1,
        //安卓的阴影
        elevation:2
    },
})

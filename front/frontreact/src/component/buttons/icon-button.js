import React from 'react';
import { connect } from 'react-redux';
import styles from './icon-button.module.css';
import {setshuffle} from'../../actions/index'
class IconButton extends React.Component { 
    constructor(props) {
      super(props);
      this.state = {
        isActive: false,
      }
    } 

    render() {
      return (
        <button 
            className={`${styles.iconButton} ${this.state.isActive ? "activeIcon" : ""}`} 
            onClick={()=>{
              if('shuffleicon' in this.props){
                this.props.setshuffle(!this.state.isActive)
              };
              this.setState({ isActive: !this.state.isActive })}}
        >
            {this.state.isActive ?  this.props.activeicon :  this.props.icon }
        </button>
      );
    }
  
}
const mapStateToProps=(state) => {
  return{
    shuffle:state.shuffle
  }
}
export default connect(mapStateToProps,{setshuffle}) (IconButton)
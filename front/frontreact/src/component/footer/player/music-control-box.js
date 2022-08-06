import { connect } from "react-redux";
import { changeTrack, setshuffle,setshufflekey } from "../../../actions";
import * as Icons from "../../icons";
import IconButton from "../../buttons/icon-button";
import PlayButton from "../../buttons/play-button";
import styles from "./music-control-box.module.css";
import { useEffect } from "react";
import * as Hammer from "hammerjs";
import { Loader } from "@mantine/core";
function MusicControlBox(props) {
	function lefthandle(e){
		if (e.isFinal) {
			increaseIndex();
		}
	}
	function righthandle(e){
		if (e.isFinal) {
			decreaseIndex();
		}
	}
	useEffect(() => {
		if (props.large) {
			const element=document.getElementById("swipable")
			var hammer = new Hammer(element);
			hammer.on("swipeleft",lefthandle);
			hammer.on("swiperight",righthandle);
		}	
		return () => {
			if(props.large){
			hammer.off('swipeleft',lefthandle)
			hammer.off('swiperight',righthandle)
		}
		};
	
	}, [props.trackData]);
	function decreaseIndex() {
		if(!props.shuffle){
		if (props.trackData.trackKey[1] == 0) {
		} else {
			props.changeTrack([
				props.trackData.trackKey[0],
				props.trackData.trackKey[1] - 1,
			]);
		}}
		else{
			if (
				props.trackData.trackKey[1] ==0	
			) {
				props.changeTrack([
					props.trackData.trackKey[0],
					props.shufflelist[props.playlistdata[props.trackData.trackKey[0]].playlistData.length -
					1],
				]);
				props.setshufflekey(props.playlistdata[props.trackData.trackKey[0]].playlistData.length -
					1);
			} else {
				props.changeTrack([
					props.trackData.trackKey[0],
					props.shufflelist[props.shufflekey - 1],
				]);
				props.setshufflekey(props.shufflekey - 1);
			}
		}
	}
	function increaseIndex() {
		if(!props.shuffle){
		if (
			props.trackData.trackKey[1] ==
			props.playlistdata[props.trackData.trackKey[0]].playlistData.length - 1
		) {
		} else {
			props.changeTrack([
				props.trackData.trackKey[0],
				parseInt(props.trackData.trackKey[1]) + 1,
			]);
		}}else{
			if (
				props.trackData.trackKey[1] ===
				props.playlistdata[props.trackData.trackKey[0]].playlistData.length -
					1
			) {
				props.changeTrack([
					props.trackData.trackKey[0],
					props.shufflelist[0],
				]);
				props.setshufflekey(0);
			} else {
				props.changeTrack([
					props.trackData.trackKey[0],
					props.shufflelist[props.shufflekey + 1],
				]);
				props.setshufflekey(props.shufflekey + 1);
			}
		
		}
	}

	return (
		<div className={styles.musicControl}>
			<IconButton
				icon={<Icons.Mix />}
				activeicon={<Icons.Mix />}
				shuffleicon={true}
			/>
			<button className={styles.button} onClick={decreaseIndex}>
				<Icons.Prev />
			</button>
			{props.loading ? <Loader/>:<PlayButton isthisplay={true} large={props.large} /> }
			<button className={styles.button} onClick={increaseIndex}>
				<Icons.Next />
			</button>
			<IconButton icon={<Icons.Loop />} activeicon={<Icons.Loop />} />
		</div>
	);
}

const mapStateToProps = (state) => {
	return {
		trackData: state.trackData,
		shufflelist:state.shufflelist,
		shuffle:state.shuffle,
		playlistdata:state.playlistdata,
		shufflekey:state.shufflekey
	};
};

export default connect(mapStateToProps, { changeTrack, setshuffle,setshufflekey })(
	MusicControlBox
);

import { connect } from "react-redux";
import TextRegularM from "../text/text-regular-m";
import TitleS from "../text/title-s";
import styles from "./footer-left.module.css";
import { useState, useEffect } from "react";
import * as Icons from "../icons";
import MusicControlBox from "./player/music-control-box";
import FooterRight from "./footer-right";
import MusicProgressBar from "./player/music-progress-bar";
import CONST from "../../constants/index";
import { colors } from "../../constants/index";
function FooterLeft(props) {
	const [open, setopen] = useState(false);
	const [color, setcolor] = useState("#A92E9F");
	useEffect(() => {
		setcolor(colors[Math.round(Math.random() * colors.length)]);
	}, [props.trackData]);

	return (
		<div>
			{!open && (
				<div
					className={styles.footerLeft}
					onClick={(e) => {
						setopen(true);
						
					}}
				>
					<ImgBox trackData={props.trackData} />
					<SongDetails trackData={props.trackData} />
				</div>
			)}
			{open && (
				<div
					className={styles.full}
					id="swipable"
					style={{
						background: `linear-gradient(to bottom,${color}, #000000)`
					}}
				>
					<div
						className={styles.close}
						onClick={() => {
							setopen(false);
						}}
					>
						<button className="downBtn">
							<Icons.Nextpage />
						</button>
					</div>
					<ImgBox2 trackData={props.trackData} />
					<SongDetails2 trackData={props.trackData} />
					{props.width < CONST.MOBILE_SIZE && (
						<MusicProgressBar
							duration={props.duration}
							currentTime={props.currentTime}
							handleTrackClick={props.handleTrackClick}
						/>
					)}
					{props.width < CONST.MOBILE_SIZE && <MusicControlBox large={true} />}
					{props.width < CONST.MOBILE_SIZE && (
						<FooterRight volume={props.volume} setVolume={props.setVolume} />
					)}
				</div>
			)}
		</div>
	);
}

function ImgBox({ trackData }) {
	return (
		<div className={styles.imgBox}>
			<img src={trackData.trackImg} alt="Gavurlar" />
		</div>
	);
}

function SongDetails({ trackData }) {
	return (
		<div className={styles.songDetails}>
			<TextRegularM>{trackData.trackName}</TextRegularM>
			<TextRegularM>{trackData.trackArtist}</TextRegularM>
		</div>
	);
}

function ImgBox2({ trackData }) {
	return (
		<div className={styles.imgBox2}>
			<img src={trackData.trackImg} alt="Gavurlar" />
		</div>
	);
}

function SongDetails2({ trackData }) {
	return (
		<div className={styles.songDetails}>
			<TitleS>{trackData.trackName}</TitleS>
			<TextRegularM>
				<small>{trackData.trackArtist}</small>
			</TextRegularM>
		</div>
	);
}

const mapStateToProps = (state) => {
	return {
		trackData: state.trackData
	};
};

export default connect(mapStateToProps)(FooterLeft);

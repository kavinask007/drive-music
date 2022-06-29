import { useSelector, useDispatch } from "react-redux";
import { setnavmenu } from "../../actions";
import { useState, useEffect } from "react";
import { get_redirect_uri, get_token,endpoint } from "../../constants";

export default function NavMenu() {
	const navmenu = useSelector((state) => state.navmenu);
	const navX = useSelector((state) => state.navX);
	const navY = useSelector((state) => state.navY);
	const dispatch = useDispatch();
	const [drivename, setdrivename] = useState("");
	const [driveimg,setdriveimg]=useState('')
	useEffect(() => {
		fetch(endpoint+"/api/drivename/",{
			method: "GET",
			headers: {
				'Authorization':get_token()
			},
		  })
			.then((response) => {
				if (response.ok) {
					return response.json();
				} else {
					return {
						drive: "",
						img:''
					};
				}
			})
			.then((data) => {
				setdrivename(data["drive"]);
				setdriveimg(data['img'])
			});
	}, [navmenu]);
	return (
		<div>
			{navmenu && (
				<div>
					<div
						className="layer"
						onClick={(e) => {
							if (e.target === e.currentTarget) {
								dispatch(setnavmenu(false));
							}
						}}
					></div>
					<div
						className="context-menu"
						style={{ left: `${navX - 90}px`, top: `${navY + 15}px` }}
					>
						{drivename != "" ? (
							<div className="item12"><img className='driveimg'src={driveimg}></img><div>{drivename}</div></div>
						) : (
							<div
								className="item12"
								onClick={() => {
									window.location.replace(
									get_redirect_uri()	
									);
								}}
							>
								Link Google drive
							</div>
						)}
						{drivename!="" && <div className="item12" onClick={() => {
									window.location.replace(
									get_redirect_uri()	
									);
								}}
							>
								Change drive account
							</div>}
						<div className="item12" onClick={() => {
							fetch("/api/logout").then((res) => {
								if (res.ok) {
								window.localStorage.removeItem('token')
								  window.location.href = "/login";
								}
							  })
						}}>
							Logout
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

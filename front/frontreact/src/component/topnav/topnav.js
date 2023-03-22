import styles from "./topnav.module.css";
import PrevPageBtn from "../buttons/prev-page-button";
import NextPageBtn from "../buttons/next-page-button";
import { useSelector, useDispatch } from "react-redux";
import { setnavmenu, setnavX, setnavY } from "../../actions";
function Topnav() {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  function handleuserclick(e) {
    dispatch(setnavX(e.clientX));
    dispatch(setnavY(e.clientY));
    dispatch(setnavmenu(true));
  }
  return (
    <nav className={styles.Topnav}>
      <div>
        <span>
          <PrevPageBtn />
          <NextPageBtn />
        </span>
        <span>
          <span className="userimage">
            <img
              src={
                "https://avatars.dicebear.com/api/avataaars/" + user + ".svg"
              }
            />
          </span>
          <button className={styles.ProfileBtn} onClick={handleuserclick}>
            {user}
          </button>
        </span>
      </div>
    </nav>
  );
}

export default Topnav;

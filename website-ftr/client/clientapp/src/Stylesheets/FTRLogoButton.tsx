import { Link } from "react-router-dom";
import front_logo from '../assets/big-ftr-logo.png';

const FTRLogoButton = () => {
    return(
        <Link to="/">
            <img src={front_logo} width="306" height="100" />
        </Link>
    );
};

export default FTRLogoButton;
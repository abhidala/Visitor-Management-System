import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { getLoginInfo } from '../utils/LoginInfo';
import custom_axios from '../axios/AxiosSetup';
import { ApiConstants } from '../api/ApiConstants';

interface UserModel {
  userId: number,
  userName: string;
  shiftTime: string;
  designation: string;
  contactNumberL: number;
  contactNumberM: number;
  address: string;
  userType: string;
  photoImage: string;

}

const DropdownUser = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [userdata, setUserData] = useState<UserModel[]>([]);

  const trigger = useRef<any>(null);
  const dropdown = useRef<any>(null);
  const name = getLoginInfo()?.userName;
  const userType = getLoginInfo()?.userType;

  const findUser = async () => {
    const userId = getLoginInfo()?.userId;
    const response = await custom_axios.get(ApiConstants.USER.FindOne(userId));
    setUserData([response.data]);

  }
  // useEffect(() => {
  //   console.log(userdata)},[userdata])
  useEffect(() => {
    findUser()
  }, [])
  console.log("%%%%%%%%%%%", userdata)
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!dropdown.current) return;
      if (
        !dropdownOpen ||
        dropdown.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setDropdownOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  return (
    <div className="relative">
      <Link
        ref={trigger}
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-4"
        to="#"
      >
        <span className="hidden text-right lg:block">
          <span className="block text-sm font-medium text-green-800">
            Logged In({userType}) : {name}
          </span>
          {/* <span className="block text-xs">UX Designer</span> */}
        </span>

          {userdata?.length > 0 ? (
            <img
            className="w-14 h-14 object-cover rounded"
              src={`data:image/jpeg;base64,` +userdata[0].photoImage}
              alt="Userimage"/>
          ) : (
            <img
            className="w-12 h-12 object-cover rounded"
              src='https://picsum.photos/536/354'
              alt="Userimage" />
          )}

      </Link>
    </div>
  );
};

export default DropdownUser;

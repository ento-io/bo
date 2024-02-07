import { ChangeEvent, useRef } from 'react';

import { useTheme } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { useDispatch } from 'react-redux';

import { FiCamera } from 'react-icons/fi';
import { uploadCurrentUserProfileImage } from '@/redux/actions/user.action';

const ProfilePicUploadButton = () => {
  const theme = useTheme();
  const inputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();

  const handleUploadClick = () => {
    if (!inputRef.current) return;
    inputRef.current.click();
  };

  // Upload action goes there
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    dispatch(uploadCurrentUserProfileImage(file));
  };

  return (
    <>
      <input style={{ display: 'none' }} type="file" onChange={handleFileChange} ref={inputRef} />
      <IconButton
        onClick={handleUploadClick}
        size="small"
        sx={{
          bgcolor: 'white',
          fontSize: 16,
          boxShadow: theme.shadows[2],
          ':hover': { bgcolor: 'white', color: theme.palette.primary.main },
          color: theme.palette.mode === 'light' ? '#000' : theme.palette.background.default,
        }}>
        <FiCamera fontSize="inherit" />
      </IconButton>
    </>
  );
};

export default ProfilePicUploadButton;

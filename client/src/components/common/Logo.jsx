import { Typography, useTheme } from '@mui/material';
import { Link } from "react-router-dom";
const Logo = () => {
  const theme = useTheme();

  return (
    <Link
    to="/"
    style={{ color: "unset", textDecoration: "none" }}
  >
    <Typography fontWeight="700" fontSize="1.7rem">
      Movie<span style={{ color: theme.palette.primary.main }}>Library</span>
    </Typography>
    </Link>
  );
};

export default Logo;
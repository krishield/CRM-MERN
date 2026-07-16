import { NavLink } from 'react-router-dom';
import { Tabs, Tab, styled } from '@mui/material';
import { AppBar, Toolbar } from "@material-ui/core";
import { useState } from 'react';;

const Header = styled(AppBar)`
  background : #4AAF12;
   
`;

const TabbContainer = styled(Tabs)`
  display: flex;
  justify-content: space-between;
`;

const Tabb = styled(Tab)`
  color: white;
  font-weight: bold;
  font-size: 18px;
  transition: all 0.1s ease-in-out;


&:hover {
  background-color: rgba(255, 255, 255, 0.08);
  border-radius: 4px;
  font-size: 20px;
  
}
.MuiTab-wrapper {
  transition: all 1.3s ease-in-out;
}
&.Mui-selected {
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 20px;

}
`;

const NavBar = () => {

  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Header position="static">
      <Toolbar>
        <TabbContainer value={value} onChange={handleChange}>
          <Tabb label="Home" to="/pending" component={NavLink} />
          <Tabb label="Login" to="/checked" component={NavLink} />
          <Tabb label="Data" to="/completed" component={NavLink} />
          <Tabb label="Register" to="/orders" component={NavLink} />
        </TabbContainer>
      </Toolbar>
    </Header>
  );
};

export default NavBar;

// import { Box, Container, Toolbar } from '@mui/material';
// import React, { ReactNode, useState } from 'react';
// import Appbar from '../Appbar';

// interface LayoutProps {
//   children: React.ReactNode;
//   headerProps?: any;
//   appBarTitle: string
// }

// const Layout: React.FC<LayoutProps> & {
//   Header: React.FC<{ component: React.FC<any>; props?: any }>;
//   Body: React.FC<{ children: React.ReactNode }>;
//   Footer: React.FC<{ children: React.ReactNode }>;
// } = ({ children, headerProps, appBarTitle }) => {

//   const [isModalOpen, setModalOpen] = useState(false);
//   const toggleModal = () => setModalOpen((prev) => !prev);



//   return (
//     <Box sx={{ display: "flex" }}>
//       <Appbar appBarTitle={appBarTitle} />
//       <Box
//         component="main"
//         sx={{
//           backgroundColor: (theme) =>
//             theme.palette.mode === "light"
//               ? theme.palette.grey[100]
//               : theme.palette.grey[900],
//           flexGrow: 1,
//           height: "100vh",
//           overflow: "auto"
//         }}
//       >
//         <Toolbar />

//         <Container sx={{ mt: 4, mb: 4 }}>
//           {/* <>{children}</> */}
//           {React.Children.map(children, (child) =>
//             React.isValidElement(child) ? React.cloneElement(child, { toggleModal }) : child
//           )}
//         </Container>
//       </Box>
//     </Box>
//   )


// };

// const Header: React.FC<{ toggleModal: () => void,component: React.FC<any>; props?: any }> = ({ component: Component, props }) => (
//   <React.Fragment>
//     <Component {...props} />
//   </React.Fragment>
// );

// const Body: React.FC<{ toggleModal: () => void,children:ReactNode }> = ({ children }) => (
//   <React.Fragment>
//     {children}
//   </React.Fragment>
// );

// Layout.Header=Header;

// Layout.Body=Body;

// Layout.Footer = ({ children }) => (
//   <React.Fragment>
//     {children}
//   </React.Fragment>
// );

// export default Layout;






// import React, { ReactNode, useState } from 'react';
// import { Box, Container, Toolbar } from '@mui/material';
// import Appbar from '../Appbar';

// interface LayoutProps {
//   children: React.ReactNode;
//   appBarTitle: string;
// }

// interface ToggleModalProps {
//   toggleModal: () => void;
// }

// interface HeaderProps extends ToggleModalProps {
//   component: React.FC<ToggleModalProps>;
//   props?: any;
// }

// interface BodyProps extends ToggleModalProps {
//   children: ReactNode;
// }

// const Layout: React.FC<LayoutProps> & {
//   Header: React.FC<HeaderProps>;
//   Body: React.FC<BodyProps>;
// } = ({ children, appBarTitle }) => {

//   const [isModalOpen, setModalOpen] = useState(false);

//   const toggleModal = () => setModalOpen((prev) => !prev);

//   return (
//     <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
//       <Appbar appBarTitle={appBarTitle} />
//       <Box
//         component="main"
//         sx={{
//           backgroundColor: (theme) =>
//             theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
//           flexGrow: 1,
//           overflow: 'auto',
//         }}
//       >
//         <Toolbar />
//         <Container sx={{ mt: 4, mb: 4 }}>
//           {React.Children.map(children, (child) =>
//             React.isValidElement(child)
//               ? React.cloneElement(child as React.ReactElement<ToggleModalProps>, { toggleModal })
//               : child
//           )}
//         </Container>
//       </Box>
//     </Box>
//   );
// };

// const Header: React.FC<HeaderProps> = ({ component: Component, props, toggleModal }) => (
//   <React.Fragment>
//     <Component {...props} toggleModal={toggleModal} />
//   </React.Fragment>
// );

// const Body: React.FC<BodyProps> = ({ children }) => <React.Fragment>{children}</React.Fragment>;

// Layout.Header = Header;
// Layout.Body = Body;

// export default Layout;




import React, { ReactNode, useState, useCallback } from 'react';
import { Box, Container, Toolbar } from '@mui/material';
import Appbar from '../Appbar';
import { GridTableProps } from '../../types/gridTable';

// Types
interface LayoutProps {
  children: ReactNode;
  appBarTitle: string;
}

interface HeaderProps {
  component: React.ComponentType<{ toggleModal?: () => void }>;
  props?: Record<string, unknown>;
}

interface BodyProps {
  component: React.ComponentType<GridTableProps & { toggleModal?: () => void }>;
  props: GridTableProps;
}




// Main Layout Component
const Layout: React.FC<LayoutProps> & {
  Header: React.FC<HeaderProps>;
  Body: React.FC<BodyProps>;
} = ({ children, appBarTitle }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const toggleModal = useCallback((selectedId = null) => {
    setModalOpen(prev => !prev);
    setSelectedId(prev => (prev ? null : selectedId && typeof selectedId === 'string' ? selectedId : null));
  }, []);


  return (
    <Box sx={{ display: 'flex', }}>
      <Appbar appBarTitle={appBarTitle} />
      <Box
        component="main"
        sx={{
          backgroundColor: (theme) => theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
          flexGrow: 1,
          overflow: 'auto',
          height: "100vh",
        }}
      >
        <Toolbar />
        <Container sx={{ mt: 4, mb: 4 }}>
          {React.Children.map(children, child => {
            if (!React.isValidElement(child)) return child;
            return React.cloneElement(child as React.ReactElement<any>, {
              props: {
                ...child.props.props,
                toggleModal,
                isModalOpen,
                selectedId
              },
            });
          })}
        </Container>
      </Box>
    </Box>
  );


};


const Header: React.FC<HeaderProps> = ({ component: Component, props }) => (
  <Component {...props} />
);

const Body: React.FC<BodyProps> = ({ component:Component,props }) => (
  <Component {...props} />
);

Layout.Header = Header;
Layout.Body = Body;

export default Layout;
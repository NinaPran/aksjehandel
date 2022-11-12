import { FC, PropsWithChildren } from 'react';
import { NavMenu } from './components/NavMenu';

// Functional component
export const Layout: FC<PropsWithChildren> = (props) => {
    return (
        <div>
        <NavMenu />
        <div>
          {props.children}
        </div>
      </div>
    );
}

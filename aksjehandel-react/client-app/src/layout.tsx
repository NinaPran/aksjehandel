import { FC, PropsWithChildren } from 'react';
import { NavMenu } from './components/nav-menu';

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
